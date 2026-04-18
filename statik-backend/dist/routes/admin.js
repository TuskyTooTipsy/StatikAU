"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function adminRouter() {
    const router = (0, express_1.Router)();
    router.get('/overview', auth_1.requireAdmin, async (_req, res) => {
        const db = (0, store_1.readDb)();
        return res.json({
            site: db.site,
            counts: {
                users: db.users.length,
                featuredProfiles: db.profiles.filter((profile) => profile.featured || profile.promoted).length,
                verifiedProfiles: db.profiles.filter((profile) => profile.verified).length,
                approvedEvents: db.events.filter((event) => event.approvalStatus === 'approved').length,
                pendingEvents: db.events.filter((event) => event.approvalStatus === 'pending').length,
                communities: db.communities.length,
                messages: db.messages.length,
                vehicles: db.garageVehicles.length,
                posts: db.profilePosts.length + db.communityPosts.length,
                media: db.mediaAssets.filter((asset) => asset.status === 'uploaded').length,
                openReports: db.reports.filter((report) => report.status === 'open').length,
            },
            profiles: db.profiles.map((profile) => ({ ...profile, stats: (0, store_1.profileStats)(db, profile.id) })),
            events: db.events,
            communities: db.communities.map((community) => ({ ...community, memberCount: community.memberUserIds.length })),
            reports: db.reports.slice(0, 80),
            media: db.mediaAssets.filter((asset) => asset.status === 'uploaded').slice(0, 80),
            auditLogs: db.auditLogs.slice(0, 60),
        });
    });
    router.patch('/site', auth_1.requireAdmin, async (req, res) => {
        const schema = zod_1.z.object({
            shopLocked: zod_1.z.boolean().optional(),
            maintenanceMode: zod_1.z.boolean().optional(),
            registrationOpen: zod_1.z.boolean().optional(),
            brandTagline: zod_1.z.string().min(8).max(120).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid site settings payload' });
        const viewer = req.viewer;
        (0, store_1.mutateDb)((db) => {
            db.site = { ...db.site, ...parsed.data };
            (0, store_1.logAudit)(db, viewer.user.id, 'site_settings_updated', 'site', 'site');
        });
        return res.json((0, store_1.readDb)().site);
    });
    router.patch('/profiles/:profileId', auth_1.requireAdmin, async (req, res) => {
        const schema = zod_1.z.object({
            featured: zod_1.z.boolean().optional(),
            verified: zod_1.z.boolean().optional(),
            promoted: zod_1.z.boolean().optional(),
            analyticsVisibility: zod_1.z.enum(['public', 'private']).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid profile moderation payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const profile = db.profiles.find((item) => item.id === req.params.profileId);
                if (!profile)
                    throw new Error('Profile not found');
                if (typeof parsed.data.featured === 'boolean')
                    profile.featured = parsed.data.featured;
                if (typeof parsed.data.verified === 'boolean')
                    profile.verified = parsed.data.verified;
                if (typeof parsed.data.promoted === 'boolean')
                    profile.promoted = parsed.data.promoted;
                if (parsed.data.analyticsVisibility)
                    profile.analyticsVisibility = parsed.data.analyticsVisibility;
                (0, store_1.logAudit)(db, viewer.user.id, 'profile_moderated', 'profile', profile.id);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Profile not found' });
        }
        return res.json({ success: true });
    });
    router.patch('/events/:eventId', auth_1.requireAdmin, async (req, res) => {
        const schema = zod_1.z.object({
            featured: zod_1.z.boolean().optional(),
            approvalStatus: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid event moderation payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const event = db.events.find((item) => item.id === req.params.eventId);
                if (!event)
                    throw new Error('Event not found');
                if (typeof parsed.data.featured === 'boolean')
                    event.featured = parsed.data.featured;
                if (parsed.data.approvalStatus)
                    event.approvalStatus = parsed.data.approvalStatus;
                (0, store_1.logAudit)(db, viewer.user.id, 'event_moderated', 'event', event.id, JSON.stringify(parsed.data));
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Event not found' });
        }
        return res.json({ success: true });
    });
    router.patch('/communities/:communityId', auth_1.requireAdmin, async (req, res) => {
        const schema = zod_1.z.object({
            discoverable: zod_1.z.boolean().optional(),
            featuredMemberUserIds: zod_1.z.array(zod_1.z.string()).optional(),
            featuredVehicleIds: zod_1.z.array(zod_1.z.string()).optional(),
            featuredEventIds: zod_1.z.array(zod_1.z.string()).optional(),
            featuredPostIds: zod_1.z.array(zod_1.z.string()).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid community moderation payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const community = db.communities.find((item) => item.id === req.params.communityId);
                if (!community)
                    throw new Error('Community not found');
                Object.assign(community, parsed.data);
                (0, store_1.logAudit)(db, viewer.user.id, 'community_moderated', 'community', community.id, JSON.stringify(parsed.data));
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Community not found' });
        }
        return res.json({ success: true });
    });
    router.patch('/reports/:reportId', auth_1.requireAdmin, async (req, res) => {
        const schema = zod_1.z.object({
            status: zod_1.z.enum(['open', 'resolved', 'dismissed']),
            note: zod_1.z.string().max(280).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid report payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const report = db.reports.find((item) => item.id === req.params.reportId);
                if (!report)
                    throw new Error('Report not found');
                report.status = parsed.data.status;
                report.note = parsed.data.note;
                report.resolvedAt = parsed.data.status === 'open' ? undefined : new Date().toISOString();
                (0, store_1.logAudit)(db, viewer.user.id, 'report_moderated', 'report', report.id, report.status);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Report not found' });
        }
        return res.json({ success: true });
    });
    router.delete('/media/:assetId', auth_1.requireAdmin, async (req, res) => {
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const asset = db.mediaAssets.find((item) => item.id === req.params.assetId);
                if (!asset)
                    throw new Error('Media not found');
                (0, store_1.removeMediaFile)(asset.storageKey);
                asset.status = 'deleted';
                db.garageVehicles.forEach((vehicle) => {
                    vehicle.mediaIds = vehicle.mediaIds.filter((id) => id !== asset.id);
                    if (vehicle.heroMediaId === asset.id)
                        vehicle.heroMediaId = vehicle.mediaIds[0];
                });
                db.profilePosts.forEach((post) => { post.mediaIds = post.mediaIds.filter((id) => id !== asset.id); });
                db.communityPosts.forEach((post) => { post.mediaIds = post.mediaIds.filter((id) => id !== asset.id); });
                (0, store_1.logAudit)(db, viewer.user.id, 'media_removed_admin', 'media', asset.id);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Media not found' });
        }
        return res.json({ success: true });
    });
    return router;
}
