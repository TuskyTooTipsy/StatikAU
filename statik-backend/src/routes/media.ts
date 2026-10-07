import fs from 'fs';
import path from 'path';
import express, { Request, Router } from 'express';
import { z } from 'zod';
import { createHmac } from 'crypto';
import { requireAuth } from '../lib/auth';
import { env, getMaxUploadBytes, getPublicServerUrl, getStoragePublicUrl } from '../lib/env';
import { UPLOADS_DIR, createId, getMedia, logAudit, mutateDb, nowIso, readDb, removeMediaFile } from '../lib/store';

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.m4v': 'video/mp4',
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALL_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const DEVELOPMENT_UPLOAD_SIGNING_SECRET = 'statik-local-upload-secret';

function getUploadSigningSecret() {
  if (env.UPLOAD_SIGNING_SECRET) return env.UPLOAD_SIGNING_SECRET;
  if (env.NODE_ENV === 'production') {
    throw new Error('UPLOAD_SIGNING_SECRET must be configured before upload URLs can be signed.');
  }
  return DEVELOPMENT_UPLOAD_SIGNING_SECRET;
}

function inferMimeType(fileName: string, incomingMimeType: string) {
  if (incomingMimeType && incomingMimeType !== 'application/octet-stream') return incomingMimeType;
  const ext = path.extname(fileName || '').toLowerCase();
  return MIME_BY_EXT[ext] || incomingMimeType || 'application/octet-stream';
}

function resolveServerOrigin(req?: Request) {
  if (env.PUBLIC_SERVER_URL) return getPublicServerUrl();
  const host = req?.get('host');
  const proto = req?.get('x-forwarded-proto') || req?.protocol || 'http';
  return host ? `${proto}://${host}` : getPublicServerUrl();
}

function signUpload(uploadId: string, assetId: string, expiresAt: string) {
  return createHmac('sha256', getUploadSigningSecret()).update(`${uploadId}:${assetId}:${expiresAt}`).digest('hex');
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
    return !!community && (community.ownerUserId === viewer.user.id || community.adminUserIds.includes(viewer.user.id) || viewer.user.role === 'admin');
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
  if (ownerType === 'content') {
    const content = db.contentItems.find((item) => item.id === ownerId);
    return viewer.user.role === 'admin' || !!content && content.authorUserId === viewer.user.id;
  }
  if (ownerType === 'business') {
    const business = db.businessListings.find((item) => item.id === ownerId);
    return viewer.user.role === 'admin' || !!business && business.ownerUserId === viewer.user.id;
  }
  return false;
}

