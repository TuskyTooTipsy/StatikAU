import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import {
  canManageCommunity,
  createId,
  getCommunityPosts,
  getProfileGarage,
  hashVisitorKey,
  logAudit,
  mutateDb,
  nowIso,
  profileStats,
  readDb,
  trackAnalyticsEvent,
  uniqueSlug,
} from '../lib/store';

function assertMember(community: any, userId: string) {
  return community.memberUserIds.includes(userId);
}

function messagePayload(db: ReturnType<typeof readDb>, message: any) {
  const profile = db.profiles.find((item) => item.userId === message.userId);
  const event = message.eventId ? db.events.find((item) => item.id === message.eventId) : null;
  return {
    ...message,
    profile,
    event,
  };
}

function communityPreview(db: ReturnType<typeof readDb>, community: any, viewerUserId?: string) {
  const joinRequest = viewerUserId ? db.communityJoinRequests.find((item) => item.communityId === community.id && item.userId === viewerUserId && item.status === 'pending') : null;
  return {
    id: community.id,
    slug: community.slug,
    name: community.name,
    description: community.description,
    visibility: community.visibility,
    avatarUrl: community.avatarUrl,
    bannerUrl: community.bannerUrl,
    region: community.region,
    tags: community.tags,
    rules: community.rules,
    applicationQuestions: community.applicationQuestions,
    memberCount: community.memberUserIds.length,
    isMember: viewerUserId ? community.memberUserIds.includes(viewerUserId) : false,
    isAdmin: viewerUserId ? canManageCommunity(community, viewerUserId) : false,
    hasPendingRequest: Boolean(joinRequest),
  };
}

