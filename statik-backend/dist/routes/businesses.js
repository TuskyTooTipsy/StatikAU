"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessPayloadSchema = exports.businessCategories = void 0;
exports.default = businessesRouter;
exports.upsertBusinessFromAdmin = upsertBusinessFromAdmin;
const express_1 = require("express");
const zod_1 = require("zod");
const env_1 = require("../lib/env");
const store_1 = require("../lib/store");
const auth_1 = require("../lib/auth");
exports.businessCategories = [
    'mechanic', 'performance tuning', 'dyno tuning', 'detailing', 'wraps/vinyl', 'paint/bodywork', 'panel beating', 'wheels/tyres', 'suspension', 'exhaust', 'fabrication', 'motorsport prep', 'parts supplier', '4x4 accessories', 'audio/electrical', 'tinting', 'photographers', 'videographers', 'apparel/merch', 'cafes/food trucks', 'transport/towing', 'insurance/finance', 'training/driver coaching', 'track/race services', 'event organizers', 'clubs/groups', 'other',
];
exports.businessPayloadSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(2).max(140),
    slug: zod_1.z.string().max(100).optional(),
    ownerUserId: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(['draft', 'pending', 'approved', 'rejected', 'suspended', 'archived']).optional().default('pending'),
    trusted: zod_1.z.boolean().optional().default(false),
    sponsored: zod_1.z.boolean().optional().default(false),
    featured: zod_1.z.boolean().optional().default(false),
    featuredUntil: zod_1.z.string().optional().nullable(),
    sponsoredUntil: zod_1.z.string().optional().nullable(),
    category: zod_1.z.string().max(80).optional().default('other'),
    subcategories: zod_1.z.array(zod_1.z.string()).max(20).optional().default([]),
    description: zod_1.z.string().max(4000).optional().default(''),
    services: zod_1.z.array(zod_1.z.string()).max(30).optional().default([]),
    specialties: zod_1.z.array(zod_1.z.string()).max(30).optional().default([]),
    region: zod_1.z.string().max(120).optional().default(''),
    address: zod_1.z.string().max(180).optional().default(''),
    locationDetails: zod_1.z.any().optional().nullable(),
    phone: zod_1.z.string().max(60).optional().default(''),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')).default(''),
    website: zod_1.z.string().url().optional().or(zod_1.z.literal('')).default(''),
    socialLinks: zod_1.z.array(zod_1.z.string()).max(10).optional().default([]),
    logoMediaId: zod_1.z.string().optional().or(zod_1.z.literal('')),
    bannerMediaId: zod_1.z.string().optional().or(zod_1.z.literal('')),
    galleryMediaIds: zod_1.z.array(zod_1.z.string()).max(20).optional().default([]),
    openingHours: zod_1.z.string().max(1000).optional().default(''),
    offers: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    linkedEventIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    linkedArticleIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    linkedNewsIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    linkedCommunityIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
    adminNote: zod_1.z.string().max(500).optional().default(''),
});
function businessesRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const db = (0, store_1.readDb)();
        if (db.site.businessDirectoryEnabled === false)
            return res.json({ items: [], categories: exports.businessCategories, regions: [] });
        const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
        const category = typeof req.query.category === 'string' ? req.query.category.toLowerCase() : '';
        const region = typeof req.query.region === 'string' ? req.query.region.toLowerCase() : '';
        const items = db.businessListings
            .filter((item) => item.status === 'approved')
            .filter((item) => !q || [item.businessName, item.description, item.category, item.subcategories.join(' '), item.services.join(' '), item.specialties.join(' ')].join(' ').toLowerCase().includes(q))
            .filter((item) => !category || item.category.toLowerCase() === category || item.subcategories.some((sub) => sub.toLowerCase() === category))
            .filter((item) => !region || [item.region, item.address].join(' ').toLowerCase().includes(region))
            .sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || Number(b.featured) - Number(a.featured) || Number(b.trusted) - Number(a.trusted) || b.updatedAt.localeCompare(a.updatedAt))
            .map((item) => (0, store_1.mapBusinessPublic)(db, item));
        return res.json({ items, categories: exports.businessCategories, regions: Array.from(new Set(db.businessListings.filter((item) => item.status === 'approved').map((item) => item.region).filter(Boolean))) });
    });
    router.get('/:slug', async (req, res) => {
        const db = (0, store_1.readDb)();
        if (db.site.businessDirectoryEnabled === false)
            return res.status(404).json({ error: 'Business directory disabled' });
        const item = db.businessListings.find((entry) => entry.slug === req.params.slug && entry.status === 'approved');
        if (!item)
            return res.status(404).json({ error: 'Business not found' });
        const short = (0, store_1.mutateDb)((runtime) => (0, store_1.findOrCreateShortLink)(runtime, {
            targetType: 'business',
            targetId: item.id,
            ownerUserId: item.ownerUserId || runtime.users.find((user) => user.role === 'admin')?.id || 'system',
            preferredSlug: item.slug,
        }));
        return res.json({ ...(0, store_1.mapBusinessPublic)(db, item), canonicalShareUrl: `${(0, env_1.getPublicAppUrl)()}/businesses/${item.slug}`, shortLink: { ...short, shortUrl: `${(0, env_1.getPublicAppUrl)()}/s/${short.slug}`, qrUrl: `${(0, env_1.getPublicAppUrl)()}/s/${short.slug}?src=qr` } });
    });
    router.post('/submit', auth_1.requireAuth, async (req, res) => {
        const parsed = exports.businessPayloadSchema.omit({ status: true, trusted: true, sponsored: true, featured: true, ownerUserId: true }).safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid business submission payload' });
        const viewer = req.viewer;
        let savedId = '';
        (0, store_1.mutateDb)((db) => {
            const now = (0, store_1.nowIso)();
            savedId = (0, store_1.createId)('business');
            const item = {
                id: savedId,
                slug: (0, store_1.uniqueSlug)(parsed.data.slug || parsed.data.businessName, db.businessListings.map((entry) => entry.slug)),
                ownerUserId: viewer.user.id,
                status: 'pending',
                trusted: false,
                sponsored: false,
                featured: false,
                contactCount: 0,
                createdAt: now,
                updatedAt: now,
                adminNotes: parsed.data.adminNote ? [parsed.data.adminNote] : [],
                ...parsed.data,
                logoMediaId: parsed.data.logoMediaId || undefined,
                bannerMediaId: parsed.data.bannerMediaId || undefined,
            };
            db.businessListings.push(item);
            (0, store_1.logAudit)(db, viewer.user.id, 'business_submitted', 'business', savedId, parsed.data.businessName);
        });
        return res.status(202).json({ success: true, businessId: savedId });
    });
    return router;
}
function upsertBusinessFromAdmin(req, res, businessId) {
    const parsed = exports.businessPayloadSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Invalid business payload' });
    const viewer = req.viewer;
    let savedId = businessId || '';
    try {
        (0, store_1.mutateDb)((db) => {
            const now = (0, store_1.nowIso)();
            let item = businessId ? db.businessListings.find((entry) => entry.id === businessId) : null;
            if (!item) {
                savedId = (0, store_1.createId)('business');
                item = {
                    id: savedId,
                    slug: (0, store_1.uniqueSlug)(parsed.data.slug || parsed.data.businessName, db.businessListings.map((entry) => entry.slug)),
                    contactCount: 0,
                    createdAt: now,
                    updatedAt: now,
                    approvedAt: parsed.data.status === 'approved' ? now : undefined,
                    adminNotes: parsed.data.adminNote ? [parsed.data.adminNote] : [],
                    ...parsed.data,
                    logoMediaId: parsed.data.logoMediaId || undefined,
                    bannerMediaId: parsed.data.bannerMediaId || undefined,
                };
                db.businessListings.push(item);
            }
            else {
                Object.assign(item, parsed.data, {
                    slug: parsed.data.slug ? (0, store_1.uniqueSlug)(parsed.data.slug, db.businessListings.filter((entry) => entry.id !== item.id).map((entry) => entry.slug)) : item.slug,
                    logoMediaId: parsed.data.logoMediaId || undefined,
                    bannerMediaId: parsed.data.bannerMediaId || undefined,
                    approvedAt: parsed.data.status === 'approved' ? (item.approvedAt || now) : item.approvedAt,
                    adminNotes: parsed.data.adminNote ? [...(item.adminNotes || []), parsed.data.adminNote].slice(-20) : item.adminNotes,
                    updatedAt: now,
                });
                savedId = item.id;
            }
            [item.logoMediaId, item.bannerMediaId, ...(item.galleryMediaIds || [])].filter(Boolean).forEach((mediaId) => {
                const asset = db.mediaAssets.find((media) => media.id === mediaId && (media.ownerUserId === viewer.user.id || viewer.user.role === 'admin'));
                if (asset) {
                    asset.ownerType = 'business';
                    asset.ownerId = item.id;
                    asset.updatedAt = now;
                }
            });
            (0, store_1.logAudit)(db, viewer.user.id, businessId ? 'business_updated' : 'business_created', 'business', item.id, JSON.stringify({ status: item.status, trusted: item.trusted, sponsored: item.sponsored }));
        });
    }
    catch (error) {
        return res.status(400).json({ error: error.message || 'Could not save business' });
    }
    const db = (0, store_1.readDb)();
    const saved = db.businessListings.find((item) => item.id === savedId);
    return res.status(businessId ? 200 : 201).json(saved ? (0, store_1.mapBusinessPublic)(db, saved) : null);
}
