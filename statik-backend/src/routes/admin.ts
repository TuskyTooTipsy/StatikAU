import { Router } from 'express';
import { platformEvents, platformPosts, platformProfiles, platformSubmissions, platformSummary } from '../data/platform';

export default function adminRouter() {
  const router = Router();

  router.get('/overview', async (_req, res) => {
    res.json({
      ...platformSummary,
      counts: {
        events: platformEvents.length,
        posts: platformPosts.length,
        profiles: platformProfiles.length,
        submissions: platformSubmissions.length,
      },
    });
  });

  return router;
}
