import { Router } from 'express';

export default function updatesRouter() {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json([]);
  });

  return router;
}