function communityPayload(db: ReturnType<typeof readDb>, community: any, viewerUserId?: string) {
  const owner = db.profiles.find((item) => item.userId === community.ownerUserId) || null;
  const admins = community.adminUserIds
    .map((userId: string) => db.profiles.find((item) => item.userId === userId))
    .filter(Boolean);
  const members = community.memberUserIds
    .map((userId: string) => db.profiles.find((item) => item.userId === userId))
    .filter(Boolean)
    .map((profile: any) => ({ ...profile, stats: profileStats(db, profile.id) }));
  const messages = db.messages
    .filter((message) => message.communityId === community.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(-120)
    .map((message) => messagePayload(db, message));
  const joinRequests = db.communityJoinRequests
    .filter((request) => request.communityId === community.id && request.status === 'pending')
    .map((request) => ({ ...request, profile: db.profiles.find((item) => item.userId === request.userId) || null }));
  const hostedEvents = db.events.filter((event) => event.hostCommunityId === community.id).sort((a, b) => a.date.localeCompare(b.date));
  const posts = getCommunityPosts(db, community.id);
  const featuredMembers = community.featuredMemberUserIds.map((userId: string) => db.profiles.find((item) => item.userId === userId)).filter(Boolean);
  const featuredVehicles = community.featuredVehicleIds
    .map((vehicleId: string) => db.garageVehicles.find((item) => item.id === vehicleId))
    .filter(Boolean)
    .map((vehicle: any) => ({
      ...vehicle,
      owner: db.profiles.find((item) => item.id === vehicle.profileId) || null,
    }));
  const memberVehicles = db.garageVehicles
    .filter((vehicle) => vehicle.visibility !== 'private' && (vehicle.linkedCommunityIds || []).includes(community.id))
    .map((vehicle: any) => ({
      ...vehicle,
      owner: db.profiles.find((item) => item.id === vehicle.profileId) || null,
    }));

  return {
    ...communityPreview(db, community, viewerUserId),
    owner,
    admins,
    members,
    memberCount: community.memberUserIds.length,
    messages,
    posts,
    joinRequests: viewerUserId && canManageCommunity(community, viewerUserId) ? joinRequests : [],
    hostedEvents,
    featuredMembers,
    featuredVehicles,
    memberVehicles,
    applicationQuestions: community.applicationQuestions,
    discoverable: community.discoverable,
    createdAt: community.createdAt,
    updatedAt: community.updatedAt,
  };
}

export default function communitiesRouter() {
  const router = Router();

  router.get('/', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    const db = readDb();
    const items = db.communities
      .filter((community) => community.discoverable || community.memberUserIds.includes(viewer.user.id) || canManageCommunity(community, viewer.user.id))
      .sort((a, b) => b.memberUserIds.length - a.memberUserIds.length)
      .map((community) => communityPreview(db, community, viewer.user.id));
    return res.json(items);
  });

  router.post('/', requireAuth, async (req, res) => {
    const schema = z.object({
      name: z.string().min(2).max(60),
      description: z.string().min(10).max(320),
      visibility: z.enum(['public', 'private']).default('public'),
      avatarUrl: z.string().url().or(z.literal('')).optional().default(''),
      bannerUrl: z.string().url().or(z.literal('')).optional().default(''),
      region: z.string().max(80).optional().default(''),
      tags: z.array(z.string().max(24)).max(8).optional().default([]),
      rules: z.array(z.string().max(120)).max(6).optional().default([]),
      applicationQuestions: z.array(z.string().max(120)).max(4).optional().default([]),
      discoverable: z.boolean().optional().default(true),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid community payload' });
    const viewer = (req as any).viewer;

    const created = mutateDb((db) => {
      const now = nowIso();
      const community = {
        id: createId('community'),
        slug: uniqueSlug(parsed.data.name, db.communities.map((item) => item.slug)),
        name: parsed.data.name,
        description: parsed.data.description,
        visibility: parsed.data.visibility,
        avatarUrl: parsed.data.avatarUrl,
        bannerUrl: parsed.data.bannerUrl,
        region: parsed.data.region,
        tags: parsed.data.tags,
        rules: parsed.data.rules,
        applicationQuestions: parsed.data.applicationQuestions,
        discoverable: parsed.data.discoverable,
        ownerUserId: viewer.user.id,
        adminUserIds: [],
        memberUserIds: [viewer.user.id],
        featuredMemberUserIds: [viewer.user.id],
        featuredVehicleIds: [],
        featuredPostIds: [],
        featuredEventIds: [],
        createdAt: now,
        updatedAt: now,
      };
      db.communities.push(community);
      logAudit(db, viewer.user.id, 'community_created', 'community', community.id);
      return community.slug;
    });

    const db = readDb();
    const community = db.communities.find((item) => item.slug === created);
    return res.status(201).json(community ? communityPayload(db, community, viewer.user.id) : null);
  });

  router.patch('/:id', requireAuth, async (req, res) => {
    const schema = z.object({
      name: z.string().min(2).max(60).optional(),
      description: z.string().min(10).max(320).optional(),
      visibility: z.enum(['public', 'private']).optional(),
      avatarUrl: z.string().url().or(z.literal('')).optional(),
      bannerUrl: z.string().url().or(z.literal('')).optional(),
      region: z.string().max(80).optional(),
      tags: z.array(z.string().max(24)).max(8).optional(),
      rules: z.array(z.string().max(120)).max(6).optional(),
      applicationQuestions: z.array(z.string().max(120)).max(4).optional(),
      discoverable: z.boolean().optional(),
      featuredMemberUserIds: z.array(z.string()).max(8).optional(),
      featuredVehicleIds: z.array(z.string()).max(8).optional(),
      featuredEventIds: z.array(z.string()).max(8).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid community update payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (!canManageCommunity(community, viewer.user.id) && viewer.user.role !== 'admin') throw new Error('Not allowed to manage this community');
        Object.assign(community, parsed.data, { updatedAt: nowIso() });
        if (parsed.data.name) {
          community.slug = uniqueSlug(parsed.data.name, db.communities.filter((item) => item.id !== community.id).map((item) => item.slug));
        }
        logAudit(db, viewer.user.id, 'community_updated', 'community', community.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not update community' });
    }

    return res.json({ success: true });
  });

  router.get('/:slug', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    const db = readDb();
    const community = db.communities.find((item) => item.slug === req.params.slug);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    if (community.visibility === 'private' && !community.memberUserIds.includes(viewer.user.id) && !canManageCommunity(community, viewer.user.id) && viewer.user.role !== 'admin') {
      return res.status(403).json({ error: 'This community is private' });
    }

    mutateDb((runtime) => {
      trackAnalyticsEvent(runtime, {
        actorUserId: viewer.user.id,
        sessionKey: hashVisitorKey(`${viewer.user.id}:${req.ip}:${req.headers['user-agent'] || 'unknown'}`),
        source: 'community',
        eventType: 'community_view',
        targetType: 'community',
        targetId: community.id,
      });
    });

    return res.json(communityPayload(readDb(), community, viewer.user.id));
  });

  router.post('/:id/join', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (community.visibility === 'private') throw new Error('Private communities must use join requests');
        if (!community.memberUserIds.includes(viewer.user.id)) community.memberUserIds.push(viewer.user.id);
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'community_joined', 'community', community.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not join community' });
    }
    return res.json({ success: true });
  });

  router.post('/:id/join-request', requireAuth, async (req, res) => {
    const schema = z.object({ answers: z.array(z.string().max(200)).max(4).optional().default([]) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid join request payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (community.visibility !== 'private') throw new Error('Only private communities use join requests');
        if (community.memberUserIds.includes(viewer.user.id)) throw new Error('You are already a member');
        const existing = db.communityJoinRequests.find((item) => item.communityId === community.id && item.userId === viewer.user.id && item.status === 'pending');
        if (existing) throw new Error('Join request already pending');
        db.communityJoinRequests.push({ id: createId('joinreq'), communityId: community.id, userId: viewer.user.id, status: 'pending', answers: parsed.data.answers, createdAt: nowIso(), updatedAt: nowIso() });
        logAudit(db, viewer.user.id, 'community_join_requested', 'community', community.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not request access' });
    }
    return res.json({ success: true });
  });

  router.post('/:id/join-requests/:requestId/review', requireAuth, async (req, res) => {
    const schema = z.object({ action: z.enum(['approve', 'reject']) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid review payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (!canManageCommunity(community, viewer.user.id) && viewer.user.role !== 'admin') throw new Error('Not allowed to review requests');
        const request = db.communityJoinRequests.find((item) => item.id === req.params.requestId && item.communityId === community.id);
        if (!request) throw new Error('Join request not found');
        request.status = parsed.data.action === 'approve' ? 'approved' : 'rejected';
        request.updatedAt = nowIso();
        if (parsed.data.action === 'approve' && !community.memberUserIds.includes(request.userId)) community.memberUserIds.push(request.userId);
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, `community_join_${parsed.data.action}d`, 'community', community.id, request.userId);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not review request' });
    }
    return res.json({ success: true });
  });

  router.post('/:id/leave', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (community.ownerUserId === viewer.user.id) throw new Error('Owner cannot leave without transferring ownership');
        community.memberUserIds = community.memberUserIds.filter((id: string) => id !== viewer.user.id);
        community.adminUserIds = community.adminUserIds.filter((id: string) => id !== viewer.user.id);
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'community_left', 'community', community.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not leave community' });
    }
    return res.json({ success: true });
  });

  router.post('/:id/posts', requireAuth, async (req, res) => {
    const schema = z.object({
      caption: z.string().min(1).max(500),
      mediaIds: z.array(z.string()).max(8).optional().default([]),
      linkedEventId: z.string().optional(),
      pinned: z.boolean().optional().default(false),
      featured: z.boolean().optional().default(false),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid group post payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (!assertMember(community, viewer.user.id) && viewer.user.role !== 'admin') throw new Error('Join this community to post');
        const postId = createId('cpost');
        db.communityPosts.push({ id: postId, communityId: community.id, authorUserId: viewer.user.id, createdAt: nowIso(), updatedAt: nowIso(), ...parsed.data });
        db.mediaAssets.forEach((asset) => {
          if (parsed.data.mediaIds.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
            asset.ownerType = 'community_post';
            asset.ownerId = postId;
            asset.updatedAt = nowIso();
          }
        });
        if (parsed.data.featured && !community.featuredPostIds.includes(postId)) community.featuredPostIds.unshift(postId);
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'community_post_created', 'community_post', postId, community.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not create community post' });
    }

    const db = readDb();
    const community = db.communities.find((item) => item.id === req.params.id);
    return res.status(201).json(community ? communityPayload(db, community, viewer.user.id) : null);
  });

  router.patch('/:id/posts/:postId', requireAuth, async (req, res) => {
    const schema = z.object({
      caption: z.string().min(1).max(500).optional(),
      mediaIds: z.array(z.string()).max(8).optional(),
      linkedEventId: z.string().optional(),
      pinned: z.boolean().optional(),
      featured: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid group post update payload' });
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        const post = db.communityPosts.find((item) => item.id === req.params.postId && item.communityId === community.id);
        if (!post) throw new Error('Post not found');
        const canEdit = post.authorUserId === viewer.user.id || canManageCommunity(community, viewer.user.id) || viewer.user.role === 'admin';
        if (!canEdit) throw new Error('Not allowed to edit this post');
        Object.assign(post, parsed.data, { updatedAt: nowIso() });
        if (typeof parsed.data.featured === 'boolean') {
          community.featuredPostIds = parsed.data.featured
            ? Array.from(new Set([post.id, ...community.featuredPostIds]))
            : community.featuredPostIds.filter((id: string) => id !== post.id);
        }
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'community_post_updated', 'community_post', post.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not update post' });
    }
    return res.json({ success: true });
  });

  router.delete('/:id/posts/:postId', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        const post = db.communityPosts.find((item) => item.id === req.params.postId && item.communityId === community.id);
        if (!post) throw new Error('Post not found');
        const canDelete = post.authorUserId === viewer.user.id || canManageCommunity(community, viewer.user.id) || viewer.user.role === 'admin';
        if (!canDelete) throw new Error('Not allowed to delete this post');
        db.communityPosts = db.communityPosts.filter((item) => item.id !== post.id);
        community.featuredPostIds = community.featuredPostIds.filter((id: string) => id !== post.id);
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'community_post_deleted', 'community_post', post.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not delete post' });
    }
    return res.json({ success: true });
  });

  router.post('/:id/messages', requireAuth, async (req, res) => {
    const schema = z.object({
      type: z.enum(['text', 'event', 'location']).default('text'),
      text: z.string().max(600).optional().default(''),
      eventId: z.string().optional(),
      location: z.object({
        lat: z.number(),
        lng: z.number(),
        label: z.string().max(120).optional(),
      }).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid message payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (!assertMember(community, viewer.user.id)) throw new Error('Join this community to chat');
        if (parsed.data.type === 'event' && !parsed.data.eventId) throw new Error('Event messages must include an event');
        if (parsed.data.type === 'location' && !parsed.data.location) throw new Error('Location messages must include coordinates');
        if (parsed.data.type === 'text' && !parsed.data.text.trim()) throw new Error('Message cannot be empty');
        db.messages.push({
          id: createId('message'),
          communityId: community.id,
          userId: viewer.user.id,
          type: parsed.data.type,
          text: parsed.data.text,
          eventId: parsed.data.eventId,
          location: parsed.data.location,
          createdAt: nowIso(),
        });
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'community_message_sent', 'community', community.id, parsed.data.type);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not send message' });
    }

    const db = readDb();
    const community = db.communities.find((item) => item.id === req.params.id);
    return res.status(201).json(community ? communityPayload(db, community, viewer.user.id) : null);
  });

  router.delete('/:id/messages/:messageId', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        const message = db.messages.find((item) => item.id === req.params.messageId && item.communityId === community.id);
        if (!message) throw new Error('Message not found');
        const canDelete = message.userId === viewer.user.id || canManageCommunity(community, viewer.user.id) || viewer.user.role === 'admin';
        if (!canDelete) throw new Error('Not allowed to delete this message');
        db.messages = db.messages.filter((item) => item.id !== message.id);
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'community_message_deleted', 'message', message.id);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not delete message' });
    }
    return res.json({ success: true });
  });

  router.post('/:id/admins', requireAuth, async (req, res) => {
    const schema = z.object({
      userId: z.string().min(1),
      action: z.enum(['promote', 'demote']),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid admin action payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (community.ownerUserId !== viewer.user.id && viewer.user.role !== 'admin') throw new Error('Only the owner can manage admins');
        if (!community.memberUserIds.includes(parsed.data.userId)) throw new Error('Target user is not a member');
        if (parsed.data.action === 'promote' && !community.adminUserIds.includes(parsed.data.userId)) {
          community.adminUserIds.push(parsed.data.userId);
        }
        if (parsed.data.action === 'demote') {
          community.adminUserIds = community.adminUserIds.filter((id: string) => id !== parsed.data.userId);
        }
        community.updatedAt = nowIso();
        logAudit(db, viewer.user.id, parsed.data.action === 'promote' ? 'community_admin_promoted' : 'community_admin_demoted', 'community', community.id, parsed.data.userId);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not update community admin' });
    }
    return res.json({ success: true });
  });

  router.post('/:id/members/:userId/kick', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const community = db.communities.find((item) => item.id === req.params.id);
        if (!community) throw new Error('Community not found');
        if (!canManageCommunity(community, viewer.user.id) && viewer.user.role !== 'admin') throw new Error('Not allowed to manage this community');
        if (community.ownerUserId === req.params.userId) throw new Error('Owner cannot be kicked');
        community.memberUserIds = community.memberUserIds.filter((id: string) => id !== req.params.userId);
        community.adminUserIds = community.adminUserIds.filter((id: string) => id !== req.params.userId);
        community.updatedAt = nowIso();
        db.messages = db.messages.filter((message) => !(message.communityId === community.id && message.userId === req.params.userId));
        logAudit(db, viewer.user.id, 'community_member_kicked', 'community', community.id, req.params.userId);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not kick member' });
    }
    return res.json({ success: true });
  });

  return router;
}
