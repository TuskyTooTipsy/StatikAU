import { Router } from 'express';
import { readDb } from '../lib/store';

export default function searchRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    if (!q) return res.json([]);

    const db = readDb();
    const results = [
      ...db.events.filter((event) => event.approvalStatus === 'approved' && `${event.name} ${event.location} ${event.description}`.toLowerCase().includes(q)).map((event) => ({ id: event.id, type: 'event', title: event.name, description: event.location, href: `/events/${event.slug}` })),
      ...db.profiles.filter((profile) => `${profile.displayName} ${profile.bio} ${profile.location}`.toLowerCase().includes(q)).map((profile) => ({ id: profile.id, type: 'profile', title: profile.displayName, description: profile.bio || 'STATIK member', href: `/profiles/${profile.slug}` })),
      ...db.communities.filter((community) => `${community.name} ${community.description}`.toLowerCase().includes(q)).map((community) => ({ id: community.id, type: 'community', title: community.name, description: community.description, href: `/members/communities/${community.slug}` })),
    ].slice(0, 20);

    return res.json(results);
  });

  return router;
}
