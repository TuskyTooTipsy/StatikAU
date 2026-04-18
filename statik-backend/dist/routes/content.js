"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentPayloadSchema = void 0;
exports.default = contentRouter;
exports.upsertContentFromAdmin = upsertContentFromAdmin;
const express_1 = require("express");
const zod_1 = require("zod");
const env_1 = require("../lib/env");
const store_1 = require("../lib/store");
function parseList(value) {
    if (Array.isArray(value))
        return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
    if (typeof value === 'string')
        return value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 20);
    return [];
}
function contentRouter() {
    const router = (0, express_1.Router)();
    router.get('/:type', async (req, res) => {
        const type = req.params.type === 'news' ? 'news' : req.params.type === 'articles' ? 'article' : null;
        if (!type)
            return res.status(404).json({ error: 'Content type not found' });
        const db = (0, store_1.readDb)();
        const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
        const category = typeof req.query.category === 'string' ? req.query.category.toLowerCase() : '';
        const tag = typeof req.query.tag === 'string' ? req.query.tag.toLowerCase() : '';
        const items = (0, store_1.getPublishedContent)(db, type)
            .filter((item) => !q || [item.title, item.excerpt, item.body, item.category, item.tags.join(' ')].join(' ').toLowerCase().includes(q))
            .filter((item) => !category || item.category.toLowerCase() === category)
            .filter((item) => !tag || item.tags.some((value) => value.toLowerCase() === tag))
            .map((item) => {
            const mapped = (0, store_1.mapContentPublic)(db, item);
            return {
                ...mapped,
                canonicalShareUrl: `${(0, env_1.getPublicAppUrl)()}/${type === 'news' ? 'news' : 'articles'}/${item.slug}`,
            };
        });
        return res.json({ items, categories: Array.from(new Set((0, store_1.getPublishedContent)(db, type).map((item) => item.category).filter(Boolean))), tags: Array.from(new Set((0, store_1.getPublishedContent)(db, type).flatMap((item) => item.tags))) });
    });
    router.get('/:type/:slug', async (req, res) => {
        const type = req.params.type === 'news' ? 'news' : req.params.type === 'articles' ? 'article' : null;
        if (!type)
            return res.status(404).json({ error: 'Content type not found' });
        const db = (0, store_1.readDb)();
        const item = (0, store_1.getPublishedContent)(db, type).find((entry) => entry.slug === req.params.slug);
        if (!item)
            return res.status(404).json({ error: 'Content not found' });
        const publicItem = (0, store_1.mapContentPublic)(db, item);
        const short = (0, store_1.mutateDb)((runtime) => (0, store_1.findOrCreateShortLink)(runtime, {
            targetType: type === 'news' ? 'news' : 'article',
            targetId: item.id,
            ownerUserId: item.authorUserId || runtime.users.find((user) => user.role === 'admin')?.id || 'system',
            preferredSlug: item.slug,
        }));
        return res.json({
            ...publicItem,
            canonicalShareUrl: `${(0, env_1.getPublicAppUrl)()}/${type === 'news' ? 'news' : 'articles'}/${item.slug}`,
            shortLink: { ...short, shortUrl: `${(0, env_1.getPublicAppUrl)()}/s/${short.slug}`, qrUrl: `${(0, env_1.getPublicAppUrl)()}/s/${short.slug}?src=qr` },
        });
    });
    return router;
}
exports.contentPayloadSchema = zod_1.z.object({
    type: zod_1.z.enum(['article', 'news']),
    title: zod_1.z.string().min(3).max(160),
    slug: zod_1.z.string().max(100).optional(),
    excerpt: zod_1.z.string().max(500).optional().default(''),
    body: zod_1.z.string().max(20000).optional().default(''),
    heroMediaId: zod_1.z.string().optional().or(zod_1.z.literal('')),
    galleryMediaIds: zod_1.z.array(zod_1.z.string()).max(20).optional().default([]),
    category: zod_1.z.string().max(80).optional().default('General'),
    tags: zod_1.z.array(zod_1.z.string()).max(20).optional().default([]),
    authorDisplayName: zod_1.z.string().max(80).optional().default(''),
    status: zod_1.z.enum(['draft', 'pending', 'published', 'scheduled', 'archived']).optional().default('draft'),
    publishedAt: zod_1.z.string().optional().or(zod_1.z.literal('')),
    scheduledFor: zod_1.z.string().optional().or(zod_1.z.literal('')),
    featured: zod_1.z.boolean().optional().default(false),
    sponsored: zod_1.z.boolean().optional().default(false),
    sponsorBusinessId: zod_1.z.string().optional().or(zod_1.z.literal('')),
    relatedEventIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    relatedBusinessIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    relatedProfileIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    relatedCommunityIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    aiAssisted: zod_1.z.boolean().optional().default(false),
    metaTitle: zod_1.z.string().max(160).optional().default(''),
    metaDescription: zod_1.z.string().max(240).optional().default(''),
    adminNote: zod_1.z.string().max(500).optional().default(''),
});
function upsertContentFromAdmin(req, res, contentId) {
    const parsed = exports.contentPayloadSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid content payload' });
    const viewer = req.viewer;
    let savedId = contentId || '';
    try {
        (0, store_1.mutateDb)((db) => {
            const now = (0, store_1.nowIso)();
            let item = contentId ? db.contentItems.find((entry) => entry.id === contentId) : null;
            if (!item) {
                savedId = (0, store_1.createId)('content');
                item = {
                    id: savedId,
                    type: parsed.data.type,
                    slug: (0, store_1.uniqueSlug)(parsed.data.slug || parsed.data.title, db.contentItems.map((entry) => entry.slug)),
                    title: parsed.data.title,
                    excerpt: parsed.data.excerpt,
                    body: parsed.data.body,
                    heroMediaId: parsed.data.heroMediaId || undefined,
                    galleryMediaIds: parsed.data.galleryMediaIds,
                    category: parsed.data.category,
                    tags: parseList(parsed.data.tags),
                    authorUserId: viewer.user.id,
                    authorDisplayName: parsed.data.authorDisplayName,
                    status: parsed.data.status,
                    publishedAt: parsed.data.status === 'published' ? (parsed.data.publishedAt || now) : parsed.data.publishedAt || undefined,
                    scheduledFor: parsed.data.scheduledFor || undefined,
                    createdAt: now,
                    updatedAt: now,
                    featured: parsed.data.featured,
                    sponsored: parsed.data.sponsored,
                    sponsorBusinessId: parsed.data.sponsorBusinessId || undefined,
                    relatedEventIds: parsed.data.relatedEventIds,
                    relatedBusinessIds: parsed.data.relatedBusinessIds,
                    relatedProfileIds: parsed.data.relatedProfileIds,
                    relatedCommunityIds: parsed.data.relatedCommunityIds,
                    aiAssisted: parsed.data.aiAssisted,
                    metaTitle: parsed.data.metaTitle,
                    metaDescription: parsed.data.metaDescription,
                    adminNotes: parsed.data.adminNote ? [parsed.data.adminNote] : [],
                };
                db.contentItems.push(item);
            }
            else {
                db.contentRevisions.unshift({ id: (0, store_1.createId)('rev'), contentId: item.id, actorUserId: viewer.user.id, createdAt: now, snapshot: { ...item }, note: 'Before admin edit' });
                Object.assign(item, parsed.data, {
                    slug: parsed.data.slug ? (0, store_1.uniqueSlug)(parsed.data.slug, db.contentItems.filter((entry) => entry.id !== item.id).map((entry) => entry.slug)) : item.slug,
                    heroMediaId: parsed.data.heroMediaId || undefined,
                    sponsorBusinessId: parsed.data.sponsorBusinessId || undefined,
                    publishedAt: parsed.data.status === 'published' ? (parsed.data.publishedAt || item.publishedAt || now) : parsed.data.publishedAt || item.publishedAt,
                    scheduledFor: parsed.data.scheduledFor || undefined,
                    updatedAt: now,
                    adminNotes: parsed.data.adminNote ? [...(item.adminNotes || []), parsed.data.adminNote].slice(-20) : item.adminNotes,
                });
                savedId = item.id;
            }
            [...(item.galleryMediaIds || []), item.heroMediaId].filter(Boolean).forEach((mediaId) => {
                const asset = db.mediaAssets.find((media) => media.id === mediaId && media.ownerUserId === viewer.user.id);
                if (asset) {
                    asset.ownerType = 'content';
                    asset.ownerId = item.id;
                    asset.updatedAt = now;
                }
            });
            (0, store_1.logAudit)(db, viewer.user.id, contentId ? 'content_updated' : 'content_created', item.type, item.id, JSON.stringify({ status: item.status, title: item.title }));
        });
    }
    catch (error) {
        return res.status(400).json({ error: error.message || 'Could not save content' });
    }
    const db = (0, store_1.readDb)();
    const saved = db.contentItems.find((item) => item.id === savedId);
    return res.status(contentId ? 200 : 201).json(saved ? (0, store_1.mapContentPublic)(db, saved) : null);
}
