"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = profilesRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function mapProfile(db, profile, viewerUserId) {
    const user = db.users.find((item) => item.id === profile.userId);
    const friends = (0, store_1.getFriendUserIds)(db, profile.userId);
    return {
        ...profile,
        stats: (0, store_1.profileStats)(db, profile.id),
        friendCount: friends.length,
        mutualFriends: viewerUserId ? (0, store_1.countMutualFriends)(db, profile.userId, viewerUserId) : 0,
        isFriend: viewerUserId ? friends.includes(viewerUserId) : false,
        role: user?.role || 'user',
    };
}
function profilesRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const viewerUserId = typeof req.query.viewerUserId === 'string' ? req.query.viewerUserId : undefined;
        const db = (0, store_1.readDb)();
        const featuredOnly = req.query.featured === 'true';
        const verifiedOnly = req.query.verified === 'true';
        let items = db.profiles;
        if (featuredOnly)
            items = items.filter((item) => item.featured || item.promoted);
        if (verifiedOnly)
            items = items.filter((item) => item.verified);
        items = [...items].sort((a, b) => {
            const aStats = (0, store_1.profileStats)(db, a.id);
            const bStats = (0, store_1.profileStats)(db, b.id);
            return (Number(b.promoted) - Number(a.promoted)) || (Number(b.featured) - Number(a.featured)) || (Number(b.verified) - Number(a.verified)) || (bStats.friendCount - aStats.friendCount);
        });
        return res.json(items.map((profile) => mapProfile(db, profile, viewerUserId)).slice(0, 60));
    });
    router.get('/:slug', async (req, res) => {
        const db = (0, store_1.readDb)();
        const viewerUserId = typeof req.query.viewerUserId === 'string' ? req.query.viewerUserId : undefined;
        const profile = db.profiles.find((item) => item.slug === req.params.slug);
        if (!profile)
            return res.status(404).json({ error: 'Profile not found' });
        return res.json(mapProfile(db, profile, viewerUserId));
    });
    router.patch('/me', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            displayName: zod_1.z.string().min(2).max(40),
            bio: zod_1.z.string().max(300).optional().default(''),
            location: zod_1.z.string().max(80).optional().default(''),
            primaryCar: zod_1.z.string().max(80).optional().default(''),
            avatarUrl: zod_1.z.string().url().or(zod_1.z.literal('')).optional().default(''),
            bannerUrl: zod_1.z.string().url().or(zod_1.z.literal('')).optional().default(''),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid profile payload' });
        const viewer = req.viewer;
        let updated = '';
        try {
            updated = (0, store_1.mutateDb)((db) => {
                const profile = db.profiles.find((item) => item.id === viewer.profile.id);
                const user = db.users.find((item) => item.id === viewer.user.id);
                if (!profile || !user)
                    throw new Error('Profile not found');
                profile.displayName = parsed.data.displayName;
                profile.bio = parsed.data.bio;
                profile.location = parsed.data.location;
                profile.primaryCar = parsed.data.primaryCar;
                profile.avatarUrl = parsed.data.avatarUrl;
                profile.bannerUrl = parsed.data.bannerUrl;
                profile.slug = (0, store_1.uniqueSlug)(parsed.data.displayName, db.profiles.filter((item) => item.id !== profile.id).map((item) => item.slug));
                user.displayName = parsed.data.displayName;
                (0, store_1.logAudit)(db, viewer.user.id, 'update_profile', 'profile', profile.id);
                return profile.slug;
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Profile not found' });
        }
        const db = (0, store_1.readDb)();
        const profile = db.profiles.find((item) => item.slug === updated);
        return res.json(profile ? mapProfile(db, profile, viewer.user.id) : null);
    });
    return router;
}
