import { Router } from 'express';
import { z } from 'zod';

export default function newsletterRouter() {
  const router = Router();

  router.post('/', async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    return res.json({ success: true, mode: 'fallback' });
  });

  return router;
}
