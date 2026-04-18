"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectRouter = redirectRouter;
exports.default = linksRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const env_1 = require("../lib/env");
const store_1 = require("../lib/store");
function resolveTargetHref(db, targetType, targetId) {
    if (targetType === 'profile') {
        const profile = db.profiles.find((item) => item.id === targetId);
        return profile ? `/profiles/${profile.slug}` : null;
    }
    if (targetType === 'community') {
        const community = db.communities.find((item) => item.id === targetId);
        return community ? `/members/communities/${community.slug}` : null;
    }
    if (targetType === 'event') {
        const event = db.events.find((item) => item.id === targetId);
        return event ? `/events/${event.slug}` : null;
    }
    if (targetType === 'vehicle') {
        const vehicle = db.garageVehicles.find((item) => item.id === targetId);
        const profile = vehicle ? db.profiles.find((item) => item.id === vehicle.profileId) : null;
        return profile && vehicle ? `/profiles/${profile.slug}?vehicle=${vehicle.id}` : null;
    }
    return null;
}
function redirectRouter() {
    const router = (0, express_1.Router)();
    router.get('/s/:slug', async (req, res) => {
        const db = (0, store_1.readDb)();
        const link = (0, store_1.getShortLinkBySlug)(db, req.params.slug);
        if (!link)
            return res.status(404).json({ error: 'Short link not found' });
        const href = resolveTargetHref(db, link.targetType, link.targetId);
        if (!href)
            return res.status(404).json({ error: 'Target no longer exists' });
        const sessionKey = (0, store_1.hashVisitorKey)(`${req.ip}:${req.headers['user-agent'] || 'unknown'}:${req.query.src === 'qr' ? 'qr' : 'shortlink'}`);
        (0, store_1.mutateDb)((runtime) => {
            const target = runtime.shortLinks.find((item) => item.id === link.id);
            if (!target)
                return;
            const isQr = req.query.src === 'qr';
            target.clickCount += 1;
            if (isQr)
                target.qrScanCount += 1;
            target.updatedAt = (0, store_1.nowIso)();
            (0, store_1.trackAnalyticsEvent)(runtime, {
                actorUserId: null,
                sessionKey,
                source: isQr ? 'qr' : 'shortlink',
                eventType: isQr ? 'qr_scan' : 'shortlink_click',
                targetType: link.targetType,
                targetId: link.targetId,
            });
        });
        return res.redirect(302, href);
    });
    return router;
}
function linksRouter() {
    const router = (0, express_1.Router)();
    router.get('/me', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        const db = (0, store_1.readDb)();
        const vehicles = (0, store_1.getProfileGarage)(db, viewer.profile.id, viewer.user.id);
        const communities = db.communities.filter((community) => community.ownerUserId === viewer.user.id || community.adminUserIds.includes(viewer.user.id));
        const events = db.events.filter((event) => event.createdByUserId === viewer.user.id || communities.some((community) => community.id === event.hostCommunityId));
        const ensureList = (0, store_1.mutateDb)((runtime) => {
            const profileLink = (0, store_1.findOrCreateShortLink)(runtime, {
                targetType: 'profile',
                targetId: viewer.profile.id,
                ownerUserId: viewer.user.id,
                preferredSlug: viewer.profile.slug,
            });
            const vehicleLinks = vehicles.map((vehicle) => (0, store_1.findOrCreateShortLink)(runtime, {
                targetType: 'vehicle',
                targetId: vehicle.id,
                ownerUserId: viewer.user.id,
                preferredSlug: `${viewer.profile.slug}-${vehicle.nickname || vehicle.make || 'build'}`,
            }));
            const communityLinks = communities.map((community) => (0, store_1.findOrCreateShortLink)(runtime, {
                targetType: 'community',
                targetId: community.id,
                ownerUserId: viewer.user.id,
                preferredSlug: community.slug,
            }));
            const eventLinks = events.map((event) => (0, store_1.findOrCreateShortLink)(runtime, {
                targetType: 'event',
                targetId: event.id,
                ownerUserId: viewer.user.id,
                preferredSlug: event.slug,
            }));
            return { profileLink, vehicleLinks, communityLinks, eventLinks };
        });
        const latestDb = (0, store_1.readDb)();
        const allLinks = [ensureList.profileLink, ...ensureList.vehicleLinks, ...ensureList.communityLinks, ...ensureList.eventLinks].map((link) => ({
            ...link,
            targetHref: resolveTargetHref(latestDb, link.targetType, link.targetId),
            shortUrl: `${(0, env_1.getPublicAppUrl)()}/s/${link.slug}`,
            qrUrl: `${(0, env_1.getPublicAppUrl)()}/s/${link.slug}?src=qr`,
        }));
        return res.json(allLinks);
    });
    router.get('/resolve/:slug', async (req, res) => {
        const db = (0, store_1.readDb)();
        const link = (0, store_1.getShortLinkBySlug)(db, req.params.slug);
        if (!link)
            return res.status(404).json({ error: 'Short link not found' });
        const href = resolveTargetHref(db, link.targetType, link.targetId);
        if (!href)
            return res.status(404).json({ error: 'Target no longer exists' });
        const isQr = req.query.src === 'qr';
        const sessionKey = (0, store_1.hashVisitorKey)(`${req.ip}:${req.headers['user-agent'] || 'unknown'}:${isQr ? 'qr' : 'shortlink'}`);
        (0, store_1.mutateDb)((runtime) => {
            const target = runtime.shortLinks.find((item) => item.id === link.id);
            if (!target)
                return;
            target.clickCount += 1;
            if (isQr)
                target.qrScanCount += 1;
            target.updatedAt = (0, store_1.nowIso)();
            (0, store_1.trackAnalyticsEvent)(runtime, {
                actorUserId: null,
                sessionKey,
                source: isQr ? 'qr' : 'shortlink',
                eventType: isQr ? 'qr_scan' : 'shortlink_click',
                targetType: link.targetType,
                targetId: link.targetId,
            });
        });
        return res.json({ href, absoluteHref: `${(0, env_1.getPublicAppUrl)()}${href}` });
    });
    router.post('/claim', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            shortLinkId: zod_1.z.string().min(1),
            slug: zod_1.z.string().min(3).max(50),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid link payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const link = db.shortLinks.find((item) => item.id === parsed.data.shortLinkId);
                if (!link)
                    throw new Error('Short link not found');
                if (link.ownerUserId !== viewer.user.id && viewer.user.role !== 'admin')
                    throw new Error('Not allowed to edit this short link');
                link.slug = (0, store_1.uniqueSlug)((0, store_1.slugify)(parsed.data.slug), db.shortLinks.filter((item) => item.id !== link.id).map((item) => item.slug));
                link.updatedAt = (0, store_1.nowIso)();
                (0, store_1.logAudit)(db, viewer.user.id, 'shortlink_claimed', 'shortlink', link.id, link.slug);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not update slug' });
        }
        return res.json({ success: true });
    });
    return router;
}
