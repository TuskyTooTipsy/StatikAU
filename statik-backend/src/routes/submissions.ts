import { Router } from 'express';

export default function submissionsRouter() {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json([]);
  });

  return router;
}
