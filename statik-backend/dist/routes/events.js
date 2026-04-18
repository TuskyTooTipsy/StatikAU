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
    const relatedEvents = db.events
        .filter((item) => item.id !== event.id && item.approvalStatus === 'approved')
        .filter((item) => item.category === event.category || item.hostCommunityId === event.hostCommunityId || item.venueType === event.venueType)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 4)
        .map((item) => ({ id: item.id, slug: item.slug, name: item.name, date: item.date, time: item.time, location: item.location, category: item.category }));
    return {
        ...event,
        hostCommunity: hostCommunity ? {
            id: hostCommunity.id,
            slug: hostCommunity.slug,
            name: hostCommunity.name,
            visibility: hostCommunity.visibility,
            region: hostCommunity.region,
        } : null,
        media: (0, store_1.getMediaList)(db, event.mediaIds || []),
        counts: responseCounts(db, event.id),
        notable: {
            attending: notablePeople(db, event.id, 'attending'),
            interested: notablePeople(db, event.id, 'interested'),
            maybe: notablePeople(db, event.id, 'maybe'),
        },
        viewerStatus: viewerResponse?.status || null,
        relatedEvents,
    };
}
function eventsRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const token = (0, auth_1.getTokenFromRequest)(req);
        const viewer = (0, store_1.getUserByToken)(token);
        const db = (0, store_1.readDb)();
        const includePending = viewer?.user.role === 'admin' && req.query.includePending === 'true';
        const category = typeof req.query.category === 'string' ? req.query.category.toLowerCase() : '';
        const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
        const featuredOnly = req.query.featured === 'true';
        const sourceType = typeof req.query.sourceType === 'string' ? req.query.sourceType : '';
        const scope = typeof req.query.scope === 'string' ? req.query.scope : 'upcoming';
        const today = new Date().toISOString().slice(0, 10);
        let items = db.events.filter((event) => includePending || event.approvalStatus === 'approved');
        if (category)
            items = items.filter((event) => event.category.toLowerCase() === category);
        if (featuredOnly)
            items = items.filter((event) => event.featured || event.sponsored || event.sourceType === 'statik_hosted');
        if (sourceType)
            items = items.filter((event) => event.sourceType === sourceType);
        if (scope === 'past')
            items = items.filter((event) => event.date && event.date < today);
        else if (scope === 'upcoming')
            items = items.filter((event) => !event.date || event.date >= today);
        if (q) {
            items = items.filter((event) => [event.name, event.location, event.description, event.category, event.organizer, ...(event.tags || [])].join(' ').toLowerCase().includes(q));
        }
        items = items.sort((a, b) => a.date.localeCompare(b.date));
        return res.json(items.map((event) => mapEvent(db, event, viewer?.user.id)));
    });
    router.get('/:slug', async (req, res) => {
        const token = (0, auth_1.getTokenFromRequest)(req);
        const viewer = (0, store_1.getUserByToken)(token);
        const db = (0, store_1.readDb)();
        const event = db.events.find((item) => item.slug === req.params.slug);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.approvalStatus !== 'approved' && viewer?.user.role !== 'admin' && event.createdByUserId !== viewer?.user.id) {
            return res.status(404).json({ error: 'Event not found' });
        }
        return res.json(mapEvent(db, event, viewer?.user.id));
    });
    router.post('/submit', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(2).max(100),
            location: zod_1.z.string().min(2).max(160),
            date: zod_1.z.string().min(4),
            time: zod_1.z.string().max(80).optional().default('TBC'),
            description: zod_1.z.string().min(10).max(2400),
            category: zod_1.z.string().min(2).max(80),
            organizer: zod_1.z.string().min(2).max(120),
            hostCommunityId: zod_1.z.string().optional(),
            sponsored: zod_1.z.boolean().optional().default(false),
            sponsorName: zod_1.z.string().max(120).optional().default(''),
            venueType: zod_1.z.enum(['raceway', 'street', 'workshop', 'showground', 'dealer', 'business', 'indoor', 'outdoor', 'mixed', 'other']).optional().default('other'),
            entryType: zod_1.z.enum(['spectator', 'driver', 'rider', 'mixed', 'other']).optional().default('mixed'),
            pricingType: zod_1.z.enum(['free', 'ticketed', 'invite_only', 'other']).optional().default('other'),
            vehicleFocus: zod_1.z.array(zod_1.z.string().max(40)).max(12).optional().default([]),
            tags: zod_1.z.array(zod_1.z.string().max(40)).max(12).optional().default([]),
            spectatorFriendly: zod_1.z.boolean().optional(),
            familyFriendly: zod_1.z.boolean().optional(),
            recurring: zod_1.z.boolean().optional().default(false),
            indoorOutdoor: zod_1.z.enum(['indoor', 'outdoor', 'mixed', 'unknown']).optional().default('unknown'),
            hostLinks: zod_1.z.array(zod_1.z.string().url()).max(4).optional().default([]),
            mediaIds: zod_1.z.array(zod_1.z.string()).max(8).optional().default([]),
            locationDetails: zod_1.z.object({
                label: zod_1.z.string().min(1),
                address: zod_1.z.string().optional(),
                lat: zod_1.z.number().optional(),
                lng: zod_1.z.number().optional(),
                placeId: zod_1.z.string().optional(),
                suburb: zod_1.z.string().optional(),
                region: zod_1.z.string().optional(),
                country: zod_1.z.string().optional(),
            }).optional(),
            submittedByEmail: zod_1.z.string().email().optional(),
            submittedByName: zod_1.z.string().max(80).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid event submission payload' });
        const viewer = req.viewer;
        let createdEvent;
        try {
            createdEvent = (0, store_1.mutateDb)((db) => {
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
                    updatedAt: (0, store_1.nowIso)(),
                    sourceType: 'user_submission',
                    sourceName: 'Member submission',
                    sourceUrl: '',
                    adminNotes: [],
                    statusHistory: [{ status: 'pending', at: (0, store_1.nowIso)(), byUserId: viewer.user.id, note: 'Submission received' }],
                    ...parsed.data,
                };
                db.events.push(created);
                db.mediaAssets.forEach((asset) => {
                    if ((parsed.data.mediaIds || []).includes(asset.id) && asset.ownerUserId === viewer.user.id) {
                        asset.ownerType = 'event';
                        asset.ownerId = created.id;
                        asset.updatedAt = (0, store_1.nowIso)();
                    }
                });
                (0, store_1.logAudit)(db, viewer.user.id, 'submit_event', 'event', created.id, created.hostCommunityId || undefined);
                return created;
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not submit event' });
        }
        return res.status(201).json(createdEvent);
    });
    router.patch('/:eventId/media', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({ mediaIds: zod_1.z.array(zod_1.z.string()).max(8) });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid media payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const event = db.events.find((item) => item.id === req.params.eventId);
                if (!event)
                    throw new Error('Event not found');
                if (event.createdByUserId !== viewer.user.id && viewer.user.role !== 'admin')
                    throw new Error('Not allowed to update this event');
                event.mediaIds = parsed.data.mediaIds;
                event.updatedAt = (0, store_1.nowIso)();
                db.mediaAssets.forEach((asset) => {
                    if (parsed.data.mediaIds.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
                        asset.ownerType = 'event';
                        asset.ownerId = event.id;
                        asset.updatedAt = (0, store_1.nowIso)();
                    }
                });
                (0, store_1.logAudit)(db, viewer.user.id, 'event_media_updated', 'event', event.id);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not update event media' });
        }
        const db = (0, store_1.readDb)();
        const event = db.events.find((item) => item.id === req.params.eventId);
        return res.json(event ? mapEvent(db, event, viewer.user.id) : null);
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
