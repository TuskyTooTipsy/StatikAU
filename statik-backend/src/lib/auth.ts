import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { createId, mutateDb, nowIso, readDb, tokenHash } from './store';

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');
  const input = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(input, 'hex'));
}

function getRequestIp(req?: Request) {
  const forwarded = req?.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) return forwarded.split(',')[0].trim();
  return req?.ip || '';
}

function getRequestUserAgent(req?: Request) {
  return typeof req?.headers['user-agent'] === 'string' ? req.headers['user-agent'] : '';
}

export function createSession(userId: string, req?: Request) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = nowIso();
  mutateDb((db) => {
    db.sessions.push({
      id: createId('session'),
      userId,
      tokenHash: tokenHash(token),
      createdAt: now,
      lastSeenAt: now,
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
    });
  });
  return token;
}

export function getTokenFromRequest(req: Request) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

function isUserBlocked(user: any) {
  if (user?.isBanned) return 'Account banned';
  if (user?.suspensionEndsAt && new Date(user.suspensionEndsAt).getTime() > Date.now()) {
    return `Account suspended until ${new Date(user.suspensionEndsAt).toLocaleString()}`;
  }
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  const db = readDb();
  const session = db.sessions.find((item) => item.tokenHash === tokenHash(token));
  if (!session) return res.status(401).json({ error: 'Session expired' });

  const user = db.users.find((item) => item.id === session.userId);
  const profile = user ? db.profiles.find((item) => item.id === user.profileId) : null;

  if (!user || !profile) return res.status(401).json({ error: 'Session invalid' });
  const blocked = isUserBlocked(user);
  if (blocked) return res.status(403).json({ error: blocked });

  mutateDb((mutable) => {
    const live = mutable.sessions.find((item) => item.id === session.id);
    if (live) {
      live.lastSeenAt = nowIso();
      live.ip = getRequestIp(req);
      live.userAgent = getRequestUserAgent(req);
    }
  });

  (req as any).viewer = { user, profile };
  return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const viewer = (req as any).viewer;
    if (!viewer || viewer.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    return next();
  });
}
