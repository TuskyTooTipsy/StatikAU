import { Router } from 'express';
import { z } from 'zod';
import { platformSubmissions } from '../data/platform';

export default function submissionsRouter() {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(platformSubmissions);
  });

  router.post('/', async (req, res) => {
    const schema = z.object({
      title: z.string().min(2),
      type: z.string().min(2),
      details: z.string().min(10),
      email: z.string().email(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid submission payload' });

    return res.status(201).json({ success: true, status: 'pending', payload: parsed.data });
  });

  return router;
}
