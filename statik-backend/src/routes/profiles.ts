import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { countMutualFriends, getFriendUserIds, logAudit, mutateDb, profileStats, readDb, uniqueSlug } from '../lib/store';

function mapProfile(db: ReturnType<typeof readDb>, profile: any, viewerUserId?: string) {
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
    return res.json(items.map((profile) => mapProfile(db, profile, viewerUserId)).slice(0, 60));
  });

  router.get('/:slug', async (req, res) => {
    const db = readDb();
    const viewerUserId = typeof req.query.viewerUserId === 'string' ? req.query.viewerUserId : undefined;
    const profile = db.profiles.find((item) => item.slug === req.params.slug);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json(mapProfile(db, profile, viewerUserId));
  });

  router.patch('/me', requireAuth, async (req, res) => {
    const schema = z.object({
      displayName: z.string().min(2).max(40),
      bio: z.string().max(300).optional().default(''),
      location: z.string().max(80).optional().default(''),
      primaryCar: z.string().max(80).optional().default(''),
      avatarUrl: z.string().url().or(z.literal('')).optional().default(''),
      bannerUrl: z.string().url().or(z.literal('')).optional().default(''),
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
        profile.displayName = parsed.data.displayName;
        profile.bio = parsed.data.bio;
        profile.location = parsed.data.location;
        profile.primaryCar = parsed.data.primaryCar;
        profile.avatarUrl = parsed.data.avatarUrl;
        profile.bannerUrl = parsed.data.bannerUrl;
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
    return res.json(profile ? mapProfile(db, profile, viewer.user.id) : null);
  });

  return router;
}
