import { Router } from 'express';
import { z } from 'zod';
import { getPublicAppUrl } from '../lib/env';
import { createId, findOrCreateShortLink, logAudit, mapBusinessPublic, mutateDb, nowIso, readDb, slugify, uniqueSlug } from '../lib/store';
import { requireAuth } from '../lib/auth';

export const businessCategories = [
  'mechanic', 'performance tuning', 'dyno tuning', 'detailing', 'wraps/vinyl', 'paint/bodywork', 'panel beating', 'wheels/tyres', 'suspension', 'exhaust', 'fabrication', 'motorsport prep', 'parts supplier', '4x4 accessories', 'audio/electrical', 'tinting', 'photographers', 'videographers', 'apparel/merch', 'cafes/food trucks', 'transport/towing', 'insurance/finance', 'training/driver coaching', 'track/race services', 'event organizers', 'clubs/groups', 'other',
];

export const businessPayloadSchema = z.object({
  businessName: z.string().min(2).max(140),
  slug: z.string().max(100).optional(),
  ownerUserId: z.string().optional().nullable(),
  status: z.enum(['draft', 'pending', 'approved', 'rejected', 'suspended', 'archived']).optional().default('pending'),
  trusted: z.boolean().optional().default(false),
  sponsored: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  featuredUntil: z.string().optional().nullable(),
  sponsoredUntil: z.string().optional().nullable(),
  category: z.string().max(80).optional().default('other'),
  subcategories: z.array(z.string()).max(20).optional().default([]),
  description: z.string().max(4000).optional().default(''),
  services: z.array(z.string()).max(30).optional().default([]),
  specialties: z.array(z.string()).max(30).optional().default([]),
  region: z.string().max(120).optional().default(''),
  address: z.string().max(180).optional().default(''),
  locationDetails: z.any().optional().nullable(),
  phone: z.string().max(60).optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  website: z.string().url().optional().or(z.literal('')).default(''),
  socialLinks: z.array(z.string()).max(10).optional().default([]),
  logoMediaId: z.string().optional().or(z.literal('')),
  bannerMediaId: z.string().optional().or(z.literal('')),
  galleryMediaIds: z.array(z.string()).max(20).optional().default([]),
  openingHours: z.string().max(1000).optional().default(''),
  offers: z.array(z.string()).max(12).optional().default([]),
  linkedEventIds: z.array(z.string()).max(12).optional().default([]),
  linkedArticleIds: z.array(z.string()).max(12).optional().default([]),
  linkedNewsIds: z.array(z.string()).max(12).optional().default([]),
  linkedCommunityIds: z.array(z.string()).max(12).optional().default([]),
  adminNote: z.string().max(500).optional().default(''),
});

