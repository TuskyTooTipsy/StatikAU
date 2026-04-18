import { Router } from 'express';
import { z } from 'zod';
import { getTokenFromRequest, requireAuth } from '../lib/auth';
import { canManageCommunity, createId, getMediaList, getUserByToken, logAudit, mutateDb, nowIso, profileStats, readDb, uniqueSlug } from '../lib/store';

function responseCounts(db: ReturnType<typeof readDb>, eventId: string) {
  const responses = db.eventResponses.filter((response) => response.eventId === eventId);
  return {
    attending: responses.filter((item) => item.status === 'attending').length,
    interested: responses.filter((item) => item.status === 'interested').length,
    maybe: responses.filter((item) => item.status === 'maybe').length,
  };
}

function notablePeople(db: ReturnType<typeof readDb>, eventId: string, status: 'attending' | 'interested' | 'maybe') {
  return db.eventResponses
    .filter((response) => response.eventId === eventId && response.status === status)
    .map((response) => db.profiles.find((profile) => profile.userId === response.userId))
    .filter(Boolean)
    .sort((a: any, b: any) => {
      const aStats = profileStats(db, a.id);
      const bStats = profileStats(db, b.id);
      return (Number(b.promoted) - Number(a.promoted)) || (Number(b.featured) - Number(a.featured)) || (Number(b.verified) - Number(a.verified)) || (bStats.friendCount - aStats.friendCount);
    })
    .slice(0, 12);
}

