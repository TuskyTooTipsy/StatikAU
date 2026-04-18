import { Router } from 'express';
import { z } from 'zod';
import { getTokenFromRequest } from '../lib/auth';
import { getUserByToken, hashVisitorKey, readDb, trackAnalyticsEvent } from '../lib/store';
import { mutateDb } from '../lib/store';

export default function analyticsRouter() {
  const router = Router();

  router.post('/track', async (req, res) => {
    const schema = z.object({
      eventType: z.enum(['vehicle_view', 'profile_post_view', 'community_post_view', 'event_click', 'garage_view']),
      targetType: z.enum(['vehicle', 'profile_post', 'community_post', 'event', 'profile']),
      targetId: z.string().min(1),
      source: z.string().max(50).optional().default('direct'),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid analytics payload' });

    const viewer = getUserByToken(getTokenFromRequest(req));
    const sessionKey = hashVisitorKey(`${viewer?.user.id || 'guest'}:${req.ip}:${req.headers['user-agent'] || 'unknown'}`);
    mutateDb((db) => {
      trackAnalyticsEvent(db, {
        actorUserId: viewer?.user.id || null,
        sessionKey,
        source: parsed.data.source,
        eventType: parsed.data.eventType,
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
      });
    });

    return res.json({ success: true });
  });

  return router;
}
