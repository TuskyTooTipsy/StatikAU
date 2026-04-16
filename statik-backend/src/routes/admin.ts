import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../lib/auth';
import { logAudit, mutateDb, profileStats, readDb } from '../lib/store';

export default function adminRouter() {
  const router = Router();

  router.get('/overview', requireAdmin, async (_req, res) => {
    const db = readDb();
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
      profiles: db.profiles.map((profile) => ({ ...profile, stats: profileStats(db, profile.id) })),
      events: db.events,
      communities: db.communities.map((community) => ({ ...community, memberCount: community.memberUserIds.length })),
      auditLogs: db.auditLogs.slice(0, 40),
    });
  });

  router.patch('/site', requireAdmin, async (req, res) => {
    const schema = z.object({
      shopLocked: z.boolean().optional(),
      maintenanceMode: z.boolean().optional(),
      registrationOpen: z.boolean().optional(),
      brandTagline: z.string().min(8).max(120).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid site settings payload' });
    const viewer = (req as any).viewer;

    mutateDb((db) => {
      db.site = { ...db.site, ...parsed.data };
      logAudit(db, viewer.user.id, 'site_settings_updated', 'site', 'site');
    });

    return res.json(readDb().site);
  });

  router.patch('/profiles/:profileId', requireAdmin, async (req, res) => {
    const schema = z.object({
      featured: z.boolean().optional(),
      verified: z.boolean().optional(),
      promoted: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid profile moderation payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const profile = db.profiles.find((item) => item.id === req.params.profileId);
        if (!profile) throw new Error('Profile not found');
        if (typeof parsed.data.featured === 'boolean') profile.featured = parsed.data.featured;
        if (typeof parsed.data.verified === 'boolean') profile.verified = parsed.data.verified;
        if (typeof parsed.data.promoted === 'boolean') profile.promoted = parsed.data.promoted;
        logAudit(db, viewer.user.id, 'profile_moderated', 'profile', profile.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Profile not found' });
    }

    return res.json({ success: true });
  });

  router.patch('/events/:eventId', requireAdmin, async (req, res) => {
    const schema = z.object({
      featured: z.boolean().optional(),
      approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid event moderation payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const event = db.events.find((item) => item.id === req.params.eventId);
        if (!event) throw new Error('Event not found');
        if (typeof parsed.data.featured === 'boolean') event.featured = parsed.data.featured;
        if (parsed.data.approvalStatus) event.approvalStatus = parsed.data.approvalStatus;
        logAudit(db, viewer.user.id, 'event_moderated', 'event', event.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Event not found' });
    }

    return res.json({ success: true });
  });

  return router;
}
