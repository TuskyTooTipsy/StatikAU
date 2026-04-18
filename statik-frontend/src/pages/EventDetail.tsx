import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import MediaGrid from '../components/platform/MediaGrid';
import { networkApi } from '../api/network';
import { useSessionStore } from '../store/session';
import type { NetworkEvent } from '../types/network';
import { usePageMeta } from '../hooks/usePageMeta';

export default function EventDetailPage() {
  const { slug } = useParams();
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const [event, setEvent] = useState<NetworkEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyState, setBusyState] = useState<'interested' | 'attending' | 'maybe' | null>(null);

  async function load() {
    if (!slug) return;
    try {
      setError(null);
      const loaded = await networkApi.getEvent(slug);
      setEvent(loaded);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    void load();
  }, [slug]);

  useEffect(() => {
    if (!event) return;
    void networkApi.trackAnalytics({ eventType: 'event_click', targetType: 'event', targetId: event.id, source: 'event_detail' }).catch(() => undefined);
  }, [event?.id]);

  usePageMeta(event?.name || 'Event', event?.description || 'Detailed event page');

  const statusSummary = useMemo(() => [
    { label: 'Attending', value: event?.counts?.attending ?? 0 },
    { label: 'Interested', value: event?.counts?.interested ?? 0 },
    { label: 'Maybe', value: event?.counts?.maybe ?? 0 },
  ], [event?.counts?.attending, event?.counts?.interested, event?.counts?.maybe]);

  async function handleRsvp(status: 'interested' | 'attending' | 'maybe') {
    if (!event) return;
    setBusyState(status);
    try {
      setEvent(await networkApi.rsvpEvent(event.id, status));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyState(null);
    }
  }

  if (error && !event) return <div className="shell py-20"><EmptyPanel eyebrow="Event" title="Event not found" body={error} /></div>;
  if (!event) return <div className="shell py-20"><div className="panel-cut p-8">Loading event…</div></div>;

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <section className="page-hero-cut overflow-hidden p-0">
        {event.media?.length ? (
          event.media[0].kind === 'video'
            ? <video src={event.media[0].url} className="h-[280px] w-full object-cover md:h-[380px]" controls />
            : <img src={event.media[0].url} alt={event.name} className="h-[280px] w-full object-cover md:h-[380px]" />
        ) : null}
        <div className="space-y-6 p-6 md:p-8 xl:p-10">
          <div className="flex flex-wrap gap-2">
            <span className="status-chip">{event.category}</span>
            {event.sponsored ? <span className="status-chip">Sponsored</span> : null}
            {event.sourceType ? <span className="status-chip">{event.sourceType.replace(/_/g, ' ')}</span> : null}
            {event.hostCommunity ? <span className="status-chip">hosted by {event.hostCommunity.name}</span> : null}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="headline-lg">{event.name}</h1>
              <p className="body-muted mt-4 max-w-3xl">{event.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="status-chip">{event.location}</span>
                <span className="status-chip">{event.date}</span>
                <span className="status-chip">{event.time}</span>
                {event.organizer ? <span className="status-chip">{event.organizer}</span> : null}
                {event.sponsorName ? <span className="status-chip">{event.sponsorName}</span> : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
              {statusSummary.map((item) => (
                <div key={item.label} className="stat-block">
                  <span className="stat-value">{item.value}</span>
                  <span className="stat-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          {viewerUser ? (
            <div className="flex flex-wrap gap-3">
              {(['interested', 'attending', 'maybe'] as const).map((status) => (
                <button key={status} type="button" disabled={busyState === status} onClick={() => void handleRsvp(status)} className={`btn-secondary h-11 px-4 text-[11px] ${event.viewerStatus === status ? 'border-white/30 bg-white/10 text-bone' : ''}`}>
                  {busyState === status ? 'Updating…' : status}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Create account to RSVP</Link>
              <p className="text-sm text-silver/62">RSVP states become part of the social layer once you sign in.</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {event.media?.length ? (
            <div className="panel-cut p-6 md:p-8">
              <p className="eyebrow">Media</p>
              <h2 className="headline-md mt-3">Flyers, venue visuals, clips, and recap-ready assets.</h2>
              <div className="mt-6">
                <MediaGrid media={event.media} />
              </div>
            </div>
          ) : null}

          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Event profile</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="panel-blade">
                <h3>Venue</h3>
                <p className="mt-3 text-sm text-silver/70">{event.locationDetails?.address || event.location}</p>
                {event.locationDetails?.lat && event.locationDetails?.lng ? <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">{event.locationDetails.lat.toFixed(5)}, {event.locationDetails.lng.toFixed(5)}</p> : null}
              </div>
              <div className="panel-blade">
                <h3>Entry</h3>
                <p className="mt-3 text-sm text-silver/70">{[event.entryType, event.pricingType, event.venueType].filter(Boolean).join(' • ') || 'Open format'}</p>
                <p className="mt-2 text-sm text-silver/58">{[event.spectatorFriendly ? 'spectator-friendly' : '', event.familyFriendly ? 'family-suitable' : '', event.recurring ? 'recurring' : 'one-off'].filter(Boolean).join(' • ')}</p>
              </div>
              <div className="panel-blade">
                <h3>Source</h3>
                <p className="mt-3 text-sm text-silver/70">{event.sourceName || event.organizer || 'STATIK'}</p>
                {event.sourceUrl ? <a href={event.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs uppercase tracking-[0.18em] text-silver/50 hover:text-bone">View source ↗</a> : null}
              </div>
            </div>
            {(event.vehicleFocus?.length || event.tags?.length || event.hostLinks?.length) ? (
              <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
                <div className="panel-blade">
                  <h3>Focus and tags</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...(event.vehicleFocus || []), ...(event.tags || [])].map((tag) => <span key={tag} className="status-chip">{tag}</span>)}
                  </div>
                </div>
                <div className="panel-blade">
                  <h3>Host links</h3>
                  <div className="mt-3 grid gap-2">
                    {(event.hostLinks || []).map((link) => <a key={link} href={link} target="_blank" rel="noreferrer" className="text-sm text-silver/66 hover:text-bone">{link}</a>)}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {event.relatedEvents?.length ? (
            <div className="panel-cut p-6 md:p-8">
              <p className="eyebrow">Related events</p>
              <h2 className="headline-md mt-3">More from the same category, host lane, or venue pattern.</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {event.relatedEvents.map((related) => (
                  <Link key={related.id} to={`/events/${related.slug}`} className="panel-blade">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-silver/46">{related.category}</p>
                    <h3 className="mt-3">{related.name}</h3>
                    <p className="mt-3 text-sm text-silver/70">{related.location}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">{related.date} • {related.time}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          {event.hostCommunity ? (
            <div className="panel-cut p-6">
              <p className="eyebrow">Hosting group</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-bone">{event.hostCommunity.name}</h3>
              <p className="mt-3 text-sm leading-7 text-silver/68">This event is directly tied to a live community identity instead of floating as a disconnected listing.</p>
              <Link to={`/members/communities/${event.hostCommunity.slug}`} className="btn-secondary mt-5 h-11 px-4 text-[11px]">Open group page</Link>
            </div>
          ) : null}

          <div className="panel-cut p-6">
            <p className="eyebrow">Social signal</p>
            <div className="mt-4 grid gap-3">
              <div className="panel-blade"><p className="text-sm text-silver/72">Attending</p><p className="mt-2 text-2xl font-semibold text-bone">{event.notable?.attending.length || 0}</p></div>
              <div className="panel-blade"><p className="text-sm text-silver/72">Interested</p><p className="mt-2 text-2xl font-semibold text-bone">{event.notable?.interested.length || 0}</p></div>
              <div className="panel-blade"><p className="text-sm text-silver/72">Maybe</p><p className="mt-2 text-2xl font-semibold text-bone">{event.notable?.maybe.length || 0}</p></div>
            </div>
          </div>
        </aside>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
