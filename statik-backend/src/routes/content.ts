import { Router } from 'express';
import { z } from 'zod';
import { getPublicAppUrl } from '../lib/env';
import { createId, findOrCreateShortLink, getPublishedContent, logAudit, mapContentPublic, mutateDb, nowIso, readDb, slugify, uniqueSlug } from '../lib/store';

function parseList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 20);
  return [];
}

export default function contentRouter() {
  const router = Router();

  router.get('/:type', async (req, res) => {
    const type = req.params.type === 'news' ? 'news' : req.params.type === 'articles' ? 'article' : null;
    if (!type) return res.status(404).json({ error: 'Content type not found' });
    const db = readDb();
    const enabled = type === 'article' ? db.site.articlesEnabled !== false : db.site.newsEnabled !== false;
    if (!enabled) return res.json({ items: [], categories: [], tags: [] });
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.toLowerCase() : '';
    const tag = typeof req.query.tag === 'string' ? req.query.tag.toLowerCase() : '';
    const items = getPublishedContent(db, type)
      .filter((item) => !q || [item.title, item.excerpt, item.body, item.category, item.tags.join(' ')].join(' ').toLowerCase().includes(q))
      .filter((item) => !category || item.category.toLowerCase() === category)
      .filter((item) => !tag || item.tags.some((value) => value.toLowerCase() === tag))
      .map((item) => {
        const mapped = mapContentPublic(db, item);
        return {
          ...mapped,
          canonicalShareUrl: `${getPublicAppUrl()}/${type === 'news' ? 'news' : 'articles'}/${item.slug}`,
        };
      });
    return res.json({ items, categories: Array.from(new Set(getPublishedContent(db, type).map((item) => item.category).filter(Boolean))), tags: Array.from(new Set(getPublishedContent(db, type).flatMap((item) => item.tags))) });
  });

  router.get('/:type/:slug', async (req, res) => {
    const type = req.params.type === 'news' ? 'news' : req.params.type === 'articles' ? 'article' : null;
    if (!type) return res.status(404).json({ error: 'Content type not found' });
    const db = readDb();
    const enabled = type === 'article' ? db.site.articlesEnabled !== false : db.site.newsEnabled !== false;
    if (!enabled) return res.status(404).json({ error: 'Content section disabled' });
    const item = getPublishedContent(db, type).find((entry) => entry.slug === req.params.slug);
    if (!item) return res.status(404).json({ error: 'Content not found' });
    const publicItem = mapContentPublic(db, item);
    const short = mutateDb((runtime) => findOrCreateShortLink(runtime, {
      targetType: type === 'news' ? 'news' : 'article',
      targetId: item.id,
      ownerUserId: item.authorUserId || runtime.users.find((user) => user.role === 'admin')?.id || 'system',
      preferredSlug: item.slug,
    }));
    return res.json({
      ...publicItem,
      canonicalShareUrl: `${getPublicAppUrl()}/${type === 'news' ? 'news' : 'articles'}/${item.slug}`,
      shortLink: { ...short, shortUrl: `${getPublicAppUrl()}/s/${short.slug}`, qrUrl: `${getPublicAppUrl()}/s/${short.slug}?src=qr` },
    });
  });

  return router;
}

export const contentPayloadSchema = z.object({
  type: z.enum(['article', 'news']),
  title: z.string().min(3).max(160),
  slug: z.string().max(100).optional(),
  excerpt: z.string().max(500).optional().default(''),
  body: z.string().max(20000).optional().default(''),
  heroMediaId: z.string().optional().or(z.literal('')),
  galleryMediaIds: z.array(z.string()).max(20).optional().default([]),
  category: z.string().max(80).optional().default('General'),
  tags: z.array(z.string()).max(20).optional().default([]),
  authorDisplayName: z.string().max(80).optional().default(''),
  status: z.enum(['draft', 'pending', 'published', 'scheduled', 'archived']).optional().default('draft'),
  publishedAt: z.string().optional().or(z.literal('')),
  scheduledFor: z.string().optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
  sponsored: z.boolean().optional().default(false),
  sponsorBusinessId: z.string().optional().or(z.literal('')),
  relatedEventIds: z.array(z.string()).max(12).optional().default([]),
  relatedBusinessIds: z.array(z.string()).max(12).optional().default([]),
  relatedProfileIds: z.array(z.string()).max(12).optional().default([]),
  relatedCommunityIds: z.array(z.string()).max(12).optional().default([]),
  aiAssisted: z.boolean().optional().default(false),
  metaTitle: z.string().max(160).optional().default(''),
  metaDescription: z.string().max(240).optional().default(''),
  adminNote: z.string().max(500).optional().default(''),
});

