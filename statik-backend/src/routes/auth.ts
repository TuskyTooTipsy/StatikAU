import { Router } from 'express';
import { z } from 'zod';
import { createSession, getTokenFromRequest, hashPassword, requireAuth, verifyPassword } from '../lib/auth';
import { createId, logAudit, mutateDb, nowIso, readDb, slugify, tokenHash, uniqueSlug } from '../lib/store';

function sanitizeAuthPayload(db: ReturnType<typeof readDb>, userId: string) {
  const user = db.users.find((item) => item.id === userId);
  if (!user) return null;
  const profile = db.profiles.find((item) => item.id === user.profileId);
  if (!profile) return null;
  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
    },
    profile,
    site: db.site,
  };
}

export default function authRouter() {
  const router = Router();

  router.post('/register', async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      displayName: z.string().min(2).max(40),
      username: z.string().min(3).max(40).optional(),
      termsAccepted: z.boolean().optional().default(false),
      location: z.string().max(80).optional().default(''),
      memberType: z.enum(['car_enthusiast', 'bike_rider', 'photographer_videographer', 'business_owner', 'car_group_owner', 'event_host', 'workshop_vendor', 'spectator_fan', 'other']).optional().default('car_enthusiast'),
      bio: z.string().max(300).optional().default(''),
      interestTags: z.array(z.string().max(32)).max(16).optional().default([]),
      preferredEventTypes: z.array(z.string().max(40)).max(16).optional().default([]),
      discoveryVisible: z.boolean().optional().default(true),
      newestMemberVisible: z.boolean().optional().default(true),
      firstVehicle: z.object({
        vehicleType: z.enum(['car', 'bike', 'truck', 'other']).optional().default('car'),
        year: z.string().max(10).optional().default(''),
        make: z.string().max(80),
        model: z.string().max(100),
        trim: z.string().max(80).optional().default(''),
        specialEdition: z.string().max(120).optional().default(''),
        stage: z.string().max(80).optional().default(''),
      }).optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid registration payload' });

    const { email, password, displayName } = parsed.data;
    const existing = readDb().users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'An account with that email already exists' });

    let result: { userId: string };
    try {
      result = mutateDb((db) => {
        if (!db.site.registrationOpen) {
          throw new Error('Registration is currently closed');
        }
        const userId = createId('user');
        const profileId = createId('profile');
        const slug = uniqueSlug(parsed.data.username || displayName || slugify(email.split('@')[0]), db.profiles.map((item) => item.slug));
        const createdAt = nowIso();

        db.profiles.push({
          id: profileId,
          userId,
          slug,
          displayName,
          bio: parsed.data.bio || '',
          location: parsed.data.location || '',
          primaryCar: parsed.data.firstVehicle ? [parsed.data.firstVehicle.year, parsed.data.firstVehicle.make, parsed.data.firstVehicle.model].filter(Boolean).join(' ') : '',
          avatarUrl: '',
          bannerUrl: '',
          verified: false,
          featured: false,
          promoted: false,
          about: '',
          currentlyBuilding: '',
          sceneTags: [],
          analyticsVisibility: 'public',
          memberType: parsed.data.memberType,
          interestTags: parsed.data.interestTags,
          preferredEventTypes: parsed.data.preferredEventTypes,
          discoveryVisible: parsed.data.discoveryVisible,
          newestMemberVisible: parsed.data.newestMemberVisible,
          profileComplete: Boolean(parsed.data.bio || parsed.data.location || parsed.data.firstVehicle),
          showLocation: true,
          showEventActivity: true,
          showGroupAffiliations: true,
          createdAt,
          updatedAt: createdAt,
        });

        db.users.push({
          id: userId,
          email: email.toLowerCase(),
          passwordHash: hashPassword(password),
          displayName,
          role: 'user',
          profileId,
          createdAt,
          termsAcceptedAt: parsed.data.termsAccepted ? createdAt : null,
          lastOnboardingStep: parsed.data.firstVehicle ? 'first_vehicle' : 'profile_details',
          onboardingCompleted: Boolean(parsed.data.bio || parsed.data.location || parsed.data.firstVehicle),
        });

        if (parsed.data.firstVehicle?.make && parsed.data.firstVehicle?.model) {
          db.garageVehicles.push({
            id: createId('vehicle'),
            profileId,
            vehicleType: parsed.data.firstVehicle.vehicleType || 'car',
            year: parsed.data.firstVehicle.year || '',
            make: parsed.data.firstVehicle.make,
            model: parsed.data.firstVehicle.model,
            trim: parsed.data.firstVehicle.trim || '',
            generation: '',
            specialEdition: parsed.data.firstVehicle.specialEdition || '',
            bodyStyle: '',
            drivetrain: '',
            engineFamily: '',
            transmission: '',
            nickname: '',
            stage: parsed.data.firstVehicle.stage || '',
            ownershipStatus: '',
            statusTags: [],
            purposeTags: [],
            setupTags: [],
            visibility: 'public',
            description: '',
            modTags: [],
            mediaIds: [],
            linkedCommunityIds: [],
            timeline: [],
            featured: true,
            createdAt,
            updatedAt: createdAt,
          });
        }

        logAudit(db, userId, 'register', 'user', userId);
        return { userId };
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not create account' });
    }

    const token = createSession(result.userId, req);
    const db = readDb();
    return res.status(201).json({
      token,
      ...sanitizeAuthPayload(db, result.userId),
    });
  });

  router.post('/login', async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid login payload' });

    const db = readDb();
    const user = db.users.find((item) => item.email.toLowerCase() === parsed.data.email.toLowerCase());
    if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.isBanned) return res.status(403).json({ error: 'Account banned' });
    if (user.suspensionEndsAt && new Date(user.suspensionEndsAt).getTime() > Date.now()) return res.status(403).json({ error: `Account suspended until ${new Date(user.suspensionEndsAt).toLocaleString()}` });

    const token = createSession(user.id, req);
    return res.json({ token, ...sanitizeAuthPayload(readDb(), user.id) });
  });

  router.get('/me', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    return res.json(sanitizeAuthPayload(readDb(), viewer.user.id));
  });

  router.post('/logout', requireAuth, async (req, res) => {
    const token = getTokenFromRequest(req);
    mutateDb((db) => {
      db.sessions = db.sessions.filter((item) => item.tokenHash !== tokenHash(token || ''));
      logAudit(db, (req as any).viewer.user.id, 'logout', 'session', 'current');
    });
    return res.json({ success: true });
  });

  return router;
}
