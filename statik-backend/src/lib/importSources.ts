import { createId, EventImportItemRecord, EventImportRunRecord, EventImportSourceRecord, EventRecord, nowIso, RuntimeDb, slugify, uniqueSlug } from './store';

type CandidatePage = {
  url: string;
  titleHint?: string;
  categoryHint?: string;
  organizerHint?: string;
};

type ImportAdapter = {
  key: string;
  discover: (source: EventImportSourceRecord) => Promise<CandidatePage[]>;
  parse: (source: EventImportSourceRecord, page: CandidatePage) => Promise<Partial<EventImportItemRecord> & { title: string; sourceUrl: string }>;
};

const qldSeedPages = [
  { path: '/calendar', category: 'motorsport event' },
  { path: '/events-at-queensland-raceway/roll-racing', category: 'drag / roll racing' },
  { path: '/events-at-queensland-raceway/moto-ride-days', category: 'ride day / bike event' },
  { path: '/events-at-queensland-raceway/sprints', category: 'track day' },
  { path: '/events-at-queensland-raceway/learner-drive-nights', category: 'learner / training event' },
  { path: '/events-at-queensland-raceway/happy-laps', category: 'motorsport event' },
  { path: '/events-at-queensland-raceway/drifting', category: 'drift' },
  { path: '/major-events-at-queensland-raceway/2-days-of-thunder', category: 'motorsport event' },
  { path: '/major-events-at-queensland-raceway/drift-matsuri', category: 'drift' },
  { path: '/major-events-at-queensland-raceway/powercruise', category: 'motorsport event' },
  { path: '/experiences-at-qr/v8-race-experience', category: 'sponsor activation' },
];

function absoluteUrl(baseUrl: string, href: string) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function stripTags(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decode(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .trim();
}

function firstMatch(html: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decode(stripTags(match[1]));
  }
  return '';
}

function categoryFromText(value: string, fallback = 'motorsport event') {
  const text = value.toLowerCase();
  if (/roll|drag/.test(text)) return 'drag / roll racing';
  if (/drift/.test(text)) return 'drift';
  if (/moto|ride|bike|asbk|superbike/.test(text)) return 'ride day / bike event';
  if (/sprint|track|race|qrdc|supercars|thunder/.test(text)) return 'track day';
  if (/cruise|happy laps/.test(text)) return 'cruise';
  if (/learner|academy|training/.test(text)) return 'learner / training event';
  if (/show|shine|display/.test(text)) return 'show and shine';
  if (/burnout/.test(text)) return 'motorsport event';
  return fallback;
}

function normalizeDateLabel(value: string) {
  if (!value) return '';
  const cleaned = value.replace(/^(NEXT:|Upcoming\.? Dates\.?)/i, '').replace(/\s+/g, ' ').trim();
  const numeric = cleaned.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
  if (numeric) {
    const yyyy = numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3];
    return `${yyyy}-${numeric[2].padStart(2, '0')}-${numeric[1].padStart(2, '0')}`;
  }
  const normalized = cleaned.replace(/(\d+)(st|nd|rd|th)/gi, '$1');
  const parsed = Date.parse(normalized);
  if (Number.isNaN(parsed)) return cleaned;
  return new Date(parsed).toISOString().slice(0, 10);
}

function normalizeTimeFromText(html: string) {
  const match = html.match(/(\d{1,2}(?::\d{2})?\s?(?:AM|PM|am|pm))/);
  return match ? match[1].toUpperCase().replace(/\s+/g, ' ') : '';
}

function extractJsonLdEvents(html: string) {
  const items: any[] = [];
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  for (const block of blocks) {
    const raw = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
    try {
      const parsed = JSON.parse(raw);
      const records = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
      records.filter((entry: any) => String(entry['@type'] || '').toLowerCase().includes('event')).forEach((entry: any) => items.push(entry));
    } catch {
      // ignore malformed json-ld
    }
  }
  return items;
}

