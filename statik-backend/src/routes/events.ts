import { Router } from 'express';
import { z } from 'zod';
import { getTokenFromRequest, requireAuth } from '../lib/auth';
import { canManageCommunity, createId, getUserByToken, logAudit, mutateDb, nowIso, profileStats, readDb, uniqueSlug } from '../lib/store';

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

export default function eventsRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const token = getTokenFromRequest(req);
    const viewer = getUserByToken(token);
    const db = readDb();
    const includePending = viewer?.user.role === 'admin' && req.query.includePending === 'true';
    const items = db.events
      .filter((event) => includePending || event.approvalStatus === 'approved')
      .sort((a, b) => a.date.localeCompare(b.date));
    return res.json(items.map((event) => mapEvent(db, event, viewer?.user.id)));
  });

  router.get('/:slug', async (req, res) => {
    const token = getTokenFromRequest(req);
    const viewer = getUserByToken(token);
    const db = readDb();
    const event = db.events.find((item) => item.slug === req.params.slug);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.approvalStatus !== 'approved' && viewer?.user.role !== 'admin') {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json(mapEvent(db, event, viewer?.user.id));
  });

  router.post('/submit', requireAuth, async (req, res) => {
    const schema = z.object({
      name: z.string().min(2).max(80),
      location: z.string().min(2).max(120),
      date: z.string().min(4),
      time: z.string().min(1).max(40),
      description: z.string().min(10).max(600),
      category: z.string().min(2).max(40),
      organizer: z.string().min(2).max(80),
      hostCommunityId: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid event submission payload' });
    const viewer = (req as any).viewer;

    const event = mutateDb((db) => {
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
        ...parsed.data,
      };
      db.events.push(created);
      logAudit(db, viewer.user.id, 'submit_event', 'event', created.id, created.hostCommunityId || undefined);
      return created;
    });

    return res.status(201).json(event);
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
