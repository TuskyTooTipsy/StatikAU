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
            },
            profiles: db.profiles.map((profile) => ({ ...profile, stats: (0, store_1.profileStats)(db, profile.id) })),
            events: db.events,
            communities: db.communities.map((community) => ({ ...community, memberCount: community.memberUserIds.length })),
            auditLogs: db.auditLogs.slice(0, 40),
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
    return router;
}
