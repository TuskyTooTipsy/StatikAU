import { Router } from 'express';
import { platformEvents, platformPosts, platformProfiles, platformSubmissions } from '../data/platform';

export default function searchRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const index = [
      ...platformEvents.map((item) => ({ type: 'event', title: item.name, description: item.description, href: `/events/${item.slug}` })),
      ...platformPosts.map((item) => ({ type: 'post', title: item.title, description: item.excerpt, href: '/updates' })),
      ...platformProfiles.map((item) => ({ type: 'profile', title: item.displayName, description: item.primaryCar, href: `/u/${item.slug}` })),
      ...platformSubmissions.map((item) => ({ type: 'submission', title: item.title, description: item.status, href: '/account/submissions' })),
    ];

    if (!q) return res.json(index);
    return res.json(index.filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(q)));
  });

  return router;
}