async function fetchText(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'STATIK event importer (+https://statik.au)' }, signal: controller.signal });
    if (!response.ok) throw new Error(`Fetch failed ${response.status}`);
    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function discoverQldRaceway(source: EventImportSourceRecord): Promise<CandidatePage[]> {
  const discovered = new Map<string, CandidatePage>();
  qldSeedPages.forEach((page) => discovered.set(absoluteUrl(source.baseUrl, page.path), { url: absoluteUrl(source.baseUrl, page.path), categoryHint: page.category, organizerHint: source.name }));
  try {
    const html = await fetchText(absoluteUrl(source.baseUrl, '/calendar'));
    const hrefs = Array.from(html.matchAll(/href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi));
    for (const [, href, labelRaw] of hrefs) {
      const label = decode(stripTags(labelRaw));
      const url = absoluteUrl(source.baseUrl, href);
      if (!url.includes(source.baseUrl.replace(/\/$/, ''))) continue;
      if (!/(event|calendar|raceway|roll|drift|sprint|ride|happy|learner|powercruise|thunder|supercars|asbk)/i.test(`${url} ${label}`)) continue;
      discovered.set(url, { url, titleHint: label, categoryHint: categoryFromText(`${url} ${label}`), organizerHint: source.name });
    }
  } catch {
    // Keep seed pages even if the client-rendered calendar cannot be fetched server-side.
  }
  return Array.from(discovered.values()).slice(0, 60);
}

