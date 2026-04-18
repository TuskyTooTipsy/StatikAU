import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import { networkApi } from '../api/network';
import type { NetworkEvent } from '../types/network';
import { usePageMeta } from '../hooks/usePageMeta';

function eventPill(event: NetworkEvent) {
  if (event.sponsored) return 'sponsored';
  if (event.sourceType === 'statik_hosted') return 'STATIK hosted';
  if (event.sourceType === 'partner') return 'partner';
  if (event.sourceType === 'imported') return 'imported';
  return 'approved';
}

function formatFocus(event: NetworkEvent) {
  return [event.location, event.date, event.time].filter(Boolean).join(' • ');
}

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ q: '', category: searchParams.get('category') || '', scope: (searchParams.get('scope') as 'upcoming' | 'past' | 'all') || 'upcoming', sourceType: searchParams.get('sourceType') || '' });

  usePageMeta('Events', 'Discover hosted, sponsored, imported, and member-submitted automotive events with a stronger social layer and sharper moderation.');

  async function load() {
    try {
      setError(null);
      setEvents(await networkApi.listEvents({
        q: filters.q || undefined,
        category: filters.category || undefined,
        scope: filters.scope,
        sourceType: filters.sourceType || undefined,
      }));
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.category) next.set('category', filters.category);
    if (filters.scope && filters.scope !== 'upcoming') next.set('scope', filters.scope);
    if (filters.sourceType) next.set('sourceType', filters.sourceType);
    setSearchParams(next, { replace: true });
    void load();
  }, [filters.category, filters.scope, filters.sourceType]);

  const featuredEvents = useMemo(() => events.filter((event) => event.featured || event.sponsored || event.sourceType === 'statik_hosted').slice(0, 3), [events]);
  const categories = useMemo(() => Array.from(new Set(events.map((event) => event.category))).sort(), [events]);
  const filteredEvents = useMemo(() => {
    if (!filters.q.trim()) return events;
    const query = filters.q.trim().toLowerCase();
    return events.filter((event) => [event.name, event.location, event.description, event.organizer, ...(event.tags || [])].join(' ').toLowerCase().includes(query));
  }, [events, filters.q]);

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <p className="eyebrow">Events</p>
        <h1 className="headline-lg mt-3">A sharper event layer for the automotive scene, with better curation, stronger detail, and real social intent.</h1>
        <p className="body-muted mt-4 max-w-3xl">Hosted, sponsored, imported, and member-submitted events now live in one moderated surface with cleaner hierarchy, richer detail pages, and stronger signals around what is worth tracking.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/submit" className="btn-primary h-12 px-5 text-[11px]">Submit an event</Link>
          <button type="button" onClick={() => setFilters((current) => ({ ...current, sourceType: 'statik_hosted' }))} className="btn-secondary h-12 px-5 text-[11px]">STATIK hosted</button>
          <button type="button" onClick={() => setFilters((current) => ({ ...current, sourceType: 'partner' }))} className="btn-secondary h-12 px-5 text-[11px]">Partner backed</button>
        </div>
      </div>

      {featuredEvents.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {featuredEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.slug}`} className="panel-cut overflow-hidden p-0">
              {event.media?.[0] ? (
                event.media[0].kind === 'video'
                  ? <video src={event.media[0].url} className="h-52 w-full object-cover" muted playsInline />
                  : <img src={event.media[0].url} alt={event.name} className="h-52 w-full object-cover" />
              ) : (
                <div className="h-52 w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]" />
              )}
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="status-chip">{event.category}</span>
                  <span className="status-chip">{eventPill(event)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.05em] text-bone">{event.name}</h2>
                  <p className="mt-3 text-sm text-silver/66">{formatFocus(event)}</p>
                </div>
                <p className="text-sm leading-7 text-silver/70">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="panel-cut p-6 md:p-8">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto_auto] xl:items-end">
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Search events</label>
            <input className="field-sharp mt-3" placeholder="Track day, drift, sponsor activation, venue, organizer…" value={filters.q} onChange={(e) => setFilters((current) => ({ ...current, q: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Category</label>
            <select className="field-sharp mt-3 min-w-[180px]" value={filters.category} onChange={(e) => setFilters((current) => ({ ...current, category: e.target.value }))}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Timeframe</label>
            <select className="field-sharp mt-3 min-w-[150px]" value={filters.scope} onChange={(e) => setFilters((current) => ({ ...current, scope: e.target.value as 'upcoming' | 'past' | 'all' }))}>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Source</label>
            <select className="field-sharp mt-3 min-w-[180px]" value={filters.sourceType} onChange={(e) => setFilters((current) => ({ ...current, sourceType: e.target.value }))}>
              <option value="">All sources</option>
              <option value="statik_hosted">STATIK hosted</option>
              <option value="partner">Partner</option>
              <option value="imported">Imported</option>
              <option value="user_submission">Member submission</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.slice(0, 10).map((category) => (
            <button key={category} type="button" onClick={() => setFilters((current) => ({ ...current, category: current.category === category ? '' : category }))} className={`status-chip ${filters.category === category ? 'bg-white/18 text-bone' : ''}`}>{category}</button>
          ))}
        </div>
      </div>

      {filteredEvents.length ? (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.slug}`} className="event-list-card gap-5">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="status-chip">{event.category}</span>
                  <span className="status-chip">{eventPill(event)}</span>
                  {event.hostCommunity ? <span className="status-chip">hosted by {event.hostCommunity.name}</span> : null}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-bone">{event.name}</h2>
                  <p className="mt-2 text-sm text-silver/70">{formatFocus(event)}</p>
                  {(event.vehicleFocus?.length || event.tags?.length) ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-silver/50">{[...(event.vehicleFocus || []), ...(event.tags || [])].slice(0, 5).join(' • ')}</p> : null}
                </div>
                <p className="text-sm leading-7 text-silver/72">{event.description}</p>
              </div>
              <div className="grid gap-2 text-xs uppercase tracking-[0.22em] text-silver/56 sm:text-right">
                <span>{event.counts?.attending ?? 0} attending</span>
                <span>{event.counts?.interested ?? 0} interested</span>
                <span>{event.counts?.maybe ?? 0} maybe</span>
                {event.sponsorName ? <span>{event.sponsorName}</span> : <span>{event.organizer}</span>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyPanel eyebrow="Events" title="No events match the current filters" body="Clear the search, switch the source, or submit the first event in a category that is not yet represented." action={<Link to="/submit" className="btn-primary h-11 px-4 text-[11px]">Submit event</Link>} />
      )}

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
