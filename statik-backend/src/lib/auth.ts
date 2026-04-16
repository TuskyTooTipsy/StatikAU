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

export function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  mutateDb((db) => {
    db.sessions.push({
      id: createId('session'),
      userId,
      tokenHash: tokenHash(token),
      createdAt: nowIso(),
    });
  });
  return token;
}

export function getTokenFromRequest(req: Request) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
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
