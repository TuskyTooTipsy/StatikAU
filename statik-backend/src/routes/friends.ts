import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { createId, getFriendUserIds, logAudit, mutateDb, nowIso, profileStats, readDb } from '../lib/store';

function mapFriendCard(db: ReturnType<typeof readDb>, userId: string) {
  const profile = db.profiles.find((item) => item.userId === userId);
  if (!profile) return null;
  return {
    ...profile,
    stats: profileStats(db, profile.id),
  };
}

export default function friendsRouter() {
  const router = Router();

  router.get('/', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    const db = readDb();
    const friends = getFriendUserIds(db, viewer.user.id).map((userId) => mapFriendCard(db, userId)).filter(Boolean);
    const incoming = db.friendRequests
      .filter((request) => request.toUserId === viewer.user.id && request.status === 'pending')
      .map((request) => ({ request, profile: mapFriendCard(db, request.fromUserId) }));
    const outgoing = db.friendRequests
      .filter((request) => request.fromUserId === viewer.user.id && request.status === 'pending')
      .map((request) => ({ request, profile: mapFriendCard(db, request.toUserId) }));
    return res.json({ friends, incoming, outgoing });
  });

  router.post('/requests', requireAuth, async (req, res) => {
    const schema = z.object({ targetUserId: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid friend request payload' });
    const viewer = (req as any).viewer;
    if (viewer.user.id === parsed.data.targetUserId) return res.status(400).json({ error: 'You cannot friend yourself' });

    try {
      mutateDb((db) => {
        const target = db.users.find((item) => item.id === parsed.data.targetUserId);
        if (!target) throw new Error('Target user not found');
        const existingFriend = getFriendUserIds(db, viewer.user.id).includes(parsed.data.targetUserId);
        if (existingFriend) throw new Error('Already friends');
        const existingRequest = db.friendRequests.find((item) => (
          (item.fromUserId === viewer.user.id && item.toUserId === parsed.data.targetUserId) ||
          (item.fromUserId === parsed.data.targetUserId && item.toUserId === viewer.user.id)
        ) && item.status === 'pending');
        if (existingRequest) throw new Error('Friend request already pending');

        db.friendRequests.push({
          id: createId('friendreq'),
          fromUserId: viewer.user.id,
          toUserId: parsed.data.targetUserId,
          status: 'pending',
          createdAt: nowIso(),
          updatedAt: nowIso(),
        });
        logAudit(db, viewer.user.id, 'friend_request_sent', 'user', parsed.data.targetUserId);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not send friend request' });
    }

    return res.status(201).json({ success: true });
  });

  router.post('/requests/:id/respond', requireAuth, async (req, res) => {
    const schema = z.object({ action: z.enum(['accept', 'reject']) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid response payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const request = db.friendRequests.find((item) => item.id === req.params.id && item.toUserId === viewer.user.id && item.status === 'pending');
        if (!request) throw new Error('Friend request not found');
        request.status = parsed.data.action === 'accept' ? 'accepted' : 'rejected';
        request.updatedAt = nowIso();
        logAudit(db, viewer.user.id, parsed.data.action === 'accept' ? 'friend_request_accepted' : 'friend_request_rejected', 'user', request.fromUserId);
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Friend request not found' });
    }

    return res.json({ success: true });
  });

  router.delete('/:userId', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    mutateDb((db) => {
      db.friendRequests = db.friendRequests.filter((item) => !(
        item.status === 'accepted' && (
          (item.fromUserId === viewer.user.id && item.toUserId === req.params.userId) ||
          (item.toUserId === viewer.user.id && item.fromUserId === req.params.userId)
        )
      ));
      logAudit(db, viewer.user.id, 'friend_removed', 'user', req.params.userId);
    });
    return res.json({ success: true });
  });

  return router;
}
