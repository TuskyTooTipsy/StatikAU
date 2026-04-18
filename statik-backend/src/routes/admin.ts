import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../lib/auth';
import { publishImportItemAsEvent, runImportSource } from '../lib/importSources';
import { env, getRuntimeDiagnostics } from '../lib/env';
import { createId, findOrCreateShortLink, getMediaList, logAudit, mapBusinessPublic, mapContentPublic, mutateDb, nowIso, profileStats, readDb, removeMediaFile } from '../lib/store';
import { upsertContentFromAdmin } from './content';
import { businessCategories, upsertBusinessFromAdmin } from './businesses';

function buildOverview() {
  const db = readDb();
  return {
    site: db.site,
    counts: {
      users: db.users.length,
      featuredProfiles: db.profiles.filter((profile) => profile.featured || profile.promoted).length,
      verifiedProfiles: db.profiles.filter((profile) => profile.verified).length,
      approvedEvents: db.events.filter((event) => event.approvalStatus === 'approved').length,
      pendingEvents: db.events.filter((event) => event.approvalStatus === 'pending' || event.approvalStatus === 'revision_requested').length,
      communities: db.communities.length,
      messages: db.messages.length,
      vehicles: db.garageVehicles.length,
      posts: db.profilePosts.length + db.communityPosts.length,
      media: db.mediaAssets.filter((asset) => asset.status === 'uploaded').length,
      openReports: db.reports.filter((report) => report.status === 'open').length,
      pendingImports: db.eventImportItems.filter((item) => item.status === 'pending').length,
      publishedArticles: db.contentItems.filter((item) => item.type === 'article' && item.status === 'published').length,
      publishedNews: db.contentItems.filter((item) => item.type === 'news' && item.status === 'published').length,
      draftContent: db.contentItems.filter((item) => item.status === 'draft' || item.status === 'pending').length,
      pendingBusinesses: db.businessListings.filter((item) => item.status === 'pending').length,
      approvedBusinesses: db.businessListings.filter((item) => item.status === 'approved').length,
    },
    profiles: db.profiles.map((profile) => ({ ...profile, stats: profileStats(db, profile.id) })),
    events: db.events,
    communities: db.communities.map((community) => ({ ...community, memberCount: community.memberUserIds.length })),
    reports: db.reports.slice(0, 120),
    media: db.mediaAssets.filter((asset) => asset.status === 'uploaded').slice(0, 120),
    vehicles: db.garageVehicles.slice(0, 160),
    shortLinks: db.shortLinks.slice(0, 160),
    contentItems: db.contentItems.slice(0, 160),
    businessListings: db.businessListings.slice(0, 160),
    aiGenerationLogs: db.aiGenerationLogs.slice(0, 80),
    auditLogs: db.auditLogs.slice(0, 120),
    approveBay: {
      events: db.events.filter((event) => event.approvalStatus === 'pending' || event.approvalStatus === 'revision_requested').slice(0, 40),
      imports: db.eventImportItems.filter((item) => item.status === 'pending').slice(0, 40),
      reports: db.reports.filter((report) => report.status === 'open').slice(0, 40),
      content: db.contentItems.filter((item) => item.status === 'pending' || item.status === 'scheduled').slice(0, 40),
      businesses: db.businessListings.filter((item) => item.status === 'pending').slice(0, 40),
      posts: [
        ...db.profilePosts.filter((post) => post.featured === false).map((post) => ({ ...post, queueType: 'profile_post' })),
        ...db.communityPosts.filter((post) => post.featured === false).map((post) => ({ ...post, queueType: 'community_post' })),
      ].slice(0, 40),
    },
    importSources: db.eventImportSources,
    importRuns: db.eventImportRuns.slice(0, 40),
    importItems: db.eventImportItems.slice(0, 80),
    diagnostics: getRuntimeDiagnostics(),
  };
}

