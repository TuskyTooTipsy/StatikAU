import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AvatarBadge from '../../components/AvatarBadge';
import EmptyPanel from '../../components/EmptyPanel';
import { networkApi } from '../../api/network';
import { useSessionStore } from '../../store/session';
import type { CommunityDetail, NetworkEvent } from '../../types/network';

function MapLink({ lat, lng, label }: { lat: number; lng: number; label?: string }) {
  const href = `https://maps.google.com/?q=${lat},${lng}`;
  return <a href={href} target="_blank" rel="noreferrer" className="text-sm text-bone underline decoration-white/20 underline-offset-4">{label || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}</a>;
}

export default function CommunityDetailPage() {
  const { slug = '' } = useParams();
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [eventId, setEventId] = useState('');
  const [locationLabel, setLocationLabel] = useState('');

  const isOwner = community?.owner?.userId === viewerUser?.id;
  const isAdmin = isOwner || !!community?.admins.some((admin) => admin.userId === viewerUser?.id) || viewerUser?.role === 'admin';

  async function load() {
    try {
      const [communityPayload, eventsPayload] = await Promise.all([networkApi.getCommunity(slug), networkApi.listEvents()]);
      setCommunity(communityPayload);
      setEvents(eventsPayload);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, [slug]);

  const currentUserMember = useMemo(() => community?.members.some((member) => member.userId === viewerUser?.id), [community, viewerUser?.id]);

  async function sendText(event: FormEvent) {
    event.preventDefault();
    if (!community) return;
    try {
      const updated = await networkApi.sendCommunityMessage(community.id, { type: 'text', text });
      setCommunity(updated);
      setText('');
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function sendEventMention() {
    if (!community || !eventId) return;
    try {
      const updated = await networkApi.sendCommunityMessage(community.id, { type: 'event', text: '', eventId });
      setCommunity(updated);
      setEventId('');
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function shareLocation() {
    if (!community || !navigator.geolocation) {
      setError('Geolocation is not available on this device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const updated = await networkApi.sendCommunityMessage(community.id, {
          type: 'location',
          text: '',
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: locationLabel || 'Shared location',
          },
        });
        setCommunity(updated);
        setLocationLabel('');
      } catch (err: any) {
        setError(err.message);
      }
    }, () => setError('Location permission was denied.'));
  }

  if (error && !community) return <div className="shell py-20"><EmptyPanel eyebrow="Community" title="Community unavailable" body={error} /></div>;
  if (!community) return <div className="shell py-20"><div className="panel-cut p-8">Loading community…</div></div>;

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="eyebrow">Community</p>
            <h1 className="headline-lg mt-3">{community.name}</h1>
            <p className="body-muted mt-4 max-w-3xl">{community.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-silver/56">{community.memberCount} members • {community.visibility}</p>
          </div>
          <div className="panel-blade min-w-[240px]">
            <h3>Controls</h3>
            <div className="mt-4 grid gap-3">
              {currentUserMember ? <button type="button" onClick={async () => { await networkApi.leaveCommunity(community.id); load(); }} className="btn-secondary h-10 px-4 text-[11px]">Leave community</button> : <button type="button" onClick={async () => { await networkApi.joinCommunity(community.id); load(); }} className="btn-primary h-10 px-4 text-[11px]">Join community</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Members</p>
            <div className="mt-6 grid gap-3">
              {community.members.map((member) => (
                <div key={member.id} className="panel-blade">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AvatarBadge name={member.displayName} src={member.avatarUrl} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-bone">{member.displayName}</p>
                          {community.owner?.id === member.id ? <span className="status-chip">owner</span> : null}
                          {community.admins.some((admin) => admin.id === member.id) ? <span className="status-chip">admin</span> : null}
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{member.primaryCar || 'Member'}</p>
                      </div>
                    </div>
                    {isAdmin && member.userId !== viewerUser?.id && community.owner?.userId !== member.userId ? (
                      <div className="flex flex-wrap gap-2">
                        {isOwner ? <button type="button" onClick={async () => { await networkApi.updateCommunityAdmin(community.id, { userId: member.userId, action: community.admins.some((admin) => admin.id === member.id) ? 'demote' : 'promote' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{community.admins.some((admin) => admin.id === member.id) ? 'Demote' : 'Promote'}</button> : null}
                        <button type="button" onClick={async () => { await networkApi.kickCommunityMember(community.id, member.userId); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Kick</button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Group chat</p>
              <h2 className="headline-md mt-3">Real messages, event drops, and location sharing.</h2>
            </div>
          </div>

          {!currentUserMember ? <div className="mt-6"><EmptyPanel eyebrow="Chat locked" title="Join this community to post" body="Messages are real membership-only chat, not fake preview content." /></div> : (
            <>
              <div className="mt-6 grid gap-3">
                {community.messages.length ? community.messages.map((message) => (
                  <div key={message.id} className="panel-blade">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <AvatarBadge name={message.profile?.displayName || 'Member'} src={message.profile?.avatarUrl} size="sm" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-bone">{message.profile?.displayName || 'Member'}</p>
                            <span className="text-[10px] uppercase tracking-[0.22em] text-silver/50">{new Date(message.createdAt).toLocaleString()}</span>
                          </div>
                          {message.type === 'text' ? <p className="mt-3 text-sm leading-7 text-silver/72">{message.text}</p> : null}
                          {message.type === 'event' && message.event ? (
                            <div className="mt-3 border border-white/10 bg-black/40 p-4">
                              <p className="text-[10px] uppercase tracking-[0.24em] text-silver/50">Event mention</p>
                              <p className="mt-2 text-base font-semibold text-bone">{message.event.name}</p>
                              <p className="mt-2 text-sm text-silver/70">{message.event.location} • {message.event.date} • {message.event.time}</p>
                            </div>
                          ) : null}
                          {message.type === 'location' && message.location ? (
                            <div className="mt-3 border border-white/10 bg-black/40 p-4">
                              <p className="text-[10px] uppercase tracking-[0.24em] text-silver/50">Location shared</p>
                              <div className="mt-2"><MapLink lat={message.location.lat} lng={message.location.lng} label={message.location.label} /></div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {(message.userId === viewerUser?.id || isAdmin) ? <button type="button" onClick={async () => { await networkApi.deleteCommunityMessage(community.id, message.id); load(); }} className="text-[10px] uppercase tracking-[0.24em] text-silver/54">Delete</button> : null}
                    </div>
                  </div>
                )) : <EmptyPanel eyebrow="Chat" title="No messages yet" body="The room is live, but nobody has spoken yet." />}
              </div>

              <form onSubmit={sendText} className="mt-6 grid gap-3 border-t border-white/10 pt-6">
                <textarea className="field-sharp min-h-[120px]" placeholder="Send a message" value={text} onChange={(e) => setText(e.target.value)} />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary h-11 px-4 text-[11px]">Send message</button>
                  <select className="field-sharp max-w-[260px]" value={eventId} onChange={(e) => setEventId(e.target.value)}>
                    <option value="">Attach an event</option>
                    {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
                  </select>
                  <button type="button" onClick={sendEventMention} className="btn-secondary h-11 px-4 text-[11px]">Share event</button>
                  <input className="field-sharp max-w-[220px]" placeholder="Location label" value={locationLabel} onChange={(e) => setLocationLabel(e.target.value)} />
                  <button type="button" onClick={shareLocation} className="btn-secondary h-11 px-4 text-[11px]">Share location</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
