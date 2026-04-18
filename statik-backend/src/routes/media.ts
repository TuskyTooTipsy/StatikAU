import fs from 'fs';
import path from 'path';
import express, { Router } from 'express';
import { z } from 'zod';
import { createHmac } from 'crypto';
import { requireAuth } from '../lib/auth';
import { env, getMaxUploadBytes, getPublicServerUrl } from '../lib/env';
import { UPLOADS_DIR, createId, getMedia, logAudit, mutateDb, nowIso, readDb, removeMediaFile } from '../lib/store';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALL_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const SIGNING_SECRET = env.ADMIN_PASSWORD || 'statik-local-upload-secret';

function signUpload(uploadId: string, assetId: string, expiresAt: string) {
  return createHmac('sha256', SIGNING_SECRET).update(`${uploadId}:${assetId}:${expiresAt}`).digest('hex');
}

function ensureUploadPermission(viewer: any, ownerType: string, ownerId: string) {
  const db = readDb();
  if (ownerType === 'profile') return viewer.profile.id === ownerId;
  if (ownerType === 'vehicle') {
    const vehicle = db.garageVehicles.find((item) => item.id === ownerId);
    return !!vehicle && vehicle.profileId === viewer.profile.id;
  }
  if (ownerType === 'community') {
    const community = db.communities.find((item) => item.id === ownerId);
    return !!community && (community.memberUserIds.includes(viewer.user.id) || community.ownerUserId === viewer.user.id || viewer.user.role === 'admin');
  }
  if (ownerType === 'community_post') {
    const post = db.communityPosts.find((item) => item.id === ownerId);
    const community = post ? db.communities.find((item) => item.id === post.communityId) : null;
    return !!post && !!community && (community.memberUserIds.includes(viewer.user.id) || viewer.user.role === 'admin');
  }
  if (ownerType === 'profile_post') {
    const post = db.profilePosts.find((item) => item.id === ownerId);
    return !!post && post.profileId === viewer.profile.id;
  }
  if (ownerType === 'event') {
    const event = db.events.find((item) => item.id === ownerId);
    if (!event) return false;
    if (event.createdByUserId === viewer.user.id || viewer.user.role === 'admin') return true;
    if (event.hostCommunityId) {
      const community = db.communities.find((item) => item.id === event.hostCommunityId);
      return !!community && (community.ownerUserId === viewer.user.id || community.adminUserIds.includes(viewer.user.id));
    }
    return false;
  }
  return false;
}