function mapEvent(db: ReturnType<typeof readDb>, event: any, viewerUserId?: string) {
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
    media: getMediaList(db, event.mediaIds || []),
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

export default function eventsRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const token = getTokenFromRequest(req);
    const viewer = getUserByToken(token);
    const db = readDb();
    const includePending = viewer?.user.role === 'admin' && req.query.includePending === 'true';
    const category = typeof req.query.category === 'string' ? req.query.category.toLowerCase() : '';
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const featuredOnly = req.query.featured === 'true';
    const sourceType = typeof req.query.sourceType === 'string' ? req.query.sourceType : '';
    const scope = typeof req.query.scope === 'string' ? req.query.scope : 'upcoming';
    const today = new Date().toISOString().slice(0, 10);

    let items = db.events.filter((event) => includePending || event.approvalStatus === 'approved');
    if (category) items = items.filter((event) => event.category.toLowerCase() === category);
    if (featuredOnly) items = items.filter((event) => event.featured || event.sponsored || event.sourceType === 'statik_hosted');
    if (sourceType) items = items.filter((event) => event.sourceType === sourceType);
    if (scope === 'past') items = items.filter((event) => event.date && event.date < today);
    else if (scope === 'upcoming') items = items.filter((event) => !event.date || event.date >= today);
    if (q) {
      items = items.filter((event) => [event.name, event.location, event.description, event.category, event.organizer, ...(event.tags || [])].join(' ').toLowerCase().includes(q));
    }
    items = items.sort((a, b) => a.date.localeCompare(b.date));
    return res.json(items.map((event) => mapEvent(db, event, viewer?.user.id)));
  });

  router.get('/:slug', async (req, res) => {
    const token = getTokenFromRequest(req);
    const viewer = getUserByToken(token);
    const db = readDb();
    const event = db.events.find((item) => item.slug === req.params.slug);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.approvalStatus !== 'approved' && viewer?.user.role !== 'admin' && event.createdByUserId !== viewer?.user.id) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json(mapEvent(db, event, viewer?.user.id));
  });

  router.post('/submit', requireAuth, async (req, res) => {
    const schema = z.object({
      name: z.string().min(2).max(100),
      location: z.string().min(2).max(160),
      date: z.string().min(4),
      time: z.string().max(80).optional().default('TBC'),
      description: z.string().min(10).max(2400),
      category: z.string().min(2).max(80),
      organizer: z.string().min(2).max(120),
      hostCommunityId: z.string().optional(),
      sponsored: z.boolean().optional().default(false),
      sponsorName: z.string().max(120).optional().default(''),
      venueType: z.enum(['raceway', 'street', 'workshop', 'showground', 'dealer', 'business', 'indoor', 'outdoor', 'mixed', 'other']).optional().default('other'),
      entryType: z.enum(['spectator', 'driver', 'rider', 'mixed', 'other']).optional().default('mixed'),
      pricingType: z.enum(['free', 'ticketed', 'invite_only', 'other']).optional().default('other'),
      vehicleFocus: z.array(z.string().max(40)).max(12).optional().default([]),
      tags: z.array(z.string().max(40)).max(12).optional().default([]),
      spectatorFriendly: z.boolean().optional(),
      familyFriendly: z.boolean().optional(),
      recurring: z.boolean().optional().default(false),
      indoorOutdoor: z.enum(['indoor', 'outdoor', 'mixed', 'unknown']).optional().default('unknown'),
      hostLinks: z.array(z.string().url()).max(4).optional().default([]),
      mediaIds: z.array(z.string()).max(8).optional().default([]),
      locationDetails: z.object({
        label: z.string().min(1),
        address: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        placeId: z.string().optional(),
        suburb: z.string().optional(),
        region: z.string().optional(),
        country: z.string().optional(),
      }).optional(),
      submittedByEmail: z.string().email().optional(),
      submittedByName: z.string().max(80).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid event submission payload' });
    const viewer = (req as any).viewer;

    let createdEvent: any;
    try {
      createdEvent = mutateDb((db) => {
        if (parsed.data.hostCommunityId) {
          const community = db.communities.find((item) => item.id === parsed.data.hostCommunityId);
          if (!community || (!canManageCommunity(community, viewer.user.id) && viewer.user.role !== 'admin')) {
            throw new Error('Not allowed to attach that community to this event');
          }
        }
        const slug = uniqueSlug(parsed.data.name, db.events.map((item) => item.slug));
        const created = {
          id: createId('event'),
          slug,
          featured: false,
          approvalStatus: 'pending' as const,
          createdByUserId: viewer.user.id,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          sourceType: 'user_submission' as const,
          sourceName: 'Member submission',
          sourceUrl: '',
          adminNotes: [],
          statusHistory: [{ status: 'pending' as const, at: nowIso(), byUserId: viewer.user.id, note: 'Submission received' }],
          ...parsed.data,
        };
        db.events.push(created);
        db.mediaAssets.forEach((asset) => {
          if ((parsed.data.mediaIds || []).includes(asset.id) && asset.ownerUserId === viewer.user.id) {
            asset.ownerType = 'event';
            asset.ownerId = created.id;
            asset.updatedAt = nowIso();
          }
        });
        logAudit(db, viewer.user.id, 'submit_event', 'event', created.id, created.hostCommunityId || undefined);
        return created;
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not submit event' });
    }

    return res.status(201).json(createdEvent);
  });

  router.patch('/:eventId/media', requireAuth, async (req, res) => {
    const schema = z.object({ mediaIds: z.array(z.string()).max(8) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid media payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const event = db.events.find((item) => item.id === req.params.eventId);
        if (!event) throw new Error('Event not found');
        if (event.createdByUserId !== viewer.user.id && viewer.user.role !== 'admin') throw new Error('Not allowed to update this event');
        event.mediaIds = parsed.data.mediaIds;
        event.updatedAt = nowIso();
        db.mediaAssets.forEach((asset) => {
          if (parsed.data.mediaIds.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
            asset.ownerType = 'event';
            asset.ownerId = event.id;
            asset.updatedAt = nowIso();
          }
        });
        logAudit(db, viewer.user.id, 'event_media_updated', 'event', event.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not update event media' });
    }
    const db = readDb();
    const event = db.events.find((item) => item.id === req.params.eventId);
    return res.json(event ? mapEvent(db, event, viewer.user.id) : null);
  });

  router.post('/:id/rsvp', requireAuth, async (req, res) => {
    const schema = z.object({
      status: z.enum(['interested', 'attending', 'maybe']),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid RSVP payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const event = db.events.find((item) => item.id === req.params.id && item.approvalStatus === 'approved');
        if (!event) throw new Error('Event not found');
        const existing = db.eventResponses.find((item) => item.eventId === event.id && item.userId === viewer.user.id);
        if (existing) {
          existing.status = parsed.data.status;
          existing.updatedAt = nowIso();
        } else {
          db.eventResponses.push({
            id: createId('rsvp'),
            eventId: event.id,
            userId: viewer.user.id,
            status: parsed.data.status,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          });
        }
        logAudit(db, viewer.user.id, 'event_rsvp', 'event', event.id, parsed.data.status);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Event not found' });
    }

    const db = readDb();
    const event = db.events.find((item) => item.id === req.params.id);
    return res.json(event ? mapEvent(db, event, viewer.user.id) : null);
  });

  return router;
}
