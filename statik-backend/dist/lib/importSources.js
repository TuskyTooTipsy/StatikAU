"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runImportSource = runImportSource;
exports.publishImportItemAsEvent = publishImportItemAsEvent;
const store_1 = require("./store");
const MONTHS = {
    jan: '01', january: '01', feb: '02', february: '02', mar: '03', march: '03', apr: '04', april: '04', may: '05', jun: '06', june: '06', jul: '07', july: '07', aug: '08', august: '08', sep: '09', sept: '09', september: '09', oct: '10', october: '10', nov: '11', november: '11', dec: '12', december: '12',
};
function absoluteUrl(baseUrl, href) {
    try {
        return new URL(href, baseUrl).toString();
    }
    catch {
        return href;
    }
}
function stripTags(value) {
    return value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function decode(value) {
    return value
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .trim();
}
function firstMatch(html, patterns) {
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1])
            return decode(stripTags(match[1]));
    }
    return '';
}
function categoryFromText(value, fallback = 'motorsport event') {
    const text = value.toLowerCase();
    if (/roll|drag|test n tune|strip|winternationals|qdr(c|a)/.test(text))
        return 'drag / roll racing';
    if (/drift|matsuri/.test(text))
        return 'drift';
    if (/moto|ride|bike|asbk|superbike|motorcycle/.test(text))
        return 'ride day / bike event';
    if (/track day|sprint|race|qrdc|supercars|thunder|circuit|formula|trans-am|gt4|gt festival|ferrari challenge/.test(text))
        return 'track day';
    if (/cruise|happy laps|roll-up/.test(text))
        return 'cruise';
    if (/learner|academy|training|license|licence|driver academy/.test(text))
        return 'learner / training event';
    if (/show|shine|display|classic|cars and coffee/.test(text))
        return 'show and shine';
    if (/workshop|tech night|seminar/.test(text))
        return 'workshop';
    if (/charity|fundraiser/.test(text))
        return 'charity event';
    if (/media|content|shoot/.test(text))
        return 'content/media event';
    return fallback;
}
function normalizeTime(value) {
    const range = value.match(/(\d{1,2}(?::\d{2})?\s?(?:AM|PM|am|pm))(?:\s*[-–]\s*(\d{1,2}(?::\d{2})?\s?(?:AM|PM|am|pm)))?/);
    if (!range)
        return '';
    return range[2] ? `${range[1].toUpperCase().replace(/\s+/g, ' ')} – ${range[2].toUpperCase().replace(/\s+/g, ' ')}` : range[1].toUpperCase().replace(/\s+/g, ' ');
}
function normalizeDateLabel(value) {
    if (!value)
        return '';
    const cleaned = decode(value).replace(/^(NEXT:|Upcoming\.? Dates\.?)/i, '').replace(/\s+/g, ' ').trim();
    const iso = cleaned.match(/(20\d{2})-(\d{1,2})-(\d{1,2})/);
    if (iso)
        return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
    const numeric = cleaned.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
    if (numeric) {
        const yyyy = numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3];
        return `${yyyy}-${numeric[2].padStart(2, '0')}-${numeric[1].padStart(2, '0')}`;
    }
    const long = cleaned.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*(\d{1,2})(?:st|nd|rd|th)?(?:\s*[–-]\s*\d{1,2})?\s+([A-Za-z]+)\s+(20\d{2})/i);
    if (long) {
        const month = MONTHS[long[2].toLowerCase().slice(0, 3)] || MONTHS[long[2].toLowerCase()];
        if (month)
            return `${long[3]}-${month}-${long[1].padStart(2, '0')}`;
    }
    const monthRange = cleaned.match(/(\d{1,2})\s*[–-]\s*(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})/i);
    if (monthRange) {
        const month = MONTHS[monthRange[3].toLowerCase().slice(0, 3)] || MONTHS[monthRange[3].toLowerCase()];
        if (month)
            return `${monthRange[4]}-${month}-${monthRange[1].padStart(2, '0')}`;
    }
    const parsed = Date.parse(cleaned.replace(/(\d+)(st|nd|rd|th)/gi, '$1'));
    if (!Number.isNaN(parsed))
        return new Date(parsed).toISOString().slice(0, 10);
    return '';
}
async function fetchText(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'STATIK event importer (+https://statik.au)', Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }, signal: controller.signal });
        if (!response.ok)
            throw new Error(`Fetch failed ${response.status} for ${url}`);
        return response.text();
    }
    finally {
        clearTimeout(timeout);
    }
}
function extractJsonLdEvents(html) {
    const items = [];
    const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
    for (const block of blocks) {
        const raw = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
        try {
            const parsed = JSON.parse(raw);
            const records = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
            records.filter((entry) => String(entry['@type'] || '').toLowerCase().includes('event')).forEach((entry) => items.push(entry));
        }
        catch { /* ignore malformed JSON-LD */ }
    }
    return items;
}
function dedupeCandidates(candidates) {
    const seen = new Set();
    return candidates.filter((candidate) => {
        const key = `${candidate.sourceUrl}|${candidate.title.toLowerCase()}|${candidate.date || ''}`;
        if (!candidate.title || seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
function normalizeJsonLdEvent(source, sourceUrl, entry) {
    const title = decode(stripTags(entry.name || ''));
    if (!title)
        return null;
    const locationName = entry.location?.name || 'Queensland Raceway';
    const address = entry.location?.address;
    const location = typeof address === 'string'
        ? `${locationName}, ${address}`
        : [locationName, address?.streetAddress, address?.addressLocality, address?.addressRegion, address?.postalCode].filter(Boolean).join(', ');
    const image = Array.isArray(entry.image) ? entry.image[0] : entry.image?.url || entry.image;
    return {
        title,
        sourceUrl: entry.url || sourceUrl,
        location: location || 'Queensland Raceway, 133 Champions Way, Willowbank QLD 4306',
        date: normalizeDateLabel(entry.startDate || ''),
        time: normalizeTime(entry.startDate || entry.description || ''),
        category: categoryFromText(`${title} ${entry.description || ''}`),
        description: decode(stripTags(entry.description || '')).slice(0, 2400),
        imageUrl: image,
        organizer: source.name,
        hostHint: source.name,
        rawText: JSON.stringify(entry).slice(0, 8000),
        normalizedTags: [categoryFromText(title), 'imported', source.key],
    };
}
function extractPageLinks(baseUrl, html, matcher) {
    const out = new Map();
    const links = Array.from(html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi));
    for (const [, href, labelRaw] of links) {
        const label = decode(stripTags(labelRaw));
        const url = absoluteUrl(baseUrl, href);
        if (matcher.test(`${url} ${label}`))
            out.set(url, label);
    }
    return Array.from(out.entries()).map(([url, label]) => ({ url, label }));
}
function parseWillowbankText(text, source, sourceUrl) {
    const candidates = [];
    const regex = /###\s+([^#]+?)\s+(?:.*?)(Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*(\d{1,2}\s+[A-Za-z]+(?:\s*-\s*(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*\d{1,2}\s+[A-Za-z]+)?\s+20\d{2}),\s*([^,]+?),\s*Willowbank Raceway/gi;
    let match;
    while ((match = regex.exec(text))) {
        const title = decode(match[1]).replace(/\s+/g, ' ').trim();
        const dateText = match[3];
        const around = text.slice(Math.max(0, match.index - 120), Math.min(text.length, match.index + 900));
        candidates.push({
            title,
            sourceUrl,
            location: 'Willowbank Raceway, Champions Way, Willowbank QLD 4306',
            date: normalizeDateLabel(dateText),
            time: normalizeTime(around),
            category: categoryFromText(title, 'motorsport event'),
            description: around.slice(0, 1600),
            organizer: source.name,
            hostHint: source.name,
            rawText: around,
            normalizedTags: [categoryFromText(title), 'willowbank', 'imported'],
        });
    }
    return candidates;
}
function parseDriveTeamText(text, source, sourceUrl) {
    const candidates = [];
    const regex = /###\s*(2026\s+Track Day\s+-\s+Queensland Raceway)[\s\S]{0,120}?(\d{1,2}\/\d{1,2}\/20\d{2})\s+([\d:apmAPM\s.-]+)[\s\S]{0,350}?(Queensland Raceway)/g;
    let match;
    while ((match = regex.exec(text))) {
        const around = text.slice(Math.max(0, match.index - 80), Math.min(text.length, match.index + 900));
        candidates.push({
            title: match[1],
            sourceUrl,
            location: 'Queensland Raceway, 133 Champions Way, Willowbank QLD 4306',
            date: normalizeDateLabel(match[2]),
            time: normalizeTime(match[3]),
            category: 'track day',
            description: around.slice(0, 1800),
            organizer: source.name,
            hostHint: 'The Drive Team / Queensland Raceway',
            rawText: around,
            normalizedTags: ['track day', 'queensland-raceway', 'fallback-source', 'imported'],
        });
    }
    return candidates;
}
function parseRacingCalendarText(text, source, sourceUrl) {
    const candidates = [];
    const regex = /(\d{1,2}(?:\s*[–-]\s*\d{1,2})?\s+[A-Za-z]+\s+20\d{2}|[A-Za-z]+\s+20\d{4})\s+\|\s+(.+?)(?=(?:\d{1,2}(?:\s*[–-]\s*\d{1,2})?\s+[A-Za-z]+\s+20\d{2}|[A-Za-z]+\s+20\d{4})\s+\||$)/g;
    let match;
    while ((match = regex.exec(text))) {
        const dateText = match[1];
        const raw = decode(match[2]).replace(/Image:.*? /g, ' ').replace(/\s+/g, ' ').trim();
        const title = raw.split(' Provisional ')[0].split(' NC ')[0].slice(0, 140).trim() || 'Queensland Raceway event';
        if (!normalizeDateLabel(dateText))
            continue;
        candidates.push({
            title,
            sourceUrl,
            location: 'Queensland Raceway, 133 Champions Way, Willowbank QLD 4306',
            date: normalizeDateLabel(dateText),
            time: 'TBC',
            category: categoryFromText(title, 'motorsport event'),
            description: raw.slice(0, 2000),
            organizer: source.name,
            hostHint: 'Queensland Raceway / RacingCalendar',
            rawText: `${dateText} | ${raw}`.slice(0, 4000),
            normalizedTags: [categoryFromText(title), 'queensland-raceway', 'racingcalendar', 'imported'],
        });
    }
    return candidates;
}
async function parseSinglePage(source, url) {
    const html = await fetchText(url);
    const text = stripTags(html);
    const jsonLd = extractJsonLdEvents(html).map((entry) => normalizeJsonLdEvent(source, url, entry)).filter(Boolean);
    if (jsonLd.length)
        return jsonLd;
    if (url.includes('willowbank'))
        return parseWillowbankText(text, source, url);
    if (url.includes('thedriveteam'))
        return parseDriveTeamText(text, source, url);
    if (url.includes('racingcalendar'))
        return parseRacingCalendarText(text, source, url);
    const title = firstMatch(html, [/<h1[^>]*>(.*?)<\/h1>/i, /<title>([^<]+)<\/title>/i]).replace(/\s*\|.*$/, '').trim();
    const date = normalizeDateLabel(firstMatch(html, [/NEXT:\s*([^<\n]+)/i, /Upcoming\.?\s*Dates\.?\s*([^<\n]+)/i, /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/, /((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*\d{1,2}\s+[A-Za-z]+\s+20\d{2})/i]));
    if (!title || !date)
        return [];
    return [{
            title,
            sourceUrl: url,
            location: source.key.includes('qld') ? 'Queensland Raceway, 133 Champions Way, Willowbank QLD 4306' : '',
            date,
            time: normalizeTime(text) || 'TBC',
            category: categoryFromText(title),
            description: firstMatch(html, [/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i, /<p[^>]*>(.*?)<\/p>/i]).slice(0, 2200),
            organizer: source.name,
            hostHint: source.name,
            rawText: text.slice(0, 8000),
            normalizedTags: [categoryFromText(title), source.key, 'imported'],
        }];
}
async function runQueenslandRaceway(source) {
    const candidates = [];
    const calendarUrl = absoluteUrl(source.baseUrl, '/calendar');
    try {
        const calendarHtml = await fetchText(calendarUrl);
        const calendarText = stripTags(calendarHtml);
        extractJsonLdEvents(calendarHtml).forEach((entry) => {
            const candidate = normalizeJsonLdEvent(source, calendarUrl, entry);
            if (candidate)
                candidates.push(candidate);
        });
        const direct = parseRacingCalendarText(calendarText, { ...source, name: 'Queensland Raceway' }, calendarUrl).filter((item) => item.date);
        candidates.push(...direct);
        const links = extractPageLinks(source.baseUrl, calendarHtml, /(event|calendar|raceway|roll|drift|sprint|ride|happy|learner|powercruise|thunder|supercars|asbk)/i).slice(0, 35);
        for (const link of links)
            candidates.push(...await parseSinglePage(source, link.url));
    }
    catch (error) {
        candidates.push({ title: 'Queensland Raceway direct calendar import requires fallback review', sourceUrl: calendarUrl, location: 'Queensland Raceway, 133 Champions Way, Willowbank QLD 4306', date: '', time: '', category: 'motorsport event', description: `Direct calendar fetch failed: ${error.message}`, organizer: source.name, hostHint: source.name, rawText: error.message, normalizedTags: ['import-error', 'qld-raceway'] });
    }
    const datedDirect = candidates.filter((candidate) => candidate.date && !candidate.normalizedTags?.includes('import-error'));
    if (datedDirect.length)
        return dedupeCandidates(datedDirect);
    // Fallback path is explicit: no fake QR events. These are real venue-relevant external pages staged with source URLs.
    const fallbackSources = [
        ['Queensland Raceway via RacingCalendar', 'https://racingcalendar.net/circuit/queensland-raceway/2026', 'racingcalendar'],
        ['Queensland Raceway track days via The Drive Team', 'https://thedriveteam.com.au/events/', 'thedriveteam'],
        ['Queensland Raceway location via The Drive Team', 'https://thedriveteam.com.au/locations/queensland-raceway/', 'thedriveteam'],
    ];
    for (const [name, url, key] of fallbackSources) {
        try {
            const sourceLike = { ...source, key, name, baseUrl: new URL(url).origin };
            candidates.push(...await parseSinglePage(sourceLike, url));
        }
        catch (error) {
            candidates.push({ title: `${name} fallback failed`, sourceUrl: url, location: '', date: '', time: '', category: 'motorsport event', description: error.message, organizer: name, hostHint: name, rawText: error.message, normalizedTags: ['import-error', 'fallback-source'] });
        }
    }
    return dedupeCandidates(candidates.filter((candidate) => candidate.date && !candidate.normalizedTags?.includes('import-error')));
}
async function runGenericSource(source) {
    return dedupeCandidates(await parseSinglePage(source, source.baseUrl));
}
const adapters = [
    { key: 'qldraceway', run: runQueenslandRaceway },
    { key: 'racingcalendar_qldraceway', run: runGenericSource },
    { key: 'willowbank', run: runGenericSource },
    { key: 'thedriveteam', run: runGenericSource },
];
function findDuplicate(db, candidate) {
    return db.events.find((event) => event.sourceUrl === candidate.sourceUrl || (event.name.toLowerCase() === candidate.title.toLowerCase() && Boolean(candidate.date) && event.date === candidate.date));
}
async function runAdapter(db, source, adapter) {
    const run = {
        id: (0, store_1.createId)('imprun'),
        sourceId: source.id,
        sourceKey: source.key,
        startedAt: (0, store_1.nowIso)(),
        status: 'queued',
        importedCount: 0,
        duplicateCount: 0,
        errorCount: 0,
    };
    db.eventImportRuns.unshift(run);
    let candidates = [];
    try {
        candidates = await adapter.run(source);
    }
    catch (error) {
        run.errorCount += 1;
        run.note = error.message || 'Import source failed before parsing records';
    }
    for (const candidate of candidates) {
        try {
            const normalizedTitle = candidate.title.trim();
            const existing = db.eventImportItems.find((item) => item.sourceUrl === candidate.sourceUrl && item.date === (candidate.date || '') && item.title.toLowerCase() === normalizedTitle.toLowerCase());
            const duplicateEvent = findDuplicate(db, { title: normalizedTitle, date: candidate.date, sourceUrl: candidate.sourceUrl });
            if (existing) {
                run.duplicateCount += 1;
                continue;
            }
            const item = {
                id: (0, store_1.createId)('impitem'),
                sourceId: source.id,
                runId: run.id,
                sourceKey: source.key,
                sourceName: candidate.organizer || source.name,
                sourceUrl: candidate.sourceUrl,
                title: normalizedTitle,
                location: candidate.location || '',
                date: candidate.date || '',
                time: candidate.time || 'TBC',
                category: candidate.category || categoryFromText(normalizedTitle),
                description: candidate.description || '',
                imageUrl: candidate.imageUrl,
                organizer: candidate.organizer || source.name,
                hostHint: candidate.hostHint || source.name,
                rawText: candidate.rawText || '',
                normalizedTags: candidate.normalizedTags || ['imported'],
                status: duplicateEvent ? 'archived' : 'pending',
                createdAt: (0, store_1.nowIso)(),
                updatedAt: (0, store_1.nowIso)(),
                duplicateOfEventId: duplicateEvent?.id,
                adminNote: duplicateEvent ? 'Possible duplicate of existing event' : undefined,
            };
            db.eventImportItems.unshift(item);
            if (duplicateEvent)
                run.duplicateCount += 1;
            else
                run.importedCount += 1;
        }
        catch (error) {
            run.errorCount += 1;
        }
    }
    run.finishedAt = (0, store_1.nowIso)();
    if (run.importedCount === 0 && run.duplicateCount === 0 && run.errorCount === 0) {
        run.status = 'partial';
        run.note = 'Source fetched but no dated event records were found. Check raw site behavior or run fallback sources.';
    }
    else {
        run.status = run.errorCount > 0 && run.importedCount > 0 ? 'partial' : run.errorCount > 0 ? 'failed' : 'success';
        run.note = run.note || `${candidates.length} parsed candidate records checked`;
    }
    source.lastRunAt = run.finishedAt;
    source.lastRunStatus = run.status;
    source.lastRunMessage = `${run.importedCount} pending, ${run.duplicateCount} duplicates, ${run.errorCount} errors`;
    source.updatedAt = (0, store_1.nowIso)();
    db.eventImportItems = db.eventImportItems.slice(0, 1000);
    return run;
}
async function runImportSource(db, sourceKey) {
    const source = db.eventImportSources.find((item) => item.key === sourceKey);
    if (!source)
        throw new Error('Import source not found');
    if (!source.enabled)
        throw new Error('Import source disabled');
    const adapter = adapters.find((item) => item.key === sourceKey);
    if (!adapter)
        throw new Error('Unsupported import source');
    return runAdapter(db, source, adapter);
}
function publishImportItemAsEvent(db, item, actorUserId) {
    if (item.linkedEventId) {
        const existing = db.events.find((event) => event.id === item.linkedEventId);
        if (existing)
            return existing;
    }
    const slug = (0, store_1.uniqueSlug)((0, store_1.slugify)(item.title), db.events.map((event) => event.slug));
    const event = {
        id: (0, store_1.createId)('event'),
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
        createdAt: (0, store_1.nowIso)(),
        updatedAt: (0, store_1.nowIso)(),
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
        statusHistory: [{ status: 'approved', at: (0, store_1.nowIso)(), byUserId: actorUserId, note: 'Approved from import queue' }],
        importItemId: item.id,
    };
    db.events.push(event);
    item.linkedEventId = event.id;
    item.status = 'approved';
    item.updatedAt = (0, store_1.nowIso)();
    return event;
}
