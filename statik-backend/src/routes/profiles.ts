import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import {
  aggregateCountByDay,
  countMutualFriends,
  createId,
  getFriendUserIds,
  getProfileAffiliations,
  getProfileGarage,
  getProfilePosts,
  getProfileShortLinks,
  hashVisitorKey,
  logAudit,
  mutateDb,
  nowIso,
  profileStats,
  readDb,
  trackAnalyticsEvent,
  uniqueSlug,
  uniqueVisitors,
} from '../lib/store';
import { getPublicAppUrl } from '../lib/env';

function mapProfileSummary(db: ReturnType<typeof readDb>, profile: any, viewerUserId?: string) {
  const user = db.users.find((item) => item.id === profile.userId);
  const friends = getFriendUserIds(db, profile.userId);
  return {
    ...profile,
    stats: profileStats(db, profile.id),
    friendCount: friends.length,
    mutualFriends: viewerUserId ? countMutualFriends(db, profile.userId, viewerUserId) : 0,
    isFriend: viewerUserId ? friends.includes(viewerUserId) : false,
    role: user?.role || 'user',
  };
}

function analyticsForProfile(db: ReturnType<typeof readDb>, profile: any) {
  const profileViews = db.analyticsEvents.filter((event) => event.eventType === 'profile_view' && event.targetId === profile.id);
  const garageViews = db.analyticsEvents.filter((event) => event.eventType === 'garage_view' && event.targetId === profile.id);
  const vehicles = db.garageVehicles.filter((vehicle) => vehicle.profileId === profile.id);
  const vehicleViews = vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: [vehicle.year, vehicle.make, vehicle.model, vehicle.nickname].filter(Boolean).join(' ').trim() || 'Vehicle',
    count: db.analyticsEvents.filter((event) => event.eventType === 'vehicle_view' && event.targetId === vehicle.id).length,
  })).sort((a, b) => b.count - a.count);
  const posts = db.profilePosts.filter((post) => post.profileId === profile.id);
  const postViews = posts.map((post) => ({
    id: post.id,
    caption: post.caption,
    count: db.analyticsEvents.filter((event) => event.eventType === 'profile_post_view' && event.targetId === post.id).length,
  })).sort((a, b) => b.count - a.count);
  const myLinks = getProfileShortLinks(db, profile);
  const affiliations = getProfileAffiliations(db, profile.userId).map((group) => ({
    ...group,
    count: db.analyticsEvents.filter((event) => event.eventType === 'community_view' && event.targetId === group.id).length,
  })).sort((a, b) => b.count - a.count);
  const acceptedFriends = db.friendRequests.filter((request) => request.status === 'accepted' && (request.fromUserId === profile.userId || request.toUserId === profile.userId));
  const linkClicks = myLinks.reduce((sum, link) => sum + link.clickCount, 0);
  const qrScans = myLinks.reduce((sum, link) => sum + link.qrScanCount, 0);
  const sources = Object.entries(profileViews.reduce((acc: Record<string, number>, event) => {
    acc[event.source] = (acc[event.source] || 0) + 1;
    return acc;
  }, {})).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  const trend = aggregateCountByDay(profileViews, 14);
  const avg = trend.length ? trend.reduce((sum, point) => sum + point.count, 0) / trend.length : 0;
  const spike = [...trend].sort((a, b) => b.count - a.count)[0];

  return {
    visibility: profile.analyticsVisibility,
    profileViews: profileViews.length,
    uniqueVisitors: uniqueVisitors(profileViews),
    garageViews: garageViews.length,
    linkClicks,
    qrScans,
    followerCount: getFriendUserIds(db, profile.userId).length,
    followerGrowthPoints: aggregateCountByDay(acceptedFriends.map((request) => ({
      id: request.id,
      actorUserId: null,
      sessionKey: request.id,
      source: 'friend',
      eventType: 'profile_view' as const,
      targetType: 'profile',
      targetId: profile.id,
      createdAt: request.updatedAt,
    })), 14),
    profileViewTrend: trend,
    topVehicles: vehicleViews.slice(0, 5),
    topPosts: postViews.slice(0, 5),
    topAffiliations: affiliations.slice(0, 5),
    sources,
    visibilitySpike: spike && spike.count > avg * 2 && spike.count > 0 ? `${spike.date} • ${spike.count} views` : null,
  };
}

