import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { getPublicAppUrl } from '../lib/env';
import { findOrCreateShortLink, getProfileGarage, getShortLinkBySlug, hashVisitorKey, logAudit, mutateDb, nowIso, readDb, slugify, trackAnalyticsEvent, uniqueSlug } from '../lib/store';

function resolveTargetHref(db: ReturnType<typeof readDb>, targetType: string, targetId: string) {
  if (targetType === 'profile') {
    const profile = db.profiles.find((item) => item.id === targetId);
    return profile ? `/profiles/${profile.slug}` : null;
  }
  if (targetType === 'community') {
    const community = db.communities.find((item) => item.id === targetId);
    return community ? `/members/communities/${community.slug}` : null;
  }
  if (targetType === 'event') {
    const event = db.events.find((item) => item.id === targetId);
    return event ? `/events/${event.slug}` : null;
  }
  if (targetType === 'vehicle') {
    const vehicle = db.garageVehicles.find((item) => item.id === targetId);
    const profile = vehicle ? db.profiles.find((item) => item.id === vehicle.profileId) : null;
    return profile && vehicle ? `/profiles/${profile.slug}?vehicle=${vehicle.id}` : null;
  }
  if (targetType === 'article' || targetType === 'news') {
    const content = db.contentItems.find((item) => item.id === targetId && item.status === 'published');
    return content ? `/${content.type === 'news' ? 'news' : 'articles'}/${content.slug}` : null;
  }
  if (targetType === 'business') {
    const business = db.businessListings.find((item) => item.id === targetId && item.status === 'approved');
    return business ? `/businesses/${business.slug}` : null;
  }
  return null;
}

export function redirectRouter() {
  const router = Router();

  router.get('/s/:slug', async (req, res) => {
    const db = readDb();
    const link = getShortLinkBySlug(db, req.params.slug);
    if (!link) return res.status(404).json({ error: 'Short link not found' });
    const href = resolveTargetHref(db, link.targetType, link.targetId);
    if (!href) return res.status(404).json({ error: 'Target no longer exists' });

    const sessionKey = hashVisitorKey(`${req.ip}:${req.headers['user-agent'] || 'unknown'}:${req.query.src === 'qr' ? 'qr' : 'shortlink'}`);

    mutateDb((runtime) => {
      const target = runtime.shortLinks.find((item) => item.id === link.id);
      if (!target) return;
      const isQr = req.query.src === 'qr';
      target.clickCount += 1;
      if (isQr) target.qrScanCount += 1;
      target.updatedAt = nowIso();
      trackAnalyticsEvent(runtime, {
        actorUserId: null,
        sessionKey,
        source: isQr ? 'qr' : 'shortlink',
        eventType: isQr ? 'qr_scan' : 'shortlink_click',
        targetType: link.targetType,
        targetId: link.targetId,
      });
    });

    return res.redirect(302, href);
  });

  return router;
}

export default function linksRouter() {
  const router = Router();

  router.get('/me', requireAuth, async (req, res) => {
    const viewer = (req as any).viewer;
    const db = readDb();
    const vehicles = getProfileGarage(db, viewer.profile.id, viewer.user.id);
    const communities = db.communities.filter((community) => community.ownerUserId === viewer.user.id || community.adminUserIds.includes(viewer.user.id));
    const events = db.events.filter((event) => event.createdByUserId === viewer.user.id || communities.some((community) => community.id === event.hostCommunityId));

    const ensureList = mutateDb((runtime) => {
      const profileLink = findOrCreateShortLink(runtime, {
        targetType: 'profile',
        targetId: viewer.profile.id,
        ownerUserId: viewer.user.id,
        preferredSlug: viewer.profile.slug,
      });
      const vehicleLinks = vehicles.map((vehicle: any) => findOrCreateShortLink(runtime, {
        targetType: 'vehicle',
        targetId: vehicle.id,
        ownerUserId: viewer.user.id,
        preferredSlug: `${viewer.profile.slug}-${vehicle.nickname || vehicle.make || 'build'}`,
      }));
      const communityLinks = communities.map((community) => findOrCreateShortLink(runtime, {
        targetType: 'community',
        targetId: community.id,
        ownerUserId: viewer.user.id,
        preferredSlug: community.slug,
      }));
      const eventLinks = events.map((event) => findOrCreateShortLink(runtime, {
        targetType: 'event',
        targetId: event.id,
        ownerUserId: viewer.user.id,
        preferredSlug: event.slug,
      }));
      return { profileLink, vehicleLinks, communityLinks, eventLinks };
    });

    const latestDb = readDb();
    const allLinks = [ensureList.profileLink, ...ensureList.vehicleLinks, ...ensureList.communityLinks, ...ensureList.eventLinks].map((link) => ({
      ...link,
      targetHref: resolveTargetHref(latestDb, link.targetType, link.targetId),
      shortUrl: `${getPublicAppUrl()}/s/${link.slug}`,
      qrUrl: `${getPublicAppUrl()}/s/${link.slug}?src=qr`,
    }));

    return res.json(allLinks);
  });

  router.get('/resolve/:slug', async (req, res) => {
    const db = readDb();
    const link = getShortLinkBySlug(db, req.params.slug);
    if (!link) return res.status(404).json({ error: 'Short link not found' });
    const href = resolveTargetHref(db, link.targetType, link.targetId);
    if (!href) return res.status(404).json({ error: 'Target no longer exists' });

    const isQr = req.query.src === 'qr';
    const sessionKey = hashVisitorKey(`${req.ip}:${req.headers['user-agent'] || 'unknown'}:${isQr ? 'qr' : 'shortlink'}`);
    mutateDb((runtime) => {
      const target = runtime.shortLinks.find((item) => item.id === link.id);
      if (!target) return;
      target.clickCount += 1;
      if (isQr) target.qrScanCount += 1;
      target.updatedAt = nowIso();
      trackAnalyticsEvent(runtime, {
        actorUserId: null,
        sessionKey,
        source: isQr ? 'qr' : 'shortlink',
        eventType: isQr ? 'qr_scan' : 'shortlink_click',
        targetType: link.targetType,
        targetId: link.targetId,
      });
    });

    return res.json({ href, absoluteHref: `${getPublicAppUrl()}${href}` });
  });

  router.post('/claim', requireAuth, async (req, res) => {
    const schema = z.object({
      shortLinkId: z.string().min(1),
      slug: z.string().min(3).max(50),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid link payload' });
    const viewer = (req as any).viewer;

    try {
      mutateDb((db) => {
        const link = db.shortLinks.find((item) => item.id === parsed.data.shortLinkId);
        if (!link) throw new Error('Short link not found');
        if (link.ownerUserId !== viewer.user.id && viewer.user.role !== 'admin') throw new Error('Not allowed to edit this short link');
        link.slug = uniqueSlug(slugify(parsed.data.slug), db.shortLinks.filter((item) => item.id !== link.id).map((item) => item.slug));
        link.updatedAt = nowIso();
        logAudit(db, viewer.user.id, 'shortlink_claimed', 'shortlink', link.id, link.slug);
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Could not update slug' });
    }

    return res.json({ success: true });
  });

  return router;
}
