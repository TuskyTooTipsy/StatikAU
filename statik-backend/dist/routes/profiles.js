"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = profilesRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
const env_1 = require("../lib/env");
function mapProfileSummary(db, profile, viewerUserId) {
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
function analyticsForProfile(db, profile) {
    const profileViews = db.analyticsEvents.filter((event) => event.eventType === 'profile_view' && event.targetId === profile.id);
    const garageViews = db.analyticsEvents.filter((event) => event.eventType === 'garage_view' && event.targetId === profile.id);
    const vehicles = db.garageVehicles.filter((vehicle) => vehicle.profileId === profile.id);
    const vehicleViews = vehicles.map((vehicle) => ({
        id: vehicle.id,
        label: [vehicle.year, vehicle.make, vehicle.model, vehicle.nickname].filter(Boolean).join(' ').trim() || 'Vehicle',
        count: db.analyticsEvents.filter((event) => event.eventType === 'vehicle_view' && event.targetId === vehicle.id).length,
    })).sort((a, b) => b.count - a.count);
    const posts = db.profilePosts.filter((post) => post.profileId === profile.id);
    const postViews = posts.map((post) => ({
        id: post.id,
        caption: post.caption,
        count: db.analyticsEvents.filter((event) => event.eventType === 'profile_post_view' && event.targetId === post.id).length,
    })).sort((a, b) => b.count - a.count);
    const myLinks = (0, store_1.getProfileShortLinks)(db, profile);
    const affiliations = (0, store_1.getProfileAffiliations)(db, profile.userId).map((group) => ({
        ...group,
        count: db.analyticsEvents.filter((event) => event.eventType === 'community_view' && event.targetId === group.id).length,
    })).sort((a, b) => b.count - a.count);
    const acceptedFriends = db.friendRequests.filter((request) => request.status === 'accepted' && (request.fromUserId === profile.userId || request.toUserId === profile.userId));
    const linkClicks = myLinks.reduce((sum, link) => sum + link.clickCount, 0);
    const qrScans = myLinks.reduce((sum, link) => sum + link.qrScanCount, 0);
    const sources = Object.entries(profileViews.reduce((acc, event) => {
        acc[event.source] = (acc[event.source] || 0) + 1;
        return acc;
    }, {})).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
    const trend = (0, store_1.aggregateCountByDay)(profileViews, 14);
    const avg = trend.length ? trend.reduce((sum, point) => sum + point.count, 0) / trend.length : 0;
    const spike = [...trend].sort((a, b) => b.count - a.count)[0];
    return {
        visibility: profile.analyticsVisibility,
        profileViews: profileViews.length,
        uniqueVisitors: (0, store_1.uniqueVisitors)(profileViews),
        garageViews: garageViews.length,
        linkClicks,
        qrScans,
        followerCount: (0, store_1.getFriendUserIds)(db, profile.userId).length,
        followerGrowthPoints: (0, store_1.aggregateCountByDay)(acceptedFriends.map((request) => ({
            id: request.id,
            actorUserId: null,
            sessionKey: request.id,
            source: 'friend',
            eventType: 'profile_view',
            targetType: 'profile',
            targetId: profile.id,
            createdAt: request.updatedAt,
        })), 14),
        profileViewTrend: trend,
        topVehicles: vehicleViews.slice(0, 5),
        topPosts: postViews.slice(0, 5),
        topAffiliations: affiliations.slice(0, 5),
        sources,
        visibilitySpike: spike && spike.count > avg * 2 && spike.count > 0 ? `${spike.date} • ${spike.count} views` : null,
    };
}
function mapProfileDetail(db, profile, viewerUserId) {
    const summary = mapProfileSummary(db, profile, viewerUserId);
    const garage = (0, store_1.getProfileGarage)(db, profile.id, viewerUserId);
    const posts = (0, store_1.getProfilePosts)(db, profile.id);
    const affiliations = (0, store_1.getProfileAffiliations)(db, profile.userId);
    const externalLinks = db.profileLinks.filter((item) => item.profileId === profile.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const shortLinks = (0, store_1.getProfileShortLinks)(db, profile).map((link) => ({
        ...link,
        shortUrl: `${(0, env_1.getPublicAppUrl)()}/s/${link.slug}`,
        qrUrl: `${(0, env_1.getPublicAppUrl)()}/s/${link.slug}?src=qr`,
    }));
    return {
        ...summary,
        about: profile.about,
        currentlyBuilding: profile.currentlyBuilding,
        sceneTags: profile.sceneTags,
        garage,
        posts,
        affiliations,
        externalLinks,
        shortLinks,
        analytics: profile.analyticsVisibility === 'public' ? analyticsForProfile(db, profile) : { visibility: 'private' },
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
        return res.json(items.map((profile) => mapProfileSummary(db, profile, viewerUserId)).slice(0, 60));
    });
    router.get('/me/garage', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        const db = (0, store_1.readDb)();
        return res.json((0, store_1.getProfileGarage)(db, viewer.profile.id, viewer.user.id));
    });
    router.post('/me/garage', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            vehicleType: zod_1.z.enum(['car', 'bike', 'truck', 'other']).default('car'),
            year: zod_1.z.string().max(10).optional().default(''),
            make: zod_1.z.string().min(1).max(40),
            model: zod_1.z.string().min(1).max(40),
            trim: zod_1.z.string().max(40).optional().default(''),
            generation: zod_1.z.string().max(40).optional().default(''),
            specialEdition: zod_1.z.string().max(60).optional().default(''),
            bodyStyle: zod_1.z.string().max(40).optional().default(''),
            drivetrain: zod_1.z.string().max(40).optional().default(''),
            engineFamily: zod_1.z.string().max(60).optional().default(''),
            transmission: zod_1.z.string().max(40).optional().default(''),
            engineCode: zod_1.z.string().max(40).optional().default(''),
            induction: zod_1.z.string().max(40).optional().default(''),
            fuelType: zod_1.z.string().max(40).optional().default(''),
            colourWrap: zod_1.z.string().max(80).optional().default(''),
            wheelTyreSpec: zod_1.z.string().max(160).optional().default(''),
            suspensionSetup: zod_1.z.string().max(160).optional().default(''),
            engineMods: zod_1.z.string().max(240).optional().default(''),
            aeroBodyMods: zod_1.z.string().max(240).optional().default(''),
            interiorAudioNotes: zod_1.z.string().max(240).optional().default(''),
            performanceNotes: zod_1.z.string().max(240).optional().default(''),
            nickname: zod_1.z.string().max(40).optional().default(''),
            stage: zod_1.z.string().max(60).optional().default(''),
            ownershipStatus: zod_1.z.string().max(40).optional().default(''),
            statusTags: zod_1.z.array(zod_1.z.string().max(30)).max(10).optional().default([]),
            purposeTags: zod_1.z.array(zod_1.z.string().max(30)).max(12).optional().default([]),
            setupTags: zod_1.z.array(zod_1.z.string().max(30)).max(12).optional().default([]),
            visibility: zod_1.z.enum(['public', 'private']).default('public'),
            description: zod_1.z.string().max(500).optional().default(''),
            modTags: zod_1.z.array(zod_1.z.string().max(40)).max(20).optional().default([]),
            mediaIds: zod_1.z.array(zod_1.z.string()).max(12).optional().default([]),
            heroMediaId: zod_1.z.string().optional(),
            linkedCommunityIds: zod_1.z.array(zod_1.z.string()).max(6).optional().default([]),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid garage vehicle payload' });
        const viewer = req.viewer;
        (0, store_1.mutateDb)((db) => {
            const createdAt = (0, store_1.nowIso)();
            const vehicleId = (0, store_1.createId)('vehicle');
            db.garageVehicles.push({
                id: vehicleId,
                profileId: viewer.profile.id,
                timeline: [],
                featured: false,
                createdAt,
                updatedAt: createdAt,
                ...parsed.data,
            });
            db.mediaAssets.forEach((asset) => {
                if (parsed.data.mediaIds.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
                    asset.ownerType = 'vehicle';
                    asset.ownerId = vehicleId;
                    asset.updatedAt = (0, store_1.nowIso)();
                }
            });
            (0, store_1.logAudit)(db, viewer.user.id, 'garage_vehicle_created', 'vehicle', vehicleId);
        });
        return res.status(201).json((0, store_1.readDb)().garageVehicles.filter((item) => item.profileId === viewer.profile.id));
    });
    router.patch('/me/garage/:vehicleId', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            year: zod_1.z.string().max(10).optional(),
            make: zod_1.z.string().min(1).max(40).optional(),
            model: zod_1.z.string().min(1).max(40).optional(),
            trim: zod_1.z.string().max(40).optional(),
            generation: zod_1.z.string().max(40).optional(),
            specialEdition: zod_1.z.string().max(60).optional(),
            bodyStyle: zod_1.z.string().max(40).optional(),
            drivetrain: zod_1.z.string().max(40).optional(),
            engineFamily: zod_1.z.string().max(60).optional(),
            transmission: zod_1.z.string().max(40).optional(),
            engineCode: zod_1.z.string().max(40).optional(),
            induction: zod_1.z.string().max(40).optional(),
            fuelType: zod_1.z.string().max(40).optional(),
            colourWrap: zod_1.z.string().max(80).optional(),
            wheelTyreSpec: zod_1.z.string().max(160).optional(),
            suspensionSetup: zod_1.z.string().max(160).optional(),
            engineMods: zod_1.z.string().max(240).optional(),
            aeroBodyMods: zod_1.z.string().max(240).optional(),
            interiorAudioNotes: zod_1.z.string().max(240).optional(),
            performanceNotes: zod_1.z.string().max(240).optional(),
            nickname: zod_1.z.string().max(40).optional(),
            stage: zod_1.z.string().max(60).optional(),
            ownershipStatus: zod_1.z.string().max(40).optional(),
            statusTags: zod_1.z.array(zod_1.z.string().max(30)).max(10).optional(),
            purposeTags: zod_1.z.array(zod_1.z.string().max(30)).max(12).optional(),
            setupTags: zod_1.z.array(zod_1.z.string().max(30)).max(12).optional(),
            visibility: zod_1.z.enum(['public', 'private']).optional(),
            description: zod_1.z.string().max(500).optional(),
            modTags: zod_1.z.array(zod_1.z.string().max(40)).max(20).optional(),
            mediaIds: zod_1.z.array(zod_1.z.string()).max(12).optional(),
            heroMediaId: zod_1.z.string().optional(),
            linkedCommunityIds: zod_1.z.array(zod_1.z.string()).max(6).optional(),
            featured: zod_1.z.boolean().optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid garage update payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const vehicle = db.garageVehicles.find((item) => item.id === req.params.vehicleId && item.profileId === viewer.profile.id);
                if (!vehicle)
                    throw new Error('Vehicle not found');
                Object.assign(vehicle, parsed.data, { updatedAt: (0, store_1.nowIso)() });
                if (parsed.data.mediaIds) {
                    db.mediaAssets.forEach((asset) => {
                        if (parsed.data.mediaIds?.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
                            asset.ownerType = 'vehicle';
                            asset.ownerId = vehicle.id;
                            asset.updatedAt = (0, store_1.nowIso)();
                        }
                    });
                }
                if (parsed.data.featured) {
                    db.profiles.forEach((profile) => {
                        if (profile.id === viewer.profile.id)
                            profile.featuredVehicleId = vehicle.id;
                    });
                }
                (0, store_1.logAudit)(db, viewer.user.id, 'garage_vehicle_updated', 'vehicle', vehicle.id);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Vehicle not found' });
        }
        return res.json((0, store_1.getProfileGarage)((0, store_1.readDb)(), viewer.profile.id, viewer.user.id));
    });
    router.delete('/me/garage/:vehicleId', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const vehicle = db.garageVehicles.find((item) => item.id === req.params.vehicleId && item.profileId === viewer.profile.id);
                if (!vehicle)
                    throw new Error('Vehicle not found');
                db.garageVehicles = db.garageVehicles.filter((item) => item.id !== vehicle.id);
                db.profiles.forEach((profile) => {
                    if (profile.id === viewer.profile.id && profile.featuredVehicleId === vehicle.id)
                        profile.featuredVehicleId = undefined;
                });
                (0, store_1.logAudit)(db, viewer.user.id, 'garage_vehicle_deleted', 'vehicle', vehicle.id);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Vehicle not found' });
        }
        return res.json({ success: true });
    });
    router.get('/me/posts', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        return res.json((0, store_1.getProfilePosts)((0, store_1.readDb)(), viewer.profile.id));
    });
    router.post('/me/posts', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            caption: zod_1.z.string().min(1).max(500),
            mediaIds: zod_1.z.array(zod_1.z.string()).max(8).optional().default([]),
            pinned: zod_1.z.boolean().optional().default(false),
            featured: zod_1.z.boolean().optional().default(false),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid post payload' });
        const viewer = req.viewer;
        (0, store_1.mutateDb)((db) => {
            const postId = (0, store_1.createId)('ppost');
            const createdAt = (0, store_1.nowIso)();
            db.profilePosts.push({ id: postId, profileId: viewer.profile.id, createdAt, updatedAt: createdAt, ...parsed.data });
            db.mediaAssets.forEach((asset) => {
                if (parsed.data.mediaIds.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
                    asset.ownerType = 'profile_post';
                    asset.ownerId = postId;
                    asset.updatedAt = (0, store_1.nowIso)();
                }
            });
            if (parsed.data.featured) {
                const profile = db.profiles.find((item) => item.id === viewer.profile.id);
                if (profile)
                    profile.featuredPostId = postId;
            }
            (0, store_1.logAudit)(db, viewer.user.id, 'profile_post_created', 'profile_post', postId);
        });
        return res.status(201).json((0, store_1.getProfilePosts)((0, store_1.readDb)(), viewer.profile.id));
    });
    router.patch('/me/posts/:postId', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            caption: zod_1.z.string().min(1).max(500).optional(),
            mediaIds: zod_1.z.array(zod_1.z.string()).max(8).optional(),
            pinned: zod_1.z.boolean().optional(),
            featured: zod_1.z.boolean().optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid post update payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const post = db.profilePosts.find((item) => item.id === req.params.postId && item.profileId === viewer.profile.id);
                if (!post)
                    throw new Error('Post not found');
                Object.assign(post, parsed.data, { updatedAt: (0, store_1.nowIso)() });
                if (parsed.data.featured) {
                    const profile = db.profiles.find((item) => item.id === viewer.profile.id);
                    if (profile)
                        profile.featuredPostId = post.id;
                }
                (0, store_1.logAudit)(db, viewer.user.id, 'profile_post_updated', 'profile_post', post.id);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Post not found' });
        }
        return res.json((0, store_1.getProfilePosts)((0, store_1.readDb)(), viewer.profile.id));
    });
    router.delete('/me/posts/:postId', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const post = db.profilePosts.find((item) => item.id === req.params.postId && item.profileId === viewer.profile.id);
                if (!post)
                    throw new Error('Post not found');
                db.profilePosts = db.profilePosts.filter((item) => item.id !== post.id);
                const profile = db.profiles.find((item) => item.id === viewer.profile.id);
                if (profile?.featuredPostId === post.id)
                    profile.featuredPostId = undefined;
                (0, store_1.logAudit)(db, viewer.user.id, 'profile_post_deleted', 'profile_post', post.id);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Post not found' });
        }
        return res.json({ success: true });
    });
    router.get('/me/links', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        return res.json((0, store_1.readDb)().profileLinks.filter((item) => item.profileId === viewer.profile.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    });
    router.post('/me/links', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            label: zod_1.z.string().min(1).max(60),
            href: zod_1.z.string().url(),
            type: zod_1.z.enum(['social', 'build', 'garage', 'group', 'other']).default('other'),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid link payload' });
        const viewer = req.viewer;
        (0, store_1.mutateDb)((db) => {
            db.profileLinks.push({ id: (0, store_1.createId)('plink'), profileId: viewer.profile.id, createdAt: (0, store_1.nowIso)(), updatedAt: (0, store_1.nowIso)(), ...parsed.data });
            (0, store_1.logAudit)(db, viewer.user.id, 'profile_link_created', 'profile', viewer.profile.id, parsed.data.href);
        });
        return res.status(201).json((0, store_1.readDb)().profileLinks.filter((item) => item.profileId === viewer.profile.id));
    });
    router.patch('/me/links/:linkId', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            label: zod_1.z.string().min(1).max(60).optional(),
            href: zod_1.z.string().url().optional(),
            type: zod_1.z.enum(['social', 'build', 'garage', 'group', 'other']).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid link update payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const link = db.profileLinks.find((item) => item.id === req.params.linkId && item.profileId === viewer.profile.id);
                if (!link)
                    throw new Error('Link not found');
                Object.assign(link, parsed.data, { updatedAt: (0, store_1.nowIso)() });
                (0, store_1.logAudit)(db, viewer.user.id, 'profile_link_updated', 'profile', viewer.profile.id, link.id);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Link not found' });
        }
        return res.json((0, store_1.readDb)().profileLinks.filter((item) => item.profileId === viewer.profile.id));
    });
    router.delete('/me/links/:linkId', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        (0, store_1.mutateDb)((db) => {
            db.profileLinks = db.profileLinks.filter((item) => !(item.id === req.params.linkId && item.profileId === viewer.profile.id));
            (0, store_1.logAudit)(db, viewer.user.id, 'profile_link_deleted', 'profile', viewer.profile.id, req.params.linkId);
        });
        return res.json({ success: true });
    });
    router.get('/me/analytics', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        const db = (0, store_1.readDb)();
        const profile = db.profiles.find((item) => item.id === viewer.profile.id);
        if (!profile)
            return res.status(404).json({ error: 'Profile not found' });
        return res.json(analyticsForProfile(db, profile));
    });
    router.patch('/me', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            displayName: zod_1.z.string().min(2).max(40),
            bio: zod_1.z.string().max(300).optional().default(''),
            location: zod_1.z.string().max(80).optional().default(''),
            primaryCar: zod_1.z.string().max(80).optional().default(''),
            avatarUrl: zod_1.z.string().url().or(zod_1.z.literal('')).optional().default(''),
            bannerUrl: zod_1.z.string().url().or(zod_1.z.literal('')).optional().default(''),
            about: zod_1.z.string().max(500).optional().default(''),
            currentlyBuilding: zod_1.z.string().max(120).optional().default(''),
            sceneTags: zod_1.z.array(zod_1.z.string().max(24)).max(10).optional().default([]),
            analyticsVisibility: zod_1.z.enum(['public', 'private']).optional().default('public'),
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
                Object.assign(profile, parsed.data);
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
        return res.json(profile ? mapProfileDetail(db, profile, viewer.user.id) : null);
    });
    router.get('/:slug', async (req, res) => {
        const db = (0, store_1.readDb)();
        const viewerUserId = typeof req.query.viewerUserId === 'string' ? req.query.viewerUserId : undefined;
        const profile = db.profiles.find((item) => item.slug === req.params.slug);
        if (!profile)
            return res.status(404).json({ error: 'Profile not found' });
        const sessionKey = (0, store_1.hashVisitorKey)(`${viewerUserId || 'guest'}:${req.ip}:${req.headers['user-agent'] || 'unknown'}`);
        if (!viewerUserId || viewerUserId !== profile.userId) {
            (0, store_1.mutateDb)((runtime) => {
                (0, store_1.trackAnalyticsEvent)(runtime, {
                    actorUserId: viewerUserId || null,
                    sessionKey,
                    source: typeof req.query.source === 'string' ? req.query.source : 'profile',
                    eventType: 'profile_view',
                    targetType: 'profile',
                    targetId: profile.id,
                });
            });
        }
        return res.json(mapProfileDetail((0, store_1.readDb)(), profile, viewerUserId));
    });
    return router;
}
