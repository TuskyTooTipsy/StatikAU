import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { createId, logAudit, mutateDb, nowIso, readDb } from '../lib/store';

export default function reportsRouter() {
  const router = Router();

  router.post('/', requireAuth, async (req, res) => {
    const schema = z.object({
      targetType: z.enum(['profile', 'community', 'profile_post', 'community_post', 'media']),
      targetId: z.string().min(1),
      reason: z.string().min(4).max(240),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid report payload' });
    const viewer = (req as any).viewer;
    const db = readDb();
    const exists =
      (parsed.data.targetType === 'profile' && db.profiles.some((item) => item.id === parsed.data.targetId)) ||
      (parsed.data.targetType === 'community' && db.communities.some((item) => item.id === parsed.data.targetId)) ||
      (parsed.data.targetType === 'profile_post' && db.profilePosts.some((item) => item.id === parsed.data.targetId)) ||
      (parsed.data.targetType === 'community_post' && db.communityPosts.some((item) => item.id === parsed.data.targetId)) ||
      (parsed.data.targetType === 'media' && db.mediaAssets.some((item) => item.id === parsed.data.targetId));
    if (!exists) return res.status(404).json({ error: 'Target not found' });

    mutateDb((runtime) => {
      runtime.reports.unshift({
        id: createId('report'),
        reporterUserId: viewer.user.id,
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
        reason: parsed.data.reason,
        status: 'open',
        createdAt: nowIso(),
      });
      logAudit(runtime, viewer.user.id, 'report_created', parsed.data.targetType, parsed.data.targetId, parsed.data.reason);
    });

    return res.status(201).json({ success: true });
  });

  return router;
}
