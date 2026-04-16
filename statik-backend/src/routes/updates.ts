import { Router } from 'express';
import { platformPosts } from '../data/platform';

export default function updatesRouter() {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(platformPosts);
  });

  return router;
}