export function upsertContentFromAdmin(req: any, res: any, contentId?: string) {
  const parsed = contentPayloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid content payload' });
  const viewer = req.viewer;
  let savedId = contentId || '';
  try {
    mutateDb((db) => {
      const now = nowIso();
      let item = contentId ? db.contentItems.find((entry) => entry.id === contentId) : null;
      if (!item) {
        savedId = createId('content');
        item = {
          id: savedId,
          type: parsed.data.type,
          slug: uniqueSlug(parsed.data.slug || parsed.data.title, db.contentItems.map((entry) => entry.slug)),
          title: parsed.data.title,
          excerpt: parsed.data.excerpt,
          body: parsed.data.body,
          heroMediaId: parsed.data.heroMediaId || undefined,
          galleryMediaIds: parsed.data.galleryMediaIds,
          category: parsed.data.category,
          tags: parseList(parsed.data.tags),
          authorUserId: viewer.user.id,
          authorDisplayName: parsed.data.authorDisplayName,
          status: parsed.data.status,
          publishedAt: parsed.data.status === 'published' ? (parsed.data.publishedAt || now) : parsed.data.publishedAt || undefined,
          scheduledFor: parsed.data.scheduledFor || undefined,
          createdAt: now,
          updatedAt: now,
          featured: parsed.data.featured,
          sponsored: parsed.data.sponsored,
          sponsorBusinessId: parsed.data.sponsorBusinessId || undefined,
          relatedEventIds: parsed.data.relatedEventIds,
          relatedBusinessIds: parsed.data.relatedBusinessIds,
          relatedProfileIds: parsed.data.relatedProfileIds,
          relatedCommunityIds: parsed.data.relatedCommunityIds,
          aiAssisted: parsed.data.aiAssisted,
          metaTitle: parsed.data.metaTitle,
          metaDescription: parsed.data.metaDescription,
          adminNotes: parsed.data.adminNote ? [parsed.data.adminNote] : [],
        };
        db.contentItems.push(item);
      } else {
        db.contentRevisions.unshift({ id: createId('rev'), contentId: item.id, actorUserId: viewer.user.id, createdAt: now, snapshot: { ...item }, note: 'Before admin edit' });
        Object.assign(item, parsed.data, {
          slug: parsed.data.slug ? uniqueSlug(parsed.data.slug, db.contentItems.filter((entry) => entry.id !== item!.id).map((entry) => entry.slug)) : item.slug,
          heroMediaId: parsed.data.heroMediaId || undefined,
          sponsorBusinessId: parsed.data.sponsorBusinessId || undefined,
          publishedAt: parsed.data.status === 'published' ? (parsed.data.publishedAt || item.publishedAt || now) : parsed.data.publishedAt || item.publishedAt,
          scheduledFor: parsed.data.scheduledFor || undefined,
          updatedAt: now,
          adminNotes: parsed.data.adminNote ? [...(item.adminNotes || []), parsed.data.adminNote].slice(-20) : item.adminNotes,
        });
        savedId = item.id;
      }
      [...(item.galleryMediaIds || []), item.heroMediaId].filter(Boolean).forEach((mediaId) => {
        const asset = db.mediaAssets.find((media) => media.id === mediaId && media.ownerUserId === viewer.user.id);
        if (asset) {
          asset.ownerType = 'content';
          asset.ownerId = item!.id;
          asset.updatedAt = now;
        }
      });
      logAudit(db, viewer.user.id, contentId ? 'content_updated' : 'content_created', item.type, item.id, JSON.stringify({ status: item.status, title: item.title }));
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Could not save content' });
  }
  const db = readDb();
  const saved = db.contentItems.find((item) => item.id === savedId);
  return res.status(contentId ? 200 : 201).json(saved ? mapContentPublic(db, saved) : null);
}
