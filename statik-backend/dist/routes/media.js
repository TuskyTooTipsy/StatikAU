"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mediaRouter;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importStar(require("express"));
const zod_1 = require("zod");
const crypto_1 = require("crypto");
const auth_1 = require("../lib/auth");
const env_1 = require("../lib/env");
const store_1 = require("../lib/store");
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALL_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const SIGNING_SECRET = env_1.env.ADMIN_PASSWORD || 'statik-local-upload-secret';
function signUpload(uploadId, assetId, expiresAt) {
    return (0, crypto_1.createHmac)('sha256', SIGNING_SECRET).update(`${uploadId}:${assetId}:${expiresAt}`).digest('hex');
}
function ensureUploadPermission(viewer, ownerType, ownerId) {
    const db = (0, store_1.readDb)();
    if (ownerType === 'profile')
        return viewer.profile.id === ownerId;
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
    return false;
}
function mediaRouter() {
    const router = (0, express_1.Router)();
    router.post('/uploads/init', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            ownerType: zod_1.z.enum(['profile', 'vehicle', 'profile_post', 'community', 'community_post', 'event']),
            ownerId: zod_1.z.string().min(1),
            fileName: zod_1.z.string().min(1).max(200),
            mimeType: zod_1.z.string().min(1),
            size: zod_1.z.number().int().positive().max((0, env_1.getMaxUploadBytes)()),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid upload payload' });
        const viewer = req.viewer;
        if (!ALL_TYPES.includes(parsed.data.mimeType)) {
            return res.status(400).json({ error: 'Unsupported file type' });
        }
        if (!ensureUploadPermission(viewer, parsed.data.ownerType, parsed.data.ownerId) && parsed.data.ownerType !== 'event') {
            return res.status(403).json({ error: 'Not allowed to upload to this target' });
        }
        const created = (0, store_1.mutateDb)((db) => {
            const uploadId = (0, store_1.createId)('upload');
            const assetId = (0, store_1.createId)('asset');
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
                createdAt: (0, store_1.nowIso)(),
                updatedAt: (0, store_1.nowIso)(),
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
                createdAt: (0, store_1.nowIso)(),
                expiresAt,
            });
            (0, store_1.logAudit)(db, viewer.user.id, 'media_upload_initialized', 'media', assetId, parsed.data.ownerType);
            return { uploadId, assetId, expiresAt };
        });
        const signature = signUpload(created.uploadId, created.assetId, created.expiresAt);
        return res.status(201).json({
            assetId: created.assetId,
            uploadId: created.uploadId,
            uploadUrl: `${(0, env_1.getPublicServerUrl)()}/api/media/uploads/${created.uploadId}?asset=${created.assetId}&expires=${encodeURIComponent(created.expiresAt)}&sig=${signature}`,
            maxBytes: (0, env_1.getMaxUploadBytes)(),
        });
    });
    router.put('/uploads/:uploadId', express_1.default.raw({ type: '*/*', limit: (0, env_1.getMaxUploadBytes)() }), async (req, res) => {
        const assetId = typeof req.query.asset === 'string' ? req.query.asset : '';
        const expires = typeof req.query.expires === 'string' ? req.query.expires : '';
        const sig = typeof req.query.sig === 'string' ? req.query.sig : '';
        const uploadId = req.params.uploadId;
        if (!assetId || !expires || !sig)
            return res.status(400).json({ error: 'Invalid upload signature' });
        if (sig !== signUpload(uploadId, assetId, expires))
            return res.status(403).json({ error: 'Upload signature mismatch' });
        if (new Date(expires).getTime() < Date.now())
            return res.status(410).json({ error: 'Upload URL expired' });
        if (!Buffer.isBuffer(req.body))
            return res.status(400).json({ error: 'Binary file body required' });
        try {
            (0, store_1.mutateDb)((db) => {
                const upload = db.pendingUploads.find((item) => item.id === uploadId && item.assetId === assetId);
                const asset = db.mediaAssets.find((item) => item.id === assetId);
                if (!upload || !asset)
                    throw new Error('Upload session not found');
                if (upload.status === 'uploaded')
                    throw new Error('Upload already completed');
                if (req.body.length > upload.size)
                    throw new Error('Uploaded file exceeds declared size');
                const ext = path_1.default.extname(upload.fileName).replace(/[^a-zA-Z0-9.]/g, '') || (upload.mimeType.startsWith('video/') ? '.mp4' : '.jpg');
                const storageKey = `${asset.id}${ext}`;
                fs_1.default.writeFileSync(path_1.default.join(store_1.UPLOADS_DIR, storageKey), req.body);
                upload.status = 'uploaded';
                asset.storageKey = storageKey;
                asset.url = `${(0, env_1.getPublicServerUrl)()}/uploads/${storageKey}`;
                asset.status = 'uploaded';
                asset.updatedAt = (0, store_1.nowIso)();
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not save upload' });
        }
        return res.json({ success: true, assetId, url: `${(0, env_1.getPublicServerUrl)()}/uploads/${path_1.default.basename((0, store_1.readDb)().mediaAssets.find((item) => item.id === assetId)?.storageKey || '')}` });
    });
    router.delete('/assets/:assetId', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        const asset = (0, store_1.getMedia)((0, store_1.readDb)(), req.params.assetId);
        if (!asset)
            return res.status(404).json({ error: 'Media not found' });
        if (asset.ownerUserId !== viewer.user.id && viewer.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not allowed to delete this media' });
        }
        (0, store_1.mutateDb)((db) => {
            const target = db.mediaAssets.find((item) => item.id === req.params.assetId);
            if (!target)
                return;
            (0, store_1.removeMediaFile)(target.storageKey);
            target.status = 'deleted';
            target.updatedAt = (0, store_1.nowIso)();
            db.garageVehicles.forEach((vehicle) => {
                vehicle.mediaIds = vehicle.mediaIds.filter((id) => id !== target.id);
                if (vehicle.heroMediaId === target.id)
                    vehicle.heroMediaId = vehicle.mediaIds[0];
            });
            db.profilePosts.forEach((post) => {
                post.mediaIds = post.mediaIds.filter((id) => id !== target.id);
            });
            db.communityPosts.forEach((post) => {
                post.mediaIds = post.mediaIds.filter((id) => id !== target.id);
            });
            (0, store_1.logAudit)(db, viewer.user.id, 'media_deleted', 'media', target.id);
        });
        return res.json({ success: true });
    });
    return router;
}