export default function mediaRouter() {
  const router = Router();

  router.post('/uploads/init', requireAuth, async (req, res) => {
    const schema = z.object({
      ownerType: z.enum(['profile', 'vehicle', 'profile_post', 'community', 'community_post', 'event', 'content', 'business']),
      ownerId: z.string().min(1),
      fileName: z.string().min(1).max(200),
      mimeType: z.string().min(1),
      size: z.number().int().positive().max(getMaxUploadBytes()),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid upload payload' });
    const viewer = (req as any).viewer;
    const mimeType = inferMimeType(parsed.data.fileName, parsed.data.mimeType);

    if (!ALL_TYPES.includes(mimeType)) {
      return res.status(400).json({ error: `Unsupported file type: ${mimeType}` });
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
        kind: mimeType.startsWith('video/') ? 'video' : 'image',
        fileName: parsed.data.fileName,
        originalFilename: parsed.data.fileName,
        displayTitle: '',
        caption: '',
        altText: '',
        thumbnailUrl: '',
        mimeType,
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
        mimeType,
        size: parsed.data.size,
        status: 'pending',
        createdAt: nowIso(),
        expiresAt,
      });
      logAudit(db, viewer.user.id, 'media_upload_initialized', 'media', assetId, parsed.data.ownerType);
      return { uploadId, assetId, expiresAt };
    });

    const origin = resolveServerOrigin(req);
    const signature = signUpload(created.uploadId, created.assetId, created.expiresAt);
    return res.status(201).json({
      assetId: created.assetId,
      uploadId: created.uploadId,
      uploadUrl: `${origin}/api/media/uploads/${created.uploadId}?asset=${created.assetId}&expires=${encodeURIComponent(created.expiresAt)}&sig=${signature}`,
      maxBytes: getMaxUploadBytes(),
      acceptedMimeTypes: ALL_TYPES,
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
    if (req.body.length === 0) return res.status(400).json({ error: 'Uploaded file was empty' });

    try {
      mutateDb((db) => {
        const upload = db.pendingUploads.find((item) => item.id === uploadId && item.assetId === assetId);
        const asset = db.mediaAssets.find((item) => item.id === assetId);
        if (!upload || !asset) throw new Error('Upload session not found');
        if (upload.status === 'uploaded') throw new Error('Upload already completed');
        if (req.body.length > upload.size) throw new Error('Uploaded file exceeds declared size');
        const ext = path.extname(upload.fileName).replace(/[^a-zA-Z0-9.]/g, '') || (upload.mimeType.startsWith('video/') ? '.mp4' : '.jpg');
        const storageKey = `${asset.id}${ext}`;
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        fs.writeFileSync(path.join(UPLOADS_DIR, storageKey), req.body);
        upload.status = 'uploaded';
        asset.storageKey = storageKey;
        asset.url = `${getStoragePublicUrl()}/uploads/${storageKey}`;
        asset.status = 'uploaded';
        asset.updatedAt = nowIso();
        logAudit(db, upload.ownerUserId, 'media_upload_complete', 'media', asset.id, JSON.stringify({ ownerType: asset.ownerType, ownerId: asset.ownerId, size: req.body.length }));
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not save upload' });
    }

    const asset = readDb().mediaAssets.find((item) => item.id === assetId);
    return res.json({ success: true, assetId, url: asset?.url || '' });
  });


  router.patch('/assets/:assetId', requireAuth, async (req, res) => {
    const schema = z.object({
      displayTitle: z.string().max(120).optional(),
      caption: z.string().max(500).optional(),
      altText: z.string().max(180).optional(),
      ownerType: z.enum(['profile', 'vehicle', 'profile_post', 'community', 'community_post', 'event', 'content', 'business']).optional(),
      ownerId: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid media metadata payload' });
    const viewer = (req as any).viewer;
    let updated: any = null;
    try {
      mutateDb((db) => {
        const asset = db.mediaAssets.find((item) => item.id === req.params.assetId && item.status !== 'deleted');
        if (!asset) throw new Error('Media not found');
        if (asset.ownerUserId !== viewer.user.id && viewer.user.role !== 'admin') throw new Error('Not allowed to edit this media');
        const nextOwnerType = parsed.data.ownerType || asset.ownerType;
        const nextOwnerId = parsed.data.ownerId || asset.ownerId;
        if ((parsed.data.ownerType || parsed.data.ownerId) && !ensureUploadPermission(viewer, nextOwnerType, nextOwnerId)) throw new Error('Not allowed to attach media to this target');
        if (parsed.data.displayTitle !== undefined) asset.displayTitle = parsed.data.displayTitle.trim();
        if (parsed.data.caption !== undefined) asset.caption = parsed.data.caption.trim();
        if (parsed.data.altText !== undefined) asset.altText = parsed.data.altText.trim();
        asset.ownerType = nextOwnerType as any;
        asset.ownerId = nextOwnerId;
        asset.updatedAt = nowIso();
        updated = asset;
        logAudit(db, viewer.user.id, 'media_metadata_updated', 'media', asset.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not update media metadata' });
    }
    return res.json(updated);
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
      db.events.forEach((event) => {
        event.mediaIds = (event.mediaIds || []).filter((id) => id !== target.id);
      });
      db.contentItems.forEach((content) => {
        content.galleryMediaIds = content.galleryMediaIds.filter((id) => id !== target.id);
        if (content.heroMediaId === target.id) content.heroMediaId = undefined;
      });
      db.businessListings.forEach((business) => {
        business.galleryMediaIds = business.galleryMediaIds.filter((id) => id !== target.id);
        if (business.logoMediaId === target.id) business.logoMediaId = undefined;
        if (business.bannerMediaId === target.id) business.bannerMediaId = undefined;
      });
      logAudit(db, viewer.user.id, 'media_deleted', 'media', target.id);
    });

    return res.json({ success: true });
  });

  return router;
}