function mapProfileDetail(db: ReturnType<typeof readDb>, profile: any, viewerUserId?: string) {
  const summary = mapProfileSummary(db, profile, viewerUserId);
  const garage = getProfileGarage(db, profile.id, viewerUserId);
  const posts = getProfilePosts(db, profile.id);
  const affiliations = getProfileAffiliations(db, profile.userId);
  const externalLinks = db.profileLinks.filter((item) => item.profileId === profile.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const shortLinks = getProfileShortLinks(db, profile).map((link) => ({
    ...link,
    shortUrl: `${getPublicAppUrl()}/s/${link.slug}`,
    qrUrl: `${getPublicAppUrl()}/s/${link.slug}?src=qr`,
  }));

  return {
    ...summary,
    about: profile.about,
    currentlyBuilding: profile.currentlyBuilding,
    sceneTags: profile.sceneTags,
    garage,
    posts,
    affiliations,
    externalLinks,
    shortLinks,
    analytics: profile.analyticsVisibility === 'public' ? analyticsForProfile(db, profile) : { visibility: 'private' },
  };
}

export default function profilesRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const viewerUserId = typeof req.query.viewerUserId === 'string' ? req.query.viewerUserId : undefined;
    const db = readDb();
    const featuredOnly = req.query.featured === 'true';
    const verifiedOnly = req.query.verified === 'true';
    let items = db.profiles;
    if (featuredOnly) items = items.filter((item) => item.featured || item.promoted);
    if (verifiedOnly) items = items.filter((item) => item.verified);
    items = [...items].sort((a, b) => {
      const aStats = profileStats(db, a.id);
      const bStats = profileStats(db, b.id);
      return (Number(b.promoted) - Number(a.promoted)) || (Number(b.featured) - Number(a.featured)) || (Number(b.verified) - Number(a.verified)) || (bStats.friendCount - aStats.friendCount);
    });
    return res.json(items.map((profile) => mapProfileSummary(db, profile, viewerUserId)).slice(0, 60));
  });


  router.get('/discovery/newest', async (req, res) => {
    const db = readDb();
    if (db.site.newestMembersEnabled === false) return res.json({ members: [] });
    const limit = Math.min(Number(req.query.limit || 12), 30);
    const items = db.profiles
      .filter((profile) => profile.discoveryVisible !== false && profile.newestMemberVisible !== false)
      .filter((profile) => {
        const user = db.users.find((item) => item.id === profile.userId);
        if (!user || user.isBanned) return false;
        if (user.suspensionEndsAt && new Date(user.suspensionEndsAt).getTime() > Date.now()) return false;
        if (db.site.newestMembersRequireCompleteProfile && !profile.profileComplete) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
      .map((profile) => {
        const garage = getProfileGarage(db, profile.id, null);
        return {
          ...mapProfileSummary(db, profile),
          location: profile.showLocation === false ? '' : profile.location,
          memberType: profile.memberType || 'car_enthusiast',
          featuredVehicle: garage.find((vehicle: any) => vehicle.featured) || garage[0] || null,
        };
      });
    return res.json({ enabled: true, items });
  });

  router.get('/me/garage', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    const db = readDb();
    return res.json(getProfileGarage(db, viewer.profile.id, viewer.user.id));
  });

  router.post('/me/garage', requireAuth, async (req, res) => {
    const schema = z.object({
      vehicleType: z.enum(['car', 'bike', 'truck', 'other']).default('car'),
      year: z.string().max(10).optional().default(''),
      make: z.string().min(1).max(40),
      model: z.string().min(1).max(40),
      trim: z.string().max(40).optional().default(''),
      generation: z.string().max(40).optional().default(''),
      specialEdition: z.string().max(60).optional().default(''),
      bodyStyle: z.string().max(40).optional().default(''),
      drivetrain: z.string().max(40).optional().default(''),
      engineFamily: z.string().max(60).optional().default(''),
      transmission: z.string().max(40).optional().default(''),
      engineCode: z.string().max(40).optional().default(''),
      induction: z.string().max(40).optional().default(''),
      fuelType: z.string().max(40).optional().default(''),
      colourWrap: z.string().max(80).optional().default(''),
      wheelTyreSpec: z.string().max(160).optional().default(''),
      suspensionSetup: z.string().max(160).optional().default(''),
      engineMods: z.string().max(240).optional().default(''),
      aeroBodyMods: z.string().max(240).optional().default(''),
      interiorAudioNotes: z.string().max(240).optional().default(''),
      performanceNotes: z.string().max(240).optional().default(''),
      nickname: z.string().max(40).optional().default(''),
      stage: z.string().max(60).optional().default(''),
      ownershipStatus: z.string().max(40).optional().default(''),
      statusTags: z.array(z.string().max(30)).max(10).optional().default([]),
      purposeTags: z.array(z.string().max(30)).max(12).optional().default([]),
      setupTags: z.array(z.string().max(30)).max(12).optional().default([]),
      visibility: z.enum(['public', 'private']).default('public'),
      description: z.string().max(500).optional().default(''),
      modTags: z.array(z.string().max(40)).max(20).optional().default([]),
      mediaIds: z.array(z.string()).max(12).optional().default([]),
      heroMediaId: z.string().optional(),
      linkedCommunityIds: z.array(z.string()).max(6).optional().default([]),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid garage vehicle payload' });
    const viewer = (req as any).viewer;

    mutateDb((db) => {
      const createdAt = nowIso();
      const vehicleId = createId('vehicle');
      db.garageVehicles.push({
        id: vehicleId,
        profileId: viewer.profile.id,
        timeline: [],
        featured: false,
        createdAt,
        updatedAt: createdAt,
        ...parsed.data,
      });
      db.mediaAssets.forEach((asset) => {
        if (parsed.data.mediaIds.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
          asset.ownerType = 'vehicle';
          asset.ownerId = vehicleId;
          asset.updatedAt = nowIso();
        }
      });
      logAudit(db, viewer.user.id, 'garage_vehicle_created', 'vehicle', vehicleId);
    });

    return res.status(201).json(readDb().garageVehicles.filter((item) => item.profileId === viewer.profile.id));
  });

  router.patch('/me/garage/:vehicleId', requireAuth, async (req, res) => {
    const schema = z.object({
      year: z.string().max(10).optional(),
      make: z.string().min(1).max(40).optional(),
      model: z.string().min(1).max(40).optional(),
      trim: z.string().max(40).optional(),
      generation: z.string().max(40).optional(),
      specialEdition: z.string().max(60).optional(),
      bodyStyle: z.string().max(40).optional(),
      drivetrain: z.string().max(40).optional(),
      engineFamily: z.string().max(60).optional(),
      transmission: z.string().max(40).optional(),
      engineCode: z.string().max(40).optional(),
      induction: z.string().max(40).optional(),
      fuelType: z.string().max(40).optional(),
      colourWrap: z.string().max(80).optional(),
      wheelTyreSpec: z.string().max(160).optional(),
      suspensionSetup: z.string().max(160).optional(),
      engineMods: z.string().max(240).optional(),
      aeroBodyMods: z.string().max(240).optional(),
      interiorAudioNotes: z.string().max(240).optional(),
      performanceNotes: z.string().max(240).optional(),
      nickname: z.string().max(40).optional(),
      stage: z.string().max(60).optional(),
      ownershipStatus: z.string().max(40).optional(),
      statusTags: z.array(z.string().max(30)).max(10).optional(),
      purposeTags: z.array(z.string().max(30)).max(12).optional(),
      setupTags: z.array(z.string().max(30)).max(12).optional(),
      visibility: z.enum(['public', 'private']).optional(),
      description: z.string().max(500).optional(),
      modTags: z.array(z.string().max(40)).max(20).optional(),
      mediaIds: z.array(z.string()).max(12).optional(),
      heroMediaId: z.string().optional(),
      linkedCommunityIds: z.array(z.string()).max(6).optional(),
      featured: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid garage update payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const vehicle = db.garageVehicles.find((item) => item.id === req.params.vehicleId && item.profileId === viewer.profile.id);
        if (!vehicle) throw new Error('Vehicle not found');
        Object.assign(vehicle, parsed.data, { updatedAt: nowIso() });
        if (parsed.data.mediaIds) {
          db.mediaAssets.forEach((asset) => {
            if (parsed.data.mediaIds?.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
              asset.ownerType = 'vehicle';
              asset.ownerId = vehicle.id;
              asset.updatedAt = nowIso();
            }
          });
        }
        if (parsed.data.featured) {
          db.profiles.forEach((profile) => {
            if (profile.id === viewer.profile.id) profile.featuredVehicleId = vehicle.id;
          });
        }
        logAudit(db, viewer.user.id, 'garage_vehicle_updated', 'vehicle', vehicle.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Vehicle not found' });
    }

    return res.json(getProfileGarage(readDb(), viewer.profile.id, viewer.user.id));
  });

  router.delete('/me/garage/:vehicleId', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const vehicle = db.garageVehicles.find((item) => item.id === req.params.vehicleId && item.profileId === viewer.profile.id);
        if (!vehicle) throw new Error('Vehicle not found');
        db.garageVehicles = db.garageVehicles.filter((item) => item.id !== vehicle.id);
        db.profiles.forEach((profile) => {
          if (profile.id === viewer.profile.id && profile.featuredVehicleId === vehicle.id) profile.featuredVehicleId = undefined;
        });
        logAudit(db, viewer.user.id, 'garage_vehicle_deleted', 'vehicle', vehicle.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Vehicle not found' });
    }
    return res.json({ success: true });
  });

  router.get('/me/posts', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    return res.json(getProfilePosts(readDb(), viewer.profile.id));
  });

  router.post('/me/posts', requireAuth, async (req, res) => {
    const schema = z.object({
      caption: z.string().min(1).max(500),
      mediaIds: z.array(z.string()).max(8).optional().default([]),
      pinned: z.boolean().optional().default(false),
      featured: z.boolean().optional().default(false),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid post payload' });
    const viewer = (req as any).viewer;

    mutateDb((db) => {
      const postId = createId('ppost');
      const createdAt = nowIso();
      db.profilePosts.push({ id: postId, profileId: viewer.profile.id, createdAt, updatedAt: createdAt, ...parsed.data });
      db.mediaAssets.forEach((asset) => {
        if (parsed.data.mediaIds.includes(asset.id) && asset.ownerUserId === viewer.user.id) {
          asset.ownerType = 'profile_post';
          asset.ownerId = postId;
          asset.updatedAt = nowIso();
        }
      });
      if (parsed.data.featured) {
        const profile = db.profiles.find((item) => item.id === viewer.profile.id);
        if (profile) profile.featuredPostId = postId;
      }
      logAudit(db, viewer.user.id, 'profile_post_created', 'profile_post', postId);
    });

    return res.status(201).json(getProfilePosts(readDb(), viewer.profile.id));
  });

  router.patch('/me/posts/:postId', requireAuth, async (req, res) => {
    const schema = z.object({
      caption: z.string().min(1).max(500).optional(),
      mediaIds: z.array(z.string()).max(8).optional(),
      pinned: z.boolean().optional(),
      featured: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid post update payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const post = db.profilePosts.find((item) => item.id === req.params.postId && item.profileId === viewer.profile.id);
        if (!post) throw new Error('Post not found');
        Object.assign(post, parsed.data, { updatedAt: nowIso() });
        if (parsed.data.featured) {
          const profile = db.profiles.find((item) => item.id === viewer.profile.id);
          if (profile) profile.featuredPostId = post.id;
        }
        logAudit(db, viewer.user.id, 'profile_post_updated', 'profile_post', post.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Post not found' });
    }

    return res.json(getProfilePosts(readDb(), viewer.profile.id));
  });

  router.delete('/me/posts/:postId', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    try {
      mutateDb((db) => {
        const post = db.profilePosts.find((item) => item.id === req.params.postId && item.profileId === viewer.profile.id);
        if (!post) throw new Error('Post not found');
        db.profilePosts = db.profilePosts.filter((item) => item.id !== post.id);
        const profile = db.profiles.find((item) => item.id === viewer.profile.id);
        if (profile?.featuredPostId === post.id) profile.featuredPostId = undefined;
        logAudit(db, viewer.user.id, 'profile_post_deleted', 'profile_post', post.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Post not found' });
    }
    return res.json({ success: true });
  });

  router.get('/me/links', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    return res.json(readDb().profileLinks.filter((item) => item.profileId === viewer.profile.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  });

  router.post('/me/links', requireAuth, async (req, res) => {
    const schema = z.object({
      label: z.string().min(1).max(60),
      href: z.string().url(),
      type: z.enum(['social', 'build', 'garage', 'group', 'other']).default('other'),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid link payload' });
    const viewer = (req as any).viewer;

    mutateDb((db) => {
      db.profileLinks.push({ id: createId('plink'), profileId: viewer.profile.id, createdAt: nowIso(), updatedAt: nowIso(), ...parsed.data });
      logAudit(db, viewer.user.id, 'profile_link_created', 'profile', viewer.profile.id, parsed.data.href);
    });

    return res.status(201).json(readDb().profileLinks.filter((item) => item.profileId === viewer.profile.id));
  });

  router.patch('/me/links/:linkId', requireAuth, async (req, res) => {
    const schema = z.object({
      label: z.string().min(1).max(60).optional(),
      href: z.string().url().optional(),
      type: z.enum(['social', 'build', 'garage', 'group', 'other']).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid link update payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const link = db.profileLinks.find((item) => item.id === req.params.linkId && item.profileId === viewer.profile.id);
        if (!link) throw new Error('Link not found');
        Object.assign(link, parsed.data, { updatedAt: nowIso() });
        logAudit(db, viewer.user.id, 'profile_link_updated', 'profile', viewer.profile.id, link.id);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Link not found' });
    }

    return res.json(readDb().profileLinks.filter((item) => item.profileId === viewer.profile.id));
  });

  router.delete('/me/links/:linkId', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    mutateDb((db) => {
      db.profileLinks = db.profileLinks.filter((item) => !(item.id === req.params.linkId && item.profileId === viewer.profile.id));
      logAudit(db, viewer.user.id, 'profile_link_deleted', 'profile', viewer.profile.id, req.params.linkId);
    });
    return res.json({ success: true });
  });

  router.get('/me/analytics', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    const db = readDb();
    const profile = db.profiles.find((item) => item.id === viewer.profile.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json(analyticsForProfile(db, profile));
  });

  router.patch('/me', requireAuth, async (req, res) => {
    const schema = z.object({
      displayName: z.string().min(2).max(40),
      bio: z.string().max(300).optional().default(''),
      location: z.string().max(80).optional().default(''),
      primaryCar: z.string().max(80).optional().default(''),
      avatarUrl: z.string().url().or(z.literal('')).optional().default(''),
      bannerUrl: z.string().url().or(z.literal('')).optional().default(''),
      about: z.string().max(500).optional().default(''),
      currentlyBuilding: z.string().max(120).optional().default(''),
      sceneTags: z.array(z.string().max(24)).max(10).optional().default([]),
      analyticsVisibility: z.enum(['public', 'private']).optional().default('public'),
      memberType: z.enum(['car_enthusiast', 'bike_rider', 'photographer_videographer', 'business_owner', 'car_group_owner', 'event_host', 'workshop_vendor', 'spectator_fan', 'other']).optional().default('car_enthusiast'),
      interestTags: z.array(z.string().max(32)).max(16).optional().default([]),
      preferredEventTypes: z.array(z.string().max(40)).max(16).optional().default([]),
      discoveryVisible: z.boolean().optional().default(true),
      newestMemberVisible: z.boolean().optional().default(true),
      showLocation: z.boolean().optional().default(true),
      showEventActivity: z.boolean().optional().default(true),
      showGroupAffiliations: z.boolean().optional().default(true),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid profile payload' });
    const viewer = (req as any).viewer;

    let updated = '';
    try {
      updated = mutateDb((db) => {
        const profile = db.profiles.find((item) => item.id === viewer.profile.id);
        const user = db.users.find((item) => item.id === viewer.user.id);
        if (!profile || !user) throw new Error('Profile not found');
        Object.assign(profile, parsed.data, { profileComplete: Boolean(parsed.data.bio || parsed.data.location || parsed.data.primaryCar || parsed.data.about), updatedAt: nowIso() });
        profile.slug = uniqueSlug(parsed.data.displayName, db.profiles.filter((item) => item.id !== profile.id).map((item) => item.slug));
        user.displayName = parsed.data.displayName;
        logAudit(db, viewer.user.id, 'update_profile', 'profile', profile.id);
        return profile.slug;
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Profile not found' });
    }

    const db = readDb();
    const profile = db.profiles.find((item) => item.slug === updated);
    return res.json(profile ? mapProfileDetail(db, profile, viewer.user.id) : null);
  });

  router.get('/:slug', async (req, res) => {
    const db = readDb();
    const viewerUserId = typeof req.query.viewerUserId === 'string' ? req.query.viewerUserId : undefined;
    const profile = db.profiles.find((item) => item.slug === req.params.slug);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const sessionKey = hashVisitorKey(`${viewerUserId || 'guest'}:${req.ip}:${req.headers['user-agent'] || 'unknown'}`);
    if (!viewerUserId || viewerUserId !== profile.userId) {
      mutateDb((runtime) => {
        trackAnalyticsEvent(runtime, {
          actorUserId: viewerUserId || null,
          sessionKey,
          source: typeof req.query.source === 'string' ? req.query.source : 'profile',
          eventType: 'profile_view',
          targetType: 'profile',
          targetId: profile.id,
        });
      });
    }

    return res.json(mapProfileDetail(readDb(), profile, viewerUserId));
  });

  return router;
}
