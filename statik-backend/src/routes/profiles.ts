import { Router } from 'express';
import { platformProfiles } from '../data/platform';

export default function profilesRouter() {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(platformProfiles);
  });

  router.get('/:slug', async (req, res) => {
    const profile = platformProfiles.find((item) => item.slug === req.params.slug);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json(profile);
  });

  return router;
}
