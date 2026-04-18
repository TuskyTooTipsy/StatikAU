import { createId, EventImportItemRecord, EventImportRunRecord, EventImportSourceRecord, EventRecord, nowIso, RuntimeDb, slugify, uniqueSlug } from './store';

const qldRacewayPages = [
  { path: '/events-at-queensland-raceway/roll-racing', category: 'drag / roll racing', organizer: 'Queensland Raceway' },
  { path: '/events-at-queensland-raceway/moto-ride-days', category: 'ride day / bike event', organizer: 'Queensland Raceway' },
  { path: '/events-at-queensland-raceway/sprints', category: 'track day', organizer: 'Queensland Raceway' },
  { path: '/events-at-queensland-raceway/learner-drive-nights', category: 'learner / training event', organizer: 'Queensland Raceway' },
  { path: '/events-at-queensland-raceway/happy-laps', category: 'motorsport event', organizer: 'Queensland Raceway' },
  { path: '/major-events-at-queensland-raceway/2-days-of-thunder', category: 'motorsport event', organizer: 'Queensland Raceway' },
  { path: '/major-events-at-queensland-raceway/drift-matsuri', category: 'drift', organizer: 'Queensland Raceway' },
  { path: '/experiences-at-qr/v8-race-experience', category: 'sponsor activation', organizer: 'Queensland Raceway' },
];

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decode(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function firstMatch(html: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decode(stripTags(match[1]));
  }
  return '';
}

function normalizeDateLabel(value: string) {
  if (!value) return '';
  const cleaned = value.replace(/^(NEXT:|Upcoming\. Dates\.?)/i, '').replace(/\s+/g, ' ').trim();
  const normalized = cleaned.replace(/(\d+)(st|nd|rd|th)/gi, '$1');
  const parsed = Date.parse(normalized);
  if (Number.isNaN(parsed)) return cleaned;
  return new Date(parsed).toISOString().slice(0, 10);
}

function normalizeTimeFromText(html: string) {
  const match = html.match(/(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm))/);
  return match ? match[1].toUpperCase().replace(/\s+/g, ' ') : '';
}

async function fetchText(url: string) {
  const response = await fetch(url, { headers: { 'User-Agent': 'STATIK event importer' } });
  if (!response.ok) throw new Error(`Fetch failed ${response.status}`);
  return response.text();
}

async function importFromQldRaceway(db: RuntimeDb, source: EventImportSourceRecord) {
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

  for (const page of qldRacewayPages) {
    const url = `${source.baseUrl}${page.path}`;
    try {
      const html = await fetchText(url);
      const title = firstMatch(html, [/#\s*([^\n<]+)/, /<title>([^<]+)<\/title>/i]);
      const summary = firstMatch(html, [/<meta\s+name="description"\s+content="([^"]+)"/i, /##[\s\S]*?<p[^>]*>(.*?)<\/p>/i]);
      const location = 'Queensland Raceway, 133 Champions Way, Willowbank QLD 4306';
      const imageUrl = firstMatch(html, [/<meta\s+property="og:image"\s+content="([^"]+)"/i]);
      const nextDateRaw = firstMatch(html, [/NEXT:\s*([^<\n]+)/i, /Upcoming\.?\s*Dates\s*([^<\n]+)/i]);
      const isoDate = normalizeDateLabel(nextDateRaw);
      const time = normalizeTimeFromText(html);
      const normalizedTitle = title.replace(/\s*\|.*$/, '').trim();
      const existing = db.eventImportItems.find((item) => item.sourceUrl === url && item.date === isoDate && item.title.toLowerCase() === normalizedTitle.toLowerCase());
      const duplicateEvent = db.events.find((event) => event.sourceUrl === url || (event.name.toLowerCase() === normalizedTitle.toLowerCase() && event.date === isoDate));
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
        sourceUrl: url,
        title: normalizedTitle,
        location,
        date: isoDate,
        time,
        category: page.category,
        description: summary,
        imageUrl,
        organizer: page.organizer,
        hostHint: page.organizer,
        rawText: html.slice(0, 5000),
        normalizedTags: [page.category, 'qld-raceway', 'imported'].filter(Boolean),
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
        sourceUrl: url,
        title: page.path.split('/').pop()?.replace(/-/g, ' ') || 'Import error',
        location: '',
        date: '',
        time: '',
        category: page.category,
        description: '',
        organizer: page.organizer,
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
  source.lastRunAt = run.finishedAt;
  source.lastRunStatus = run.status;
  source.lastRunMessage = `${run.importedCount} pending, ${run.duplicateCount} duplicates, ${run.errorCount} errors`;
  source.updatedAt = nowIso();
  db.eventImportItems = db.eventImportItems.slice(0, 500);
  return run;
}

export async function runImportSource(db: RuntimeDb, sourceKey: string) {
  const source = db.eventImportSources.find((item) => item.key === sourceKey);
  if (!source) throw new Error('Import source not found');
  if (!source.enabled) throw new Error('Import source disabled');
  if (sourceKey === 'qldraceway') return importFromQldRaceway(db, source);
  throw new Error('Unsupported import source');
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
    time: item.time,
    description: item.description,
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
    venueType: 'raceway',
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