export default function adminRouter() {
  const router = Router();

  router.get('/overview', requireAdmin, async (_req, res) => {
    return res.json(buildOverview());
  });

  router.get('/approve-bay', requireAdmin, async (_req, res) => {
    return res.json(buildOverview().approveBay);
  });


  router.get('/content', requireAdmin, async (req, res) => {
    const db = readDb();
    const type = typeof req.query.type === 'string' ? req.query.type : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const items = db.contentItems
      .filter((item) => !type || item.type === type)
      .filter((item) => !status || item.status === status)
      .filter((item) => !q || [item.title, item.excerpt, item.category, item.tags.join(' ')].join(' ').toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((item) => mapContentPublic(db, item));
    return res.json({ items, revisions: db.contentRevisions.slice(0, 80), aiDrafts: db.aiGenerationLogs.slice(0, 40) });
  });

  router.post('/content', requireAdmin, async (req, res) => upsertContentFromAdmin(req as any, res));
  router.patch('/content/:contentId', requireAdmin, async (req, res) => upsertContentFromAdmin(req as any, res, req.params.contentId));

  router.delete('/content/:contentId', requireAdmin, async (req, res) => {
    const viewer = (req as any).viewer;
    mutateDb((db) => {
      const item = db.contentItems.find((entry) => entry.id === req.params.contentId);
      if (!item) throw new Error('Content not found');
      item.status = 'archived';
      item.updatedAt = nowIso();
      logAudit(db, viewer.user.id, 'content_archived', item.type, item.id);
    });
    return res.json({ success: true });
  });

  router.post('/ai-writer/generate', requireAdmin, async (req, res) => {
    const schema = z.object({
      contentType: z.enum(['article', 'news']).default('article'),
      mode: z.enum(['draft', 'outline', 'headline', 'seo', 'recap', 'spotlight']).default('draft'),
      tone: z.string().max(120).optional().default(env.AI_DEFAULT_TONE),
      length: z.enum(['short', 'medium', 'long']).optional().default('medium'),
      prompt: z.string().max(2000).optional().default(''),
      sourceContext: z.string().max(8000).optional().default(''),
      linkedEventId: z.string().optional(),
      linkedBusinessId: z.string().optional(),
      linkedProfileId: z.string().optional(),
      linkedCommunityId: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid AI writer payload' });
    const db = readDb();
    if (db.site.aiWriterEnabled === false) return res.status(403).json({ error: 'AI writer is disabled in admin settings.' });
    if (!env.AI_API_KEY) return res.status(503).json({ error: 'AI writing is not configured. Set AI_PROVIDER, AI_API_KEY, and AI_MODEL on Railway. Manual CMS still works.' });
    const viewer = (req as any).viewer;
    const linkedFacts = [
      parsed.data.linkedEventId ? db.events.find((item) => item.id === parsed.data.linkedEventId) : null,
      parsed.data.linkedBusinessId ? db.businessListings.find((item) => item.id === parsed.data.linkedBusinessId) : null,
      parsed.data.linkedProfileId ? db.profiles.find((item) => item.id === parsed.data.linkedProfileId) : null,
      parsed.data.linkedCommunityId ? db.communities.find((item) => item.id === parsed.data.linkedCommunityId) : null,
    ].filter(Boolean).map((item) => JSON.stringify(item)).join('\n');
    const system = 'You are STATIK editorial support. Create draft copy only. Never invent real events, people, quotes, results, sponsorships, attendance, locations, or stats. If facts are missing, write questions or clearly mark gaps. Keep a dark, sharp, premium Australian automotive culture tone.';
    const userPrompt = `Content type: ${parsed.data.contentType}\nMode: ${parsed.data.mode}\nTone: ${parsed.data.tone}\nLength: ${parsed.data.length}\nSource notes:\n${parsed.data.sourceContext}\nLinked platform facts:\n${linkedFacts}\nAdmin prompt:\n${parsed.data.prompt}`;
    let output = '';
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.AI_API_KEY}` },
        body: JSON.stringify({ model: env.AI_MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content: userPrompt }], max_tokens: Number(env.AI_MAX_TOKENS || 1200), temperature: 0.55 }),
      });
      if (!response.ok) throw new Error(`AI provider returned HTTP ${response.status}`);
      const json: any = await response.json();
      output = json.choices?.[0]?.message?.content || '';
    } catch (error: any) {
      return res.status(502).json({ error: error.message || 'AI generation failed' });
    }
    let logId = '';
    mutateDb((mutable) => {
      logId = createId('ai');
      mutable.aiGenerationLogs.unshift({ id: logId, actorUserId: viewer.user.id, contentType: parsed.data.contentType, prompt: parsed.data.prompt, sourceContext: parsed.data.sourceContext, output, provider: env.AI_PROVIDER || 'openai', model: env.AI_MODEL, createdAt: nowIso() });
      logAudit(mutable, viewer.user.id, 'ai_generation_created', 'ai_writer', logId, JSON.stringify({ contentType: parsed.data.contentType, mode: parsed.data.mode }));
    });
    return res.json({ id: logId, output, aiAssisted: true });
  });

  router.get('/businesses', requireAdmin, async (req, res) => {
    const db = readDb();
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const items = db.businessListings
      .filter((item) => !status || item.status === status)
      .filter((item) => !q || [item.businessName, item.description, item.category, item.region].join(' ').toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((item) => mapBusinessPublic(db, item));
    return res.json({ items, categories: businessCategories });
  });

  router.post('/businesses', requireAdmin, async (req, res) => upsertBusinessFromAdmin(req as any, res));
  router.patch('/businesses/:businessId', requireAdmin, async (req, res) => upsertBusinessFromAdmin(req as any, res, req.params.businessId));
  router.delete('/businesses/:businessId', requireAdmin, async (req, res) => {
    const viewer = (req as any).viewer;
    mutateDb((db) => {
      const item = db.businessListings.find((entry) => entry.id === req.params.businessId);
      if (!item) throw new Error('Business not found');
      item.status = 'archived';
      item.updatedAt = nowIso();
      logAudit(db, viewer.user.id, 'business_archived', 'business', item.id);
    });
    return res.json({ success: true });
  });


  router.get('/audit-logs', requireAdmin, async (req, res) => {
    const db = readDb();
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const action = typeof req.query.action === 'string' ? req.query.action.toLowerCase() : '';
    const targetType = typeof req.query.targetType === 'string' ? req.query.targetType.toLowerCase() : '';
    const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
    const logs = db.auditLogs
      .filter((log) => !q || [log.action, log.targetType, log.targetId, log.detail || ''].join(' ').toLowerCase().includes(q))
      .filter((log) => !action || log.action.toLowerCase().includes(action))
      .filter((log) => !targetType || log.targetType.toLowerCase() === targetType)
      .filter((log) => !userId || log.actorUserId === userId)
      .slice(0, 500);
    return res.json(logs);
  });

  router.get('/users', requireAdmin, async (req, res) => {
    const db = readDb();
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const items = db.users
      .filter((user) => !q || [user.email, user.displayName].join(' ').toLowerCase().includes(q))
      .map((user) => {
        const profile = db.profiles.find((item) => item.id === user.profileId) || null;
        const sessions = db.sessions.filter((item) => item.userId === user.id).sort((a, b) => (b.lastSeenAt || b.createdAt).localeCompare(a.lastSeenAt || a.createdAt));
        return {
          ...user,
          profile,
          lastIps: Array.from(new Set(sessions.map((session) => session.ip).filter(Boolean))).slice(0, 5),
          recentSessions: sessions.slice(0, 5),
          recentActions: db.auditLogs.filter((log) => log.actorUserId === user.id).slice(0, 12),
          ownedCommunities: db.communities.filter((community) => community.ownerUserId === user.id),
          adminCommunities: db.communities.filter((community) => community.adminUserIds.includes(user.id)),
          hostedEvents: db.events.filter((event) => event.createdByUserId === user.id),
          vehicles: db.garageVehicles.filter((vehicle) => vehicle.profileId === user.profileId),
          media: db.mediaAssets.filter((asset) => asset.ownerUserId === user.id && asset.status === 'uploaded').slice(0, 12),
        };
      });
    return res.json(items);
  });

  router.get('/users/:userId', requireAdmin, async (req, res) => {
    const db = readDb();
    const user = db.users.find((item) => item.id === req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const profile = db.profiles.find((item) => item.id === user.profileId) || null;
    const sessions = db.sessions.filter((item) => item.userId === user.id).sort((a, b) => (b.lastSeenAt || b.createdAt).localeCompare(a.lastSeenAt || a.createdAt));
    return res.json({
      ...user,
      profile,
      lastIps: Array.from(new Set(sessions.map((session) => session.ip).filter(Boolean))).slice(0, 5),
      recentSessions: sessions.slice(0, 10),
      recentActions: db.auditLogs.filter((log) => log.actorUserId === user.id).slice(0, 30),
      relatedReports: db.reports.filter((report) => report.reporterUserId === user.id || report.targetId === user.profileId).slice(0, 20),
      ownedCommunities: db.communities.filter((community) => community.ownerUserId === user.id),
      adminCommunities: db.communities.filter((community) => community.adminUserIds.includes(user.id)),
      hostedEvents: db.events.filter((event) => event.createdByUserId === user.id),
      profilePosts: db.profilePosts.filter((post) => post.profileId === user.profileId).slice(0, 20),
      communityPosts: db.communityPosts.filter((post) => post.authorUserId === user.id).slice(0, 20),
      messages: db.messages.filter((message) => message.userId === user.id).slice(0, 20),
      vehicles: db.garageVehicles.filter((vehicle) => vehicle.profileId === user.profileId),
      media: db.mediaAssets.filter((asset) => asset.ownerUserId === user.id).slice(0, 20),
      shortLinks: db.shortLinks.filter((link) => link.ownerUserId === user.id),
      businesses: db.businessListings.filter((business) => business.ownerUserId === user.id),
    });
  });

  router.patch('/users/:userId', requireAdmin, async (req, res) => {
    const schema = z.object({
      role: z.enum(['user', 'admin']).optional(),
      isBanned: z.boolean().optional(),
      suspensionEndsAt: z.string().nullable().optional(),
      moderationNote: z.string().max(500).optional(),
      verifyProfile: z.boolean().optional(),
      featureProfile: z.boolean().optional(),
      featureEndsAt: z.string().nullable().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid moderation payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const user = db.users.find((item) => item.id === req.params.userId);
        if (!user) throw new Error('User not found');
        const profile = db.profiles.find((item) => item.id === user.profileId);
        if (parsed.data.role) {
          const adminCount = db.users.filter((item) => item.role === 'admin').length;
          if (user.id === viewer.user.id && parsed.data.role !== 'admin') throw new Error('Self-demotion is blocked. Promote another admin first, then use a separate recovery path.');
          if (user.role === 'admin' && parsed.data.role !== 'admin' && adminCount <= 1) throw new Error('Cannot remove the last admin.');
          user.role = parsed.data.role;
        }
        if (typeof parsed.data.isBanned === 'boolean') user.isBanned = parsed.data.isBanned;
        if (parsed.data.suspensionEndsAt !== undefined) user.suspensionEndsAt = parsed.data.suspensionEndsAt;
        if (parsed.data.moderationNote !== undefined) user.moderationNote = parsed.data.moderationNote;
        if (parsed.data.featureEndsAt !== undefined) user.featureEndsAt = parsed.data.featureEndsAt;
        if (profile) {
          if (typeof parsed.data.verifyProfile === 'boolean') profile.verified = parsed.data.verifyProfile;
          if (typeof parsed.data.featureProfile === 'boolean') profile.featured = parsed.data.featureProfile;
        }
        logAudit(db, viewer.user.id, 'user_moderated', 'user', user.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'User not found' });
    }
    return res.json({ success: true });
  });

  router.get('/messages', requireAdmin, async (req, res) => {
    const db = readDb();
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
    const communityId = typeof req.query.communityId === 'string' ? req.query.communityId : '';
    const viewer = (req as any).viewer;
    mutateDb((mutable) => {
      logAudit(mutable, viewer.user.id, 'message_moderation_view', 'messages', communityId || userId || 'search', JSON.stringify({ q, userId, communityId }));
    });
    const messages = db.messages
      .filter((message) => !userId || message.userId === userId)
      .filter((message) => !communityId || message.communityId === communityId)
      .filter((message) => !q || message.text.toLowerCase().includes(q) || (message.moderationNote || '').toLowerCase().includes(q))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 120)
      .map((message) => ({
        ...message,
        profile: db.profiles.find((profile) => profile.userId === message.userId) || null,
        community: db.communities.find((community) => community.id === message.communityId) || null,
        event: message.eventId ? db.events.find((event) => event.id === message.eventId) || null : null,
      }));
    return res.json(messages);
  });



  router.patch('/messages/:messageId', requireAdmin, async (req, res) => {
    const schema = z.object({
      hidden: z.boolean().optional(),
      deleted: z.boolean().optional(),
      moderationNote: z.string().max(500).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid message moderation payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const message = db.messages.find((item) => item.id === req.params.messageId);
        if (!message) throw new Error('Message not found');
        if (typeof parsed.data.hidden === 'boolean') {
          message.hidden = parsed.data.hidden;
          message.hiddenAt = parsed.data.hidden ? nowIso() : undefined;
          message.hiddenByUserId = parsed.data.hidden ? viewer.user.id : undefined;
        }
        if (typeof parsed.data.deleted === 'boolean') {
          message.deleted = parsed.data.deleted;
          message.deletedAt = parsed.data.deleted ? nowIso() : undefined;
          message.deletedByUserId = parsed.data.deleted ? viewer.user.id : undefined;
        }
        if (parsed.data.moderationNote !== undefined) message.moderationNote = parsed.data.moderationNote;
        logAudit(db, viewer.user.id, 'message_moderated', 'message', message.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Message not found' });
    }
    return res.json({ success: true });
  });

  router.delete('/messages/:messageId', requireAdmin, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const message = db.messages.find((item) => item.id === req.params.messageId);
        if (!message) throw new Error('Message not found');
        message.deleted = true;
        message.hidden = true;
        message.deletedAt = nowIso();
        message.hiddenAt = nowIso();
        message.deletedByUserId = viewer.user.id;
        message.hiddenByUserId = viewer.user.id;
        message.moderationNote = message.moderationNote || 'Removed from admin message moderation.';
        logAudit(db, viewer.user.id, 'message_deleted_by_admin', 'message', message.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Message not found' });
    }
    return res.json({ success: true });
  });

  router.get('/imports', requireAdmin, async (_req, res) => {
    const db = readDb();
    return res.json({
      sources: db.eventImportSources,
      runs: db.eventImportRuns.slice(0, 50),
      items: db.eventImportItems.slice(0, 120),
    });
  });


  router.patch('/imports/sources/:sourceId', requireAdmin, async (req, res) => {
    const schema = z.object({
      name: z.string().min(2).max(80).optional(),
      baseUrl: z.string().url().optional(),
      enabled: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid import source payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const source = db.eventImportSources.find((item) => item.id === req.params.sourceId);
        if (!source) throw new Error('Import source not found');
        Object.assign(source, parsed.data, { updatedAt: nowIso() });
        logAudit(db, viewer.user.id, 'import_source_updated', 'import_source', source.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Import source not found' });
    }
    return res.json({ success: true });
  });

  router.post('/imports/run', requireAdmin, async (req, res) => {
    const schema = z.object({ sourceKey: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid import request' });
    const viewer = (req as any).viewer;
    try {
      const db = readDb();
      const run = await runImportSource(db, parsed.data.sourceKey);
      mutateDb((mutable) => {
        mutable.eventImportSources = db.eventImportSources;
        mutable.eventImportRuns = db.eventImportRuns;
        mutable.eventImportItems = db.eventImportItems;
        logAudit(mutable, viewer.user.id, 'import_run', 'import_source', parsed.data.sourceKey, JSON.stringify(run));
      });
      return res.json(run);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Import failed' });
    }
  });

  router.patch('/imports/items/:itemId', requireAdmin, async (req, res) => {
    const schema = z.object({
      status: z.enum(['pending', 'approved', 'rejected', 'archived']).optional(),
      adminNote: z.string().max(500).optional(),
      publishEvent: z.boolean().optional(),
      title: z.string().max(140).optional(),
      location: z.string().max(180).optional(),
      date: z.string().optional(),
      time: z.string().max(80).optional(),
      category: z.string().max(80).optional(),
      description: z.string().max(2400).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid import moderation payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const item = db.eventImportItems.find((entry) => entry.id === req.params.itemId);
        if (!item) throw new Error('Import item not found');
        Object.assign(item, {
          title: parsed.data.title ?? item.title,
          location: parsed.data.location ?? item.location,
          date: parsed.data.date ?? item.date,
          time: parsed.data.time ?? item.time,
          category: parsed.data.category ?? item.category,
          description: parsed.data.description ?? item.description,
          adminNote: parsed.data.adminNote ?? item.adminNote,
          updatedAt: nowIso(),
        });
        if (parsed.data.status) item.status = parsed.data.status;
        if (parsed.data.publishEvent) {
          publishImportItemAsEvent(db, item, viewer.user.id);
          item.status = 'approved';
        }
        logAudit(db, viewer.user.id, 'import_item_moderated', 'import_item', item.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Import item not found' });
    }
    return res.json({ success: true });
  });

  router.patch('/site', requireAdmin, async (req, res) => {
    const schema = z.object({
      shopLocked: z.boolean().optional(),
      maintenanceMode: z.boolean().optional(),
      registrationOpen: z.boolean().optional(),
      brandTagline: z.string().min(8).max(120).optional(),
      importsEnabled: z.boolean().optional(),
      homepageHeroMode: z.enum(['events', 'hybrid']).optional(),
      messageModerationEnabled: z.boolean().optional(),
      eventVisibilityMode: z.enum(['open', 'curated']).optional(),
      mapProvider: z.enum(['google', 'mapbox', 'manual']).optional(),
      featureWindowDaysDefault: z.number().min(1).max(30).optional(),
      approvalWorkflowDefault: z.enum(['manual', 'trusted_auto_queue']).optional(),
      sponsorEventModuleEnabled: z.boolean().optional(),
      auditRetentionDays: z.number().min(7).max(3650).optional(),
      newestMembersEnabled: z.boolean().optional(),
      articlesEnabled: z.boolean().optional(),
      newsEnabled: z.boolean().optional(),
      businessDirectoryEnabled: z.boolean().optional(),
      aiWriterEnabled: z.boolean().optional(),
      newestMembersRequireCompleteProfile: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid site settings payload' });
    const viewer = (req as any).viewer;

    mutateDb((db) => {
      db.site = { ...db.site, ...parsed.data };
      logAudit(db, viewer.user.id, 'site_settings_updated', 'site', 'site', JSON.stringify(parsed.data));
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
        logAudit(db, viewer.user.id, 'profile_moderated', 'profile', profile.id, JSON.stringify(parsed.data));
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Profile not found' });
    }

    return res.json({ success: true });
  });

  router.patch('/events/:eventId', requireAdmin, async (req, res) => {
    const schema = z.object({
      featured: z.boolean().optional(),
      approvalStatus: z.enum(['pending', 'approved', 'rejected', 'revision_requested']).optional(),
      adminNote: z.string().max(500).optional(),
      sponsored: z.boolean().optional(),
      sponsorName: z.string().max(120).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid event moderation payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const event = db.events.find((item) => item.id === req.params.eventId);
        if (!event) throw new Error('Event not found');
        const previousStatus = event.approvalStatus;
        if (typeof parsed.data.featured === 'boolean') event.featured = parsed.data.featured;
        if (parsed.data.approvalStatus) {
          event.approvalStatus = parsed.data.approvalStatus;
          event.statusHistory = event.statusHistory || [];
          event.statusHistory.unshift({ status: parsed.data.approvalStatus, at: nowIso(), byUserId: viewer.user.id, note: parsed.data.adminNote });
        }
        if (typeof parsed.data.sponsored === 'boolean') event.sponsored = parsed.data.sponsored;
        if (typeof parsed.data.sponsorName === 'string') event.sponsorName = parsed.data.sponsorName;
        if (parsed.data.adminNote) {
          event.adminNotes = [...(event.adminNotes || []), parsed.data.adminNote].slice(-10);
        }
        event.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'event_moderated', 'event', event.id, JSON.stringify(parsed.data), `revert:${previousStatus}`);
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
        Object.assign(community, parsed.data, { updatedAt: nowIso() });
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
        db.events.forEach((event) => { event.mediaIds = (event.mediaIds || []).filter((id) => id !== asset.id); });
        logAudit(db, viewer.user.id, 'media_removed_admin', 'media', asset.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Media not found' });
    }
    return res.json({ success: true });
  });

  return router;
}
