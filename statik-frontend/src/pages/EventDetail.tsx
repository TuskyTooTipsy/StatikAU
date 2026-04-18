import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import AvatarBadge from '../components/AvatarBadge';
import { networkApi } from '../api/network';
import { useSessionStore } from '../store/session';
import type { NetworkEvent } from '../types/network';

function attendeeStrip(title: string, items: any[]) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-[-0.04em] text-bone">{title}</h3>
        <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{items.length}</span>
      </div>
      {items.length ? (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scroll">
          {items.map((profile) => (
            <Link key={profile.id} to={`/profiles/${profile.slug}`} className="min-w-[220px] panel-blade">
              <div className="flex items-center gap-3">
                <AvatarBadge name={profile.displayName} src={profile.avatarUrl} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-bone">{profile.displayName}</p>
                    {profile.verified ? <span className="status-chip">verified</span> : null}
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{profile.primaryCar || 'Member'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyPanel eyebrow={title} title={`Nobody marked ${title.toLowerCase()} yet`} body="That state will show up here as soon as real members interact with the event." />
      )}
    </div>
  );
}

export default function EventDetailPage() {
  const { slug = '' } = useParams();
  const [event, setEvent] = useState<NetworkEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const viewerUser = useSessionStore((state) => state.viewerUser);

  useEffect(() => {
    networkApi.getEvent(slug).then(setEvent).catch((err) => setError(err.message));
  }, [slug]);

  async function handleRsvp(status: 'interested' | 'attending' | 'maybe') {
    if (!event) return;
    try {
      const updated = await networkApi.rsvpEvent(event.id, status);
      setEvent(updated);
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!event && !error) {
    return <div className="shell py-20"><div className="panel-cut p-8">Loading event…</div></div>;
  }

  if (error) {
    return <div className="shell py-20"><EmptyPanel eyebrow="Event" title="This event is unavailable" body={error} /></div>;
  }

  return event ? (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">{event.category}</p>
            <h1 className="headline-lg mt-3">{event.name}</h1>
            <p className="mt-4 text-base text-silver/72">{event.location} • {event.date} • {event.time}</p>
            <p className="body-muted mt-5 max-w-3xl">{event.description}</p>
            {event.hostCommunity ? <p className="mt-4 text-xs uppercase tracking-[0.22em] text-silver/56">Hosted by <Link to={`/members/communities/${event.hostCommunity.slug}`} className="text-bone">{event.hostCommunity.name}</Link></p> : null}
          </div>
          <div className="panel-cut p-5">
            <p className="eyebrow">Live intent</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="stat-block"><span className="stat-value">{event.counts?.attending ?? 0}</span><span className="stat-label">attending</span></div>
              <div className="stat-block"><span className="stat-value">{event.counts?.interested ?? 0}</span><span className="stat-label">interested</span></div>
              <div className="stat-block"><span className="stat-value">{event.counts?.maybe ?? 0}</span><span className="stat-label">maybe</span></div>
            </div>
            {viewerUser ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => handleRsvp('interested')} className={`btn-secondary h-11 px-4 text-[11px] ${event.viewerStatus === 'interested' ? 'ring-1 ring-white/30' : ''}`}>Interested</button>
                <button type="button" onClick={() => handleRsvp('attending')} className={`btn-primary h-11 px-4 text-[11px] ${event.viewerStatus === 'attending' ? 'ring-1 ring-[#efefef]/30' : ''}`}>Attending</button>
                <button type="button" onClick={() => handleRsvp('maybe')} className={`btn-secondary h-11 px-4 text-[11px] ${event.viewerStatus === 'maybe' ? 'ring-1 ring-white/30' : ''}`}>Maybe</button>
              </div>
            ) : (
              <div className="mt-5"><Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Sign up to react</Link></div>
            )}
          </div>
        </div>
      </div>

      {attendeeStrip('Attending', event.notable?.attending || [])}
      {attendeeStrip('Interested', event.notable?.interested || [])}
      {attendeeStrip('Maybe', event.notable?.maybe || [])}

      <div className="panel-cut p-6 md:p-8">
        <p className="eyebrow">Discussion flow</p>
        <h2 className="headline-md mt-3">Event mentions are built to be dropped into community chat.</h2>
        <p className="body-muted mt-4 max-w-3xl">Members can attach this event directly inside community posts and live group chat, so the planning layer lives with the crew instead of dying in isolated DMs.</p>
      </div>
    </div>
  ) : null;
}
