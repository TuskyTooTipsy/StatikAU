"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = eventsRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function responseCounts(db, eventId) {
    const responses = db.eventResponses.filter((response) => response.eventId === eventId);
    return {
        attending: responses.filter((item) => item.status === 'attending').length,
        interested: responses.filter((item) => item.status === 'interested').length,
        maybe: responses.filter((item) => item.status === 'maybe').length,
    };
}
function notablePeople(db, eventId, status) {
    return db.eventResponses
        .filter((response) => response.eventId === eventId && response.status === status)
        .map((response) => db.profiles.find((profile) => profile.userId === response.userId))
        .filter(Boolean)
        .sort((a, b) => {
        const aStats = (0, store_1.profileStats)(db, a.id);
        const bStats = (0, store_1.profileStats)(db, b.id);
        return (Number(b.promoted) - Number(a.promoted)) || (Number(b.featured) - Number(a.featured)) || (Number(b.verified) - Number(a.verified)) || (bStats.friendCount - aStats.friendCount);
    })
        .slice(0, 12);
}
function mapEvent(db, event, viewerUserId) {
    const viewerResponse = viewerUserId ? db.eventResponses.find((response) => response.eventId === event.id && response.userId === viewerUserId) : null;
    const hostCommunity = event.hostCommunityId ? db.communities.find((item) => item.id === event.hostCommunityId) || null : null;
    return {
        ...event,
        hostCommunity: hostCommunity ? {
            id: hostCommunity.id,
            slug: hostCommunity.slug,
            name: hostCommunity.name,
            visibility: hostCommunity.visibility,
            region: hostCommunity.region,
        } : null,
        counts: responseCounts(db, event.id),
        notable: {
            attending: notablePeople(db, event.id, 'attending'),
            interested: notablePeople(db, event.id, 'interested'),
            maybe: notablePeople(db, event.id, 'maybe'),
        },
        viewerStatus: viewerResponse?.status || null,
    };
}
function eventsRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const token = (0, auth_1.getTokenFromRequest)(req);
        const viewer = (0, store_1.getUserByToken)(token);
        const db = (0, store_1.readDb)();
        const includePending = viewer?.user.role === 'admin' && req.query.includePending === 'true';
        const items = db.events
            .filter((event) => includePending || event.approvalStatus === 'approved')
            .sort((a, b) => a.date.localeCompare(b.date));
        return res.json(items.map((event) => mapEvent(db, event, viewer?.user.id)));
    });
    router.get('/:slug', async (req, res) => {
        const token = (0, auth_1.getTokenFromRequest)(req);
        const viewer = (0, store_1.getUserByToken)(token);
        const db = (0, store_1.readDb)();
        const event = db.events.find((item) => item.slug === req.params.slug);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.approvalStatus !== 'approved' && viewer?.user.role !== 'admin') {
            return res.status(404).json({ error: 'Event not found' });
        }
        return res.json(mapEvent(db, event, viewer?.user.id));
    });
    router.post('/submit', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(2).max(80),
            location: zod_1.z.string().min(2).max(120),
            date: zod_1.z.string().min(4),
            time: zod_1.z.string().min(1).max(40),
            description: zod_1.z.string().min(10).max(600),
            category: zod_1.z.string().min(2).max(40),
            organizer: zod_1.z.string().min(2).max(80),
            hostCommunityId: zod_1.z.string().optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid event submission payload' });
        const viewer = req.viewer;
        const event = (0, store_1.mutateDb)((db) => {
            if (parsed.data.hostCommunityId) {
                const community = db.communities.find((item) => item.id === parsed.data.hostCommunityId);
                if (!community || (!(0, store_1.canManageCommunity)(community, viewer.user.id) && viewer.user.role !== 'admin')) {
                    throw new Error('Not allowed to attach that community to this event');
                }
            }
            const slug = (0, store_1.uniqueSlug)(parsed.data.name, db.events.map((item) => item.slug));
            const created = {
                id: (0, store_1.createId)('event'),
                slug,
                featured: false,
                approvalStatus: 'pending',
                createdByUserId: viewer.user.id,
                createdAt: (0, store_1.nowIso)(),
                ...parsed.data,
            };
            db.events.push(created);
            (0, store_1.logAudit)(db, viewer.user.id, 'submit_event', 'event', created.id, created.hostCommunityId || undefined);
            return created;
        });
        return res.status(201).json(event);
    });
    router.post('/:id/rsvp', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            status: zod_1.z.enum(['interested', 'attending', 'maybe']),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid RSVP payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const event = db.events.find((item) => item.id === req.params.id && item.approvalStatus === 'approved');
                if (!event)
                    throw new Error('Event not found');
                const existing = db.eventResponses.find((item) => item.eventId === event.id && item.userId === viewer.user.id);
                if (existing) {
                    existing.status = parsed.data.status;
                    existing.updatedAt = (0, store_1.nowIso)();
                }
                else {
                    db.eventResponses.push({
                        id: (0, store_1.createId)('rsvp'),
                        eventId: event.id,
                        userId: viewer.user.id,
                        status: parsed.data.status,
                        createdAt: (0, store_1.nowIso)(),
                        updatedAt: (0, store_1.nowIso)(),
                    });
                }
                (0, store_1.logAudit)(db, viewer.user.id, 'event_rsvp', 'event', event.id, parsed.data.status);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Event not found' });
        }
        const db = (0, store_1.readDb)();
        const event = db.events.find((item) => item.id === req.params.id);
        return res.json(event ? mapEvent(db, event, viewer.user.id) : null);
    });
    return router;
}
