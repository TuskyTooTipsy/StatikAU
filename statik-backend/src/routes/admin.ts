import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../lib/auth';
import { logAudit, mutateDb, profileStats, readDb, removeMediaFile } from '../lib/store';

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
        vehicles: db.garageVehicles.length,
        posts: db.profilePosts.length + db.communityPosts.length,
        media: db.mediaAssets.filter((asset) => asset.status === 'uploaded').length,
        openReports: db.reports.filter((report) => report.status === 'open').length,
      },
      profiles: db.profiles.map((profile) => ({ ...profile, stats: profileStats(db, profile.id) })),
      events: db.events,
      communities: db.communities.map((community) => ({ ...community, memberCount: community.memberUserIds.length })),
      reports: db.reports.slice(0, 80),
      media: db.mediaAssets.filter((asset) => asset.status === 'uploaded').slice(0, 80),
      auditLogs: db.auditLogs.slice(0, 60),
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
      analyticsVisibility: z.enum(['public', 'private']).optional(),
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
        if (parsed.data.analyticsVisibility) profile.analyticsVisibility = parsed.data.analyticsVisibility;
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

  router.patch('/communities/:communityId', requireAdmin, async (req, res) => {
    const schema = z.object({
      discoverable: z.boolean().optional(),
      featuredMemberUserIds: z.array(z.string()).optional(),
      featuredVehicleIds: z.array(z.string()).optional(),
      featuredEventIds: z.array(z.string()).optional(),
      featuredPostIds: z.array(z.string()).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid community moderation payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.communityId);
        if (!community) throw new Error('Community not found');
        Object.assign(community, parsed.data);
        logAudit(db, viewer.user.id, 'community_moderated', 'community', community.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Community not found' });
    }
    return res.json({ success: true });
  });

  router.patch('/reports/:reportId', requireAdmin, async (req, res) => {
    const schema = z.object({
      status: z.enum(['open', 'resolved', 'dismissed']),
      note: z.string().max(280).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid report payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const report = db.reports.find((item) => item.id === req.params.reportId);
        if (!report) throw new Error('Report not found');
        report.status = parsed.data.status;
        report.note = parsed.data.note;
        report.resolvedAt = parsed.data.status === 'open' ? undefined : new Date().toISOString();
        logAudit(db, viewer.user.id, 'report_moderated', 'report', report.id, report.status);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Report not found' });
    }
    return res.json({ success: true });
  });

  router.delete('/media/:assetId', requireAdmin, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const asset = db.mediaAssets.find((item) => item.id === req.params.assetId);
        if (!asset) throw new Error('Media not found');
        removeMediaFile(asset.storageKey);
        asset.status = 'deleted';
        db.garageVehicles.forEach((vehicle) => {
          vehicle.mediaIds = vehicle.mediaIds.filter((id) => id !== asset.id);
          if (vehicle.heroMediaId === asset.id) vehicle.heroMediaId = vehicle.mediaIds[0];
        });
        db.profilePosts.forEach((post) => { post.mediaIds = post.mediaIds.filter((id) => id !== asset.id); });
        db.communityPosts.forEach((post) => { post.mediaIds = post.mediaIds.filter((id) => id !== asset.id); });
        logAudit(db, viewer.user.id, 'media_removed_admin', 'media', asset.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Media not found' });
    }
    return res.json({ success: true });
  });

  return router;
}
