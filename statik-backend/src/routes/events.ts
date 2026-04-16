import { Router } from 'express';
import { z } from 'zod';
import { platformEvents } from '../data/platform';

export default function eventsRouter() {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(platformEvents);
  });

  router.get('/:slug', async (req, res) => {
    const event = platformEvents.find((item) => item.slug === req.params.slug);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    return res.json(event);
  });

  router.post('/submit', async (req, res) => {
    const schema = z.object({
      title: z.string().min(2),
      location: z.string().min(2),
      description: z.string().min(10),
      email: z.string().email(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid submission payload' });

    return res.status(201).json({
      success: true,
      status: 'pending',
      moderationQueue: 'event-submissions',
      payload: parsed.data,
    });
  });

  return router;
}