export default function mediaRouter() {
  const router = Router();

  router.post('/uploads/init', requireAuth, async (req, res) => {
    const schema = z.object({
      ownerType: z.enum(['profile', 'vehicle', 'profile_post', 'community', 'community_post', 'event']),
      ownerId: z.string().min(1),
      fileName: z.string().min(1).max(200),
      mimeType: z.string().min(1),
      size: z.number().int().positive().max(getMaxUploadBytes()),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid upload payload' });
    const viewer = (req as any).viewer;

    if (!ALL_TYPES.includes(parsed.data.mimeType)) {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    if (!ensureUploadPermission(viewer, parsed.data.ownerType, parsed.data.ownerId)) {
      return res.status(403).json({ error: 'Not allowed to upload to this target' });
    }

    const created = mutateDb((db) => {
      const uploadId = createId('upload');
      const assetId = createId('asset');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      db.mediaAssets.push({
        id: assetId,
        ownerUserId: viewer.user.id,
        ownerType: parsed.data.ownerType,
        ownerId: parsed.data.ownerId,
        kind: parsed.data.mimeType.startsWith('video/') ? 'video' : 'image',
        fileName: parsed.data.fileName,
        mimeType: parsed.data.mimeType,
        size: parsed.data.size,
        storageKey: '',
        url: '',
        status: 'pending',
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
      db.pendingUploads.push({
        id: uploadId,
        ownerUserId: viewer.user.id,
        ownerType: parsed.data.ownerType,
        ownerId: parsed.data.ownerId,
        assetId,
        fileName: parsed.data.fileName,
        mimeType: parsed.data.mimeType,
        size: parsed.data.size,
        status: 'pending',
        createdAt: nowIso(),
        expiresAt,
      });
      logAudit(db, viewer.user.id, 'media_upload_initialized', 'media', assetId, parsed.data.ownerType);
      return { uploadId, assetId, expiresAt };
    });

    const signature = signUpload(created.uploadId, created.assetId, created.expiresAt);
    return res.status(201).json({
      assetId: created.assetId,
      uploadId: created.uploadId,
      uploadUrl: `${getPublicServerUrl()}/api/media/uploads/${created.uploadId}?asset=${created.assetId}&expires=${encodeURIComponent(created.expiresAt)}&sig=${signature}`,
      maxBytes: getMaxUploadBytes(),
    });
  });

  router.put('/uploads/:uploadId', express.raw({ type: '*/*', limit: getMaxUploadBytes() }), async (req, res) => {
    const assetId = typeof req.query.asset === 'string' ? req.query.asset : '';
    const expires = typeof req.query.expires === 'string' ? req.query.expires : '';
    const sig = typeof req.query.sig === 'string' ? req.query.sig : '';
    const uploadId = req.params.uploadId;
    if (!assetId || !expires || !sig) return res.status(400).json({ error: 'Invalid upload signature' });
    if (sig !== signUpload(uploadId, assetId, expires)) return res.status(403).json({ error: 'Upload signature mismatch' });
    if (new Date(expires).getTime() < Date.now()) return res.status(410).json({ error: 'Upload URL expired' });
    if (!Buffer.isBuffer(req.body)) return res.status(400).json({ error: 'Binary file body required' });

    try {
      mutateDb((db) => {
        const upload = db.pendingUploads.find((item) => item.id === uploadId && item.assetId === assetId);
        const asset = db.mediaAssets.find((item) => item.id === assetId);
        if (!upload || !asset) throw new Error('Upload session not found');
        if (upload.status === 'uploaded') throw new Error('Upload already completed');
        if (req.body.length > upload.size) throw new Error('Uploaded file exceeds declared size');
        const ext = path.extname(upload.fileName).replace(/[^a-zA-Z0-9.]/g, '') || (upload.mimeType.startsWith('video/') ? '.mp4' : '.jpg');
        const storageKey = `${asset.id}${ext}`;
        fs.writeFileSync(path.join(UPLOADS_DIR, storageKey), req.body);
        upload.status = 'uploaded';
        asset.storageKey = storageKey;
        asset.url = `${getPublicServerUrl()}/uploads/${storageKey}`;
        asset.status = 'uploaded';
        asset.updatedAt = nowIso();
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not save upload' });
    }

    return res.json({ success: true, assetId, url: `${getPublicServerUrl()}/uploads/${path.basename(readDb().mediaAssets.find((item) => item.id === assetId)?.storageKey || '')}` });
  });

  router.delete('/assets/:assetId', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    const asset = getMedia(readDb(), req.params.assetId);
    if (!asset) return res.status(404).json({ error: 'Media not found' });
    if (asset.ownerUserId !== viewer.user.id && viewer.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed to delete this media' });
    }

    mutateDb((db) => {
      const target = db.mediaAssets.find((item) => item.id === req.params.assetId);
      if (!target) return;
      removeMediaFile(target.storageKey);
      target.status = 'deleted';
      target.updatedAt = nowIso();
      db.garageVehicles.forEach((vehicle) => {
        vehicle.mediaIds = vehicle.mediaIds.filter((id) => id !== target.id);
        if (vehicle.heroMediaId === target.id) vehicle.heroMediaId = vehicle.mediaIds[0];
      });
      db.profilePosts.forEach((post) => {
        post.mediaIds = post.mediaIds.filter((id) => id !== target.id);
      });
      db.communityPosts.forEach((post) => {
        post.mediaIds = post.mediaIds.filter((id) => id !== target.id);
      });
      logAudit(db, viewer.user.id, 'media_deleted', 'media', target.id);
    });

    return res.json({ success: true });
  });

  return router;
}
