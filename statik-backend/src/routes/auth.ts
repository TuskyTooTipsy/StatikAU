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
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid registration payload' });

    const { email, password, displayName } = parsed.data;
    const existing = readDb().users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: 'An account with that email already exists' });

    let result: { userId: string; foundingAdmin: boolean };
    try {
      result = mutateDb((db) => {
        if (!db.site.registrationOpen) {
          throw new Error('Registration is currently closed');
        }
        const firstUser = db.users.length === 0;
        const userId = createId('user');
        const profileId = createId('profile');
        const slug = uniqueSlug(displayName || slugify(email.split('@')[0]), db.profiles.map((item) => item.slug));
        const createdAt = nowIso();

        db.profiles.push({
          id: profileId,
          userId,
          slug,
          displayName,
          bio: '',
          location: '',
          primaryCar: '',
          avatarUrl: '',
          bannerUrl: '',
          verified: false,
          featured: false,
          promoted: false,
          about: '',
          currentlyBuilding: '',
          sceneTags: [],
          analyticsVisibility: 'public',
          createdAt,
        });

        db.users.push({
          id: userId,
          email: email.toLowerCase(),
          passwordHash: hashPassword(password),
          displayName,
          role: firstUser ? 'admin' : 'user',
          profileId,
          createdAt,
        });

        logAudit(db, userId, 'register', 'user', userId, firstUser ? 'First account auto-promoted to admin' : undefined);
        return { userId, foundingAdmin: firstUser };
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not create account' });
    }

    const token = createSession(result.userId, req);
    const db = readDb();
    return res.status(201).json({
      token,
      foundingAdmin: result.foundingAdmin,
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