async function parseQldRaceway(source: EventImportSourceRecord, page: CandidatePage) {
  const html = await fetchText(page.url);
  const jsonLd = extractJsonLdEvents(html)[0];
  const title = decode(stripTags(jsonLd?.name || firstMatch(html, [/<h1[^>]*>(.*?)<\/h1>/i, /#\s*([^\n<]+)/, /<title>([^<]+)<\/title>/i]) || page.titleHint || 'Queensland Raceway event')).replace(/\s*\|.*$/, '').trim();
  const description = decode(stripTags(jsonLd?.description || firstMatch(html, [/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i, /<p[^>]*>(.*?)<\/p>/i]))).slice(0, 2200);
  const imageUrl = jsonLd?.image?.url || (Array.isArray(jsonLd?.image) ? jsonLd.image[0] : jsonLd?.image) || firstMatch(html, [/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i]);
  const nextDateRaw = jsonLd?.startDate || firstMatch(html, [/NEXT:\s*([^<\n]+)/i, /Upcoming\.?\s*Dates\s*([^<\n]+)/i, /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/]);
  const date = normalizeDateLabel(nextDateRaw);
  const time = normalizeTimeFromText(jsonLd?.startDate || html);
  const locationName = jsonLd?.location?.name || 'Queensland Raceway';
  const street = jsonLd?.location?.address?.streetAddress || '133 Champions Way';
  const locality = jsonLd?.location?.address?.addressLocality || 'Willowbank';
  const region = jsonLd?.location?.address?.addressRegion || 'QLD';
  const postalCode = jsonLd?.location?.address?.postalCode || '4306';
  const location = `${locationName}, ${street}, ${locality} ${region} ${postalCode}`;
  return {
    title,
    sourceUrl: page.url,
    location,
    date,
    time,
    category: categoryFromText(`${title} ${page.url}`, page.categoryHint),
    description,
    imageUrl,
    organizer: source.name,
    hostHint: source.name,
    rawText: stripTags(html).slice(0, 8000),
    normalizedTags: [categoryFromText(`${title} ${page.url}`, page.categoryHint), 'qld-raceway', 'imported'].filter(Boolean),
  };
}

const adapters: ImportAdapter[] = [
  { key: 'qldraceway', discover: discoverQldRaceway, parse: parseQldRaceway },
];

function findDuplicate(db: RuntimeDb, candidate: { title: string; date?: string; sourceUrl: string }) {
  return db.events.find((event) => event.sourceUrl === candidate.sourceUrl || (event.name.toLowerCase() === candidate.title.toLowerCase() && Boolean(candidate.date) && event.date === candidate.date));
}

async function runAdapter(db: RuntimeDb, source: EventImportSourceRecord, adapter: ImportAdapter) {
  const run: EventImportRunRecord = {
    id: createId('imprun'),
    sourceId: source.id,
    sourceKey: source.key,
    startedAt: nowIso(),
    status: 'queued',
    importedCount: 0,
    duplicateCount: 0,
    errorCount: 0,
  };
  db.eventImportRuns.unshift(run);

  const candidates = await adapter.discover(source);
  for (const candidate of candidates) {
    try {
      const parsed = await adapter.parse(source, candidate);
      const normalizedTitle = parsed.title.trim();
      const existing = db.eventImportItems.find((item) => item.sourceUrl === parsed.sourceUrl && item.date === (parsed.date || '') && item.title.toLowerCase() === normalizedTitle.toLowerCase());
      const duplicateEvent = findDuplicate(db, { title: normalizedTitle, date: parsed.date, sourceUrl: parsed.sourceUrl });
      if (existing) {
        run.duplicateCount += 1;
        continue;
      }
      const item: EventImportItemRecord = {
        id: createId('impitem'),
        sourceId: source.id,
        runId: run.id,
        sourceKey: source.key,
        sourceName: source.name,
        sourceUrl: parsed.sourceUrl,
        title: normalizedTitle,
        location: parsed.location || '',
        date: parsed.date || '',
        time: parsed.time || '',
        category: parsed.category || categoryFromText(normalizedTitle),
        description: parsed.description || '',
        imageUrl: parsed.imageUrl,
        organizer: parsed.organizer || source.name,
        hostHint: parsed.hostHint || source.name,
        rawText: parsed.rawText || '',
        normalizedTags: parsed.normalizedTags || ['imported'],
        status: duplicateEvent ? 'archived' : 'pending',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        duplicateOfEventId: duplicateEvent?.id,
        adminNote: duplicateEvent ? 'Possible duplicate of existing event' : undefined,
      };
      db.eventImportItems.unshift(item);
      if (duplicateEvent) run.duplicateCount += 1;
      else run.importedCount += 1;
    } catch (error: any) {
      run.errorCount += 1;
      db.eventImportItems.unshift({
        id: createId('impitem'),
        sourceId: source.id,
        runId: run.id,
        sourceKey: source.key,
        sourceName: source.name,
        sourceUrl: candidate.url,
        title: candidate.titleHint || candidate.url.split('/').pop()?.replace(/-/g, ' ') || 'Import error',
        location: '',
        date: '',
        time: '',
        category: candidate.categoryHint || 'motorsport event',
        description: '',
        organizer: candidate.organizerHint || source.name,
        rawText: '',
        normalizedTags: ['import-error'],
        status: 'archived',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        adminNote: error.message || 'Import failed',
      });
    }
  }

  run.finishedAt = nowIso();
  run.status = run.errorCount > 0 && run.importedCount > 0 ? 'partial' : run.errorCount > 0 ? 'failed' : 'success';
  run.note = `${candidates.length} candidate pages checked`;
  source.lastRunAt = run.finishedAt;
  source.lastRunStatus = run.status;
  source.lastRunMessage = `${run.importedCount} pending, ${run.duplicateCount} duplicates, ${run.errorCount} errors`;
  source.updatedAt = nowIso();
  db.eventImportItems = db.eventImportItems.slice(0, 1000);
  return run;
}

export async function runImportSource(db: RuntimeDb, sourceKey: string) {
  const source = db.eventImportSources.find((item) => item.key === sourceKey);
  if (!source) throw new Error('Import source not found');
  if (!source.enabled) throw new Error('Import source disabled');
  const adapter = adapters.find((item) => item.key === sourceKey);
  if (!adapter) throw new Error('Unsupported import source');
  return runAdapter(db, source, adapter);
}

export function publishImportItemAsEvent(db: RuntimeDb, item: EventImportItemRecord, actorUserId: string) {
  if (item.linkedEventId) {
    const existing = db.events.find((event) => event.id === item.linkedEventId);
    if (existing) return existing;
  }
  const slug = uniqueSlug(slugify(item.title), db.events.map((event) => event.slug));
  const event: EventRecord = {
    id: createId('event'),
    slug,
    name: item.title,
    location: item.location,
    date: item.date,
    time: item.time || 'TBC',
    description: item.description || `Imported event staged from ${item.sourceName}. Review source for final details.`,
    category: item.category,
    organizer: item.organizer || item.sourceName,
    featured: false,
    approvalStatus: 'approved',
    createdByUserId: actorUserId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    sourceType: 'imported',
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    tags: item.normalizedTags,
    mediaIds: [],
    sponsored: false,
    sponsorName: '',
    venueType: item.location.toLowerCase().includes('raceway') ? 'raceway' : 'other',
    entryType: 'mixed',
    pricingType: 'other',
    vehicleFocus: [],
    visibilityLabel: 'Imported and reviewed',
    spectatorFriendly: true,
    familyFriendly: undefined,
    recurring: false,
    indoorOutdoor: 'outdoor',
    hostLinks: [item.sourceUrl],
    adminNotes: item.adminNote ? [item.adminNote] : [],
    statusHistory: [{ status: 'approved', at: nowIso(), byUserId: actorUserId, note: 'Approved from import queue' }],
    importItemId: item.id,
  };
  db.events.push(event);
  item.linkedEventId = event.id;
  item.status = 'approved';
  item.updatedAt = nowIso();
  return event;
}