export default function businessesRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const db = readDb();
    if (db.site.businessDirectoryEnabled === false) return res.json({ items: [], categories: businessCategories, regions: [] });
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.toLowerCase() : '';
    const region = typeof req.query.region === 'string' ? req.query.region.toLowerCase() : '';
    const items = db.businessListings
      .filter((item) => item.status === 'approved')
      .filter((item) => !q || [item.businessName, item.description, item.category, item.subcategories.join(' '), item.services.join(' '), item.specialties.join(' ')].join(' ').toLowerCase().includes(q))
      .filter((item) => !category || item.category.toLowerCase() === category || item.subcategories.some((sub) => sub.toLowerCase() === category))
      .filter((item) => !region || [item.region, item.address].join(' ').toLowerCase().includes(region))
      .sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || Number(b.featured) - Number(a.featured) || Number(b.trusted) - Number(a.trusted) || b.updatedAt.localeCompare(a.updatedAt))
      .map((item) => mapBusinessPublic(db, item));
    return res.json({ items, categories: businessCategories, regions: Array.from(new Set(db.businessListings.filter((item) => item.status === 'approved').map((item) => item.region).filter(Boolean))) });
  });

  router.get('/:slug', async (req, res) => {
    const db = readDb();
    if (db.site.businessDirectoryEnabled === false) return res.status(404).json({ error: 'Business directory disabled' });
    const item = db.businessListings.find((entry) => entry.slug === req.params.slug && entry.status === 'approved');
    if (!item) return res.status(404).json({ error: 'Business not found' });
    const short = mutateDb((runtime) => findOrCreateShortLink(runtime, {
      targetType: 'business',
      targetId: item.id,
      ownerUserId: item.ownerUserId || runtime.users.find((user) => user.role === 'admin')?.id || 'system',
      preferredSlug: item.slug,
    }));
    return res.json({ ...mapBusinessPublic(db, item), canonicalShareUrl: `${getPublicAppUrl()}/businesses/${item.slug}`, shortLink: { ...short, shortUrl: `${getPublicAppUrl()}/s/${short.slug}`, qrUrl: `${getPublicAppUrl()}/s/${short.slug}?src=qr` } });
  });

  router.post('/submit', requireAuth, async (req, res) => {
    const parsed = businessPayloadSchema.omit({ status: true, trusted: true, sponsored: true, featured: true, ownerUserId: true }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid business submission payload' });
    const viewer = (req as any).viewer;
    let savedId = '';
    mutateDb((db) => {
      const now = nowIso();
      savedId = createId('business');
      const item = {
        id: savedId,
        slug: uniqueSlug(parsed.data.slug || parsed.data.businessName, db.businessListings.map((entry) => entry.slug)),
        ownerUserId: viewer.user.id,
        status: 'pending' as const,
        trusted: false,
        sponsored: false,
        featured: false,
        contactCount: 0,
        createdAt: now,
        updatedAt: now,
        adminNotes: parsed.data.adminNote ? [parsed.data.adminNote] : [],
        ...parsed.data,
        logoMediaId: parsed.data.logoMediaId || undefined,
        bannerMediaId: parsed.data.bannerMediaId || undefined,
      };
      db.businessListings.push(item);
      logAudit(db, viewer.user.id, 'business_submitted', 'business', savedId, parsed.data.businessName);
    });
    return res.status(202).json({ success: true, businessId: savedId });
  });

  return router;
}

export function upsertBusinessFromAdmin(req: any, res: any, businessId?: string) {
  const parsed = businessPayloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid business payload' });
  const viewer = req.viewer;
  let savedId = businessId || '';
  try {
    mutateDb((db) => {
      const now = nowIso();
      let item = businessId ? db.businessListings.find((entry) => entry.id === businessId) : null;
      if (!item) {
        savedId = createId('business');
        item = {
          id: savedId,
          slug: uniqueSlug(parsed.data.slug || parsed.data.businessName, db.businessListings.map((entry) => entry.slug)),
          contactCount: 0,
          createdAt: now,
          updatedAt: now,
          approvedAt: parsed.data.status === 'approved' ? now : undefined,
          adminNotes: parsed.data.adminNote ? [parsed.data.adminNote] : [],
          ...parsed.data,
          logoMediaId: parsed.data.logoMediaId || undefined,
          bannerMediaId: parsed.data.bannerMediaId || undefined,
        };
        db.businessListings.push(item);
      } else {
        Object.assign(item, parsed.data, {
          slug: parsed.data.slug ? uniqueSlug(parsed.data.slug, db.businessListings.filter((entry) => entry.id !== item!.id).map((entry) => entry.slug)) : item.slug,
          logoMediaId: parsed.data.logoMediaId || undefined,
          bannerMediaId: parsed.data.bannerMediaId || undefined,
          approvedAt: parsed.data.status === 'approved' ? (item.approvedAt || now) : item.approvedAt,
          adminNotes: parsed.data.adminNote ? [...(item.adminNotes || []), parsed.data.adminNote].slice(-20) : item.adminNotes,
          updatedAt: now,
        });
        savedId = item.id;
      }
      [item.logoMediaId, item.bannerMediaId, ...(item.galleryMediaIds || [])].filter(Boolean).forEach((mediaId) => {
        const asset = db.mediaAssets.find((media) => media.id === mediaId && (media.ownerUserId === viewer.user.id || viewer.user.role === 'admin'));
        if (asset) {
          asset.ownerType = 'business';
          asset.ownerId = item!.id;
          asset.updatedAt = now;
        }
      });
      logAudit(db, viewer.user.id, businessId ? 'business_updated' : 'business_created', 'business', item.id, JSON.stringify({ status: item.status, trusted: item.trusted, sponsored: item.sponsored }));
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Could not save business' });
  }
  const db = readDb();
  const saved = db.businessListings.find((item) => item.id === savedId);
  return res.status(businessId ? 200 : 201).json(saved ? mapBusinessPublic(db, saved) : null);
}
