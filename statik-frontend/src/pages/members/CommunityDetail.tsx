import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AvatarBadge from '../../components/AvatarBadge';
import EmptyPanel from '../../components/EmptyPanel';
import MediaGrid from '../../components/platform/MediaGrid';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
import { useSessionStore } from '../../store/session';
import type { CommunityDetail, CommunityPost, GarageVehicle, NetworkEvent } from '../../types/network';

function splitLines(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function MapLink({ lat, lng, label }: { lat: number; lng: number; label?: string }) {
  const href = `https://maps.google.com/?q=${lat},${lng}`;
  return <a href={href} target="_blank" rel="noreferrer" className="text-sm text-bone underline decoration-white/20 underline-offset-4">{label || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}</a>;
}

type ManageState = {
  description: string;
  region: string;
  visibility: 'public' | 'private';
  tags: string;
  rules: string;
  applicationQuestions: string;
  discoverable: boolean;
  featuredMemberUserIds: string[];
  featuredVehicleIds: string[];
};

const emptyManageState: ManageState = {
  description: '',
  region: '',
  visibility: 'public',
  tags: '',
  rules: '',
  applicationQuestions: '',
  discoverable: true,
  featuredMemberUserIds: [],
  featuredVehicleIds: [],
};

export default function CommunityDetailPage() {
  const { slug = '' } = useParams();
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const viewerProfile = useSessionStore((state) => state.viewerProfile);
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [eventId, setEventId] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postEventId, setPostEventId] = useState('');
  const [postFiles, setPostFiles] = useState<File[]>([]);
  const [postProgress, setPostProgress] = useState(0);
  const [posting, setPosting] = useState(false);
  const [requestAnswers, setRequestAnswers] = useState<string[]>([]);
  const [manage, setManage] = useState<ManageState>(emptyManageState);
  const [savingManage, setSavingManage] = useState(false);
  const [identityProgress, setIdentityProgress] = useState(0);

  const isOwner = community?.owner?.userId === viewerUser?.id;
  const isAdmin = Boolean(isOwner || community?.admins.some((admin) => admin.userId === viewerUser?.id) || viewerUser?.role === 'admin');
  const currentUserMember = useMemo(
    () => Boolean(community?.members.some((member) => member.userId === viewerUser?.id)),
    [community, viewerUser?.id],
  );

  async function load() {
    try {
      setError(null);
      const [communityPayload, eventsPayload] = await Promise.all([networkApi.getCommunity(slug), networkApi.listEvents()]);
      setCommunity(communityPayload);
      setEvents(eventsPayload);
      setManage({
        description: communityPayload.description,
        region: communityPayload.region || '',
        visibility: communityPayload.visibility,
        tags: (communityPayload.tags || []).join('\n'),
        rules: (communityPayload.rules || []).join('\n'),
        applicationQuestions: (communityPayload.applicationQuestions || []).join('\n'),
        discoverable: communityPayload.discoverable,
        featuredMemberUserIds: communityPayload.featuredMembers.map((member) => member.userId),
        featuredVehicleIds: communityPayload.featuredVehicles.map((vehicle) => vehicle.id),
      });
      setRequestAnswers(Array.from({ length: Math.max(communityPayload.applicationQuestions.length, 1) }, (_, index) => requestAnswers[index] || ''));
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const availableEvents = useMemo(
    () => events.filter((event) => event.approvalStatus === 'approved'),
    [events],
  );

  const highlightedPosts = useMemo(
    () => (community?.posts || []).filter((post) => post.pinned || post.featured),
    [community?.posts],
  );

  const visibleVehicles = useMemo(
    () => community?.memberVehicles || community?.featuredVehicles || [],
    [community?.featuredVehicles, community?.memberVehicles],
  );

  async function handleMembershipAction() {
    if (!community) return;
    try {
      setError(null);
      if (currentUserMember) {
        await networkApi.leaveCommunity(community.id);
      } else if (community.visibility === 'private') {
        await networkApi.requestCommunityAccess(community.id, requestAnswers.filter((value) => value.trim()));
      } else {
        await networkApi.joinCommunity(community.id);
      }
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function sendText(event: FormEvent<HTMLFormElement>) {
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

  async function handlePostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!community || !viewerProfile) return;
    setPosting(true);
    setPostProgress(0);
    setError(null);
    try {
      const uploadedMediaIds: string[] = [];
      for (let index = 0; index < postFiles.length; index += 1) {
        const file = postFiles[index];
        const uploaded = await uploadMediaFile(file, 'community', community.id, (value) => {
          const normalized = Math.round(((index + value / 100) / Math.max(postFiles.length, 1)) * 100);
          setPostProgress(normalized);
        });
        uploadedMediaIds.push(uploaded.id);
      }
      const updated = await networkApi.createCommunityPost(community.id, {
        caption: postCaption,
        mediaIds: uploadedMediaIds,
        linkedEventId: postEventId || undefined,
        pinned: false,
        featured: false,
      });
      setCommunity(updated);
      setPostCaption('');
      setPostEventId('');
      setPostFiles([]);
      setPostProgress(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  async function handleIdentityUpload(kind: 'avatar' | 'banner', file: File | null) {
    if (!community || !file) return;
    try {
      setIdentityProgress(0);
      const uploaded = await uploadMediaFile(file, 'community', community.id, setIdentityProgress);
      await networkApi.updateCommunity(community.id, kind === 'avatar' ? { avatarUrl: uploaded.url } : { bannerUrl: uploaded.url });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIdentityProgress(0);
    }
  }

  async function handleSaveManage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!community) return;
    setSavingManage(true);
    setError(null);
    try {
      await networkApi.updateCommunity(community.id, {
        description: manage.description,
        region: manage.region,
        visibility: manage.visibility,
        tags: splitLines(manage.tags).slice(0, 8),
        rules: splitLines(manage.rules).slice(0, 6),
        applicationQuestions: splitLines(manage.applicationQuestions).slice(0, 4),
        discoverable: manage.discoverable,
        featuredMemberUserIds: manage.featuredMemberUserIds,
        featuredVehicleIds: manage.featuredVehicleIds,
      });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingManage(false);
    }
  }

  async function handleReviewRequest(requestId: string, action: 'approve' | 'reject') {
    if (!community) return;
    try {
      await networkApi.reviewCommunityJoinRequest(community.id, requestId, action);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function togglePostFlag(post: CommunityPost, field: 'pinned' | 'featured', value: boolean) {
    if (!community) return;
    try {
      await networkApi.updateCommunityPost(community.id, post.id, { [field]: value });
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function deletePost(postId: string) {
    if (!community) return;
    try {
      await networkApi.deleteCommunityPost(community.id, postId);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function reportPost(postId: string) {
    try {
      await networkApi.reportContent({ targetType: 'community_post', targetId: postId, reason: 'Reported from community feed' });
    } catch (err: any) {
      setError(err.message);
    }
  }

  function onPostFilesChange(event: ChangeEvent<HTMLInputElement>) {
    setPostFiles(Array.from(event.target.files || []));
  }

  function toggleSelection(current: string[], value: string) {
    return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  }

  if (error && !community) return <div className="shell py-20"><EmptyPanel eyebrow="Community" title="Community unavailable" body={error} /></div>;
  if (!community) return <div className="shell py-20"><div className="panel-cut p-8">Loading community…</div></div>;

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut overflow-hidden p-0">
        <div className="h-40 w-full bg-white/5 md:h-56" style={community.bannerUrl ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.72)), url(${community.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
        <div className="p-6 md:p-8 xl:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <AvatarBadge name={community.name} src={community.avatarUrl} size="xl" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="eyebrow">Group page</p>
                  <span className="status-chip">{community.visibility}</span>
                  {isAdmin ? <span className="status-chip">managed</span> : null}
                  {!community.discoverable ? <span className="status-chip">hidden from discovery</span> : null}
                </div>
                <h1 className="headline-lg mt-3">{community.name}</h1>
                <p className="body-muted mt-4 max-w-3xl">{community.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-silver/56">
                  <span>{community.memberCount} members</span>
                  {community.region ? <span>{community.region}</span> : null}
                  {(community.tags || []).slice(0, 6).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </div>
            <div className="panel-blade min-w-[260px]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Controls</p>
              <div className="mt-4 grid gap-3">
                <button type="button" onClick={handleMembershipAction} className="btn-primary h-10 px-4 text-[11px]">
                  {currentUserMember ? 'Leave group' : community.visibility === 'private' ? (community.hasPendingRequest ? 'Request pending' : 'Request access') : 'Join group'}
                </button>
                {viewerProfile ? <Link to={`/profiles/${viewerProfile.slug}`} className="btn-secondary h-10 justify-center px-4 text-[11px]">Open your profile</Link> : null}
                {community.visibility === 'private' && !currentUserMember && community.applicationQuestions.length ? (
                  <div className="grid gap-3 border-t border-white/10 pt-3">
                    {community.applicationQuestions.map((question, index) => (
                      <label key={question} className="grid gap-2 text-sm text-silver/72">
                        <span>{question}</span>
                        <input
                          className="field-sharp"
                          value={requestAnswers[index] || ''}
                          onChange={(event) => setRequestAnswers((current) => current.map((value, valueIndex) => (valueIndex === index ? event.target.value : value)))}
                          placeholder="Your answer"
                        />
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <div className="space-y-6">
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Crew structure</p>
            <div className="mt-6 grid gap-4">
              <div className="panel-blade">
                <h3>Owner</h3>
                {community.owner ? (
                  <Link to={`/profiles/${community.owner.slug}`} className="mt-4 flex items-center gap-3">
                    <AvatarBadge name={community.owner.displayName} src={community.owner.avatarUrl} size="md" />
                    <div>
                      <p className="font-semibold text-bone">{community.owner.displayName}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{community.owner.primaryCar || 'Owner'}</p>
                    </div>
                  </Link>
                ) : <p className="mt-3 text-sm text-silver/64">Owner profile is unavailable.</p>}
              </div>
              <div className="panel-blade">
                <h3>Rules</h3>
                {(community.rules || []).length ? (
                  <ul className="mt-4 grid gap-3 text-sm leading-7 text-silver/72">
                    {community.rules.map((rule) => <li key={rule}>• {rule}</li>)}
                  </ul>
                ) : <p className="mt-3 text-sm text-silver/64">No rules added yet.</p>}
              </div>
              <div className="panel-blade">
                <h3>Hosted events</h3>
                {community.hostedEvents.length ? (
                  <div className="mt-4 grid gap-3">
                    {community.hostedEvents.map((event) => (
                      <Link key={event.id} to={`/events/${event.slug}`} className="block border border-white/10 bg-black/40 p-4">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{event.category}</p>
                        <p className="mt-2 text-base font-semibold text-bone">{event.name}</p>
                        <p className="mt-2 text-sm text-silver/68">{event.location} • {event.date} • {event.time}</p>
                      </Link>
                    ))}
                  </div>
                ) : <p className="mt-3 text-sm text-silver/64">No hosted events have been attached yet.</p>}
              </div>
            </div>
          </div>

          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Featured members</p>
                <h2 className="headline-md mt-3">Identity plates for the people shaping the room.</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{community.featuredMembers.length}</span>
            </div>
            {community.featuredMembers.length ? (
              <div className="mt-6 grid gap-3">
                {community.featuredMembers.map((member) => (
                  <Link key={member.id} to={`/profiles/${member.slug}`} className="panel-blade flex items-center gap-3">
                    <AvatarBadge name={member.displayName} src={member.avatarUrl} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-bone">{member.displayName}</p>
                        {member.verified ? <span className="status-chip">verified</span> : null}
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{member.primaryCar || 'Member'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <div className="mt-6"><EmptyPanel eyebrow="Members" title="No featured members selected" body="This group exists, but nobody has been pinned to the identity rail yet." /></div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Build wall</p>
                <h2 className="headline-md mt-3">Cars linked to this group become part of the crew archive.</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{visibleVehicles.length}</span>
            </div>
            {visibleVehicles.length ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {visibleVehicles.map((vehicle: GarageVehicle) => (
                  <div key={vehicle.id} className="panel-blade">
                    {vehicle.heroMedia?.url ? (
                      vehicle.heroMedia.kind === 'video' ? <video src={vehicle.heroMedia.url} controls className="h-44 w-full bg-black object-cover" /> : <img src={vehicle.heroMedia.url} alt={vehicle.nickname || `${vehicle.make} ${vehicle.model}`} className="h-44 w-full object-cover" />
                    ) : null}
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{vehicle.vehicleType}</p>
                        <h3 className="mt-2">{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Untitled build'}</h3>
                        <p className="mt-2 text-sm text-silver/68">{vehicle.nickname || vehicle.stage || 'Build dossier'}</p>
                      </div>
                      {vehicle.owner ? <Link to={`/profiles/${vehicle.owner.slug}`} className="text-[10px] uppercase tracking-[0.24em] text-silver/56">Owner</Link> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.22em] text-silver/54">
                      {vehicle.statusTags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="mt-6"><EmptyPanel eyebrow="Builds" title="No linked vehicles yet" body="This group does not have any member builds linked into the archive yet." /></div>}
          </div>

          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Group feed</p>
                <h2 className="headline-md mt-3">Real posts, direct uploads, event drops, and recap media.</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{community.posts.length} live</span>
            </div>

            {currentUserMember ? (
              <form onSubmit={handlePostSubmit} className="mt-6 grid gap-4 border-b border-white/10 pb-6">
                <textarea className="field-sharp min-h-[120px]" placeholder="Recap a meet, post a build shot, drop a teaser clip, or flag the next session." value={postCaption} onChange={(event) => setPostCaption(event.target.value)} required minLength={1} />
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                  <label className="panel-blade block cursor-pointer">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Direct media upload</span>
                    <input type="file" accept="image/*,video/*" multiple className="mt-3 block w-full text-sm text-silver/70" onChange={onPostFilesChange} />
                    <p className="mt-2 text-xs text-silver/56">{postFiles.length ? `${postFiles.length} file(s) selected${postProgress ? ` · ${postProgress}%` : ''}` : 'Attach images or short clips.'}</p>
                  </label>
                  <div className="grid gap-3">
                    <select className="field-sharp" value={postEventId} onChange={(event) => setPostEventId(event.target.value)}>
                      <option value="">Attach event (optional)</option>
                      {availableEvents.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
                    </select>
                    <button type="submit" className="btn-primary h-12 justify-center text-[11px] disabled:opacity-60" disabled={posting}>{posting ? 'Publishing…' : 'Publish group post'}</button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mt-6"><EmptyPanel eyebrow="Feed locked" title="Join this group to post" body="The feed is a real member layer. No fake posting surface is shown until you belong here." /></div>
            )}

            <div className="mt-6 grid gap-4">
              {community.posts.length ? community.posts.map((post) => (
                <div key={post.id} className="panel-blade">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AvatarBadge name={post.authorProfile?.displayName || 'Member'} src={post.authorProfile?.avatarUrl} size="md" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-bone">{post.authorProfile?.displayName || 'Member'}</p>
                          {post.pinned ? <span className="status-chip">pinned</span> : null}
                          {post.featured ? <span className="status-chip">featured</span> : null}
                          <span className="text-[10px] uppercase tracking-[0.24em] text-silver/50">{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-silver/72">{post.caption}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isAdmin ? (
                        <>
                          <button type="button" onClick={() => togglePostFlag(post, 'pinned', !post.pinned)} className="text-[10px] uppercase tracking-[0.24em] text-silver/54">{post.pinned ? 'Unpin' : 'Pin'}</button>
                          <button type="button" onClick={() => togglePostFlag(post, 'featured', !post.featured)} className="text-[10px] uppercase tracking-[0.24em] text-silver/54">{post.featured ? 'Unfeature' : 'Feature'}</button>
                        </>
                      ) : null}
                      {(isAdmin || post.authorUserId === viewerUser?.id) ? <button type="button" onClick={() => deletePost(post.id)} className="text-[10px] uppercase tracking-[0.24em] text-silver/54">Delete</button> : null}
                      {!isAdmin && post.authorUserId !== viewerUser?.id ? <button type="button" onClick={() => reportPost(post.id)} className="text-[10px] uppercase tracking-[0.24em] text-silver/54">Report</button> : null}
                    </div>
                  </div>
                  {post.media.length ? <div className="mt-5"><MediaGrid media={post.media} compact={post.media.length <= 2} /></div> : null}
                  {post.linkedEvent ? (
                    <Link to={`/events/${post.linkedEvent.slug}`} className="mt-5 block border border-white/10 bg-black/40 p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Linked event</p>
                      <p className="mt-2 text-base font-semibold text-bone">{post.linkedEvent.name}</p>
                      <p className="mt-2 text-sm text-silver/68">{post.linkedEvent.location} • {post.linkedEvent.date} • {post.linkedEvent.time}</p>
                    </Link>
                  ) : null}
                </div>
              )) : (
                <EmptyPanel eyebrow="Feed" title="This group has not posted anything yet" body="The room exists, but there is no approved media or recap content in the feed yet." />
              )}
            </div>
          </div>
        </div>
      </div>

      {isAdmin ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Identity management</p>
            <div className="mt-6 grid gap-4">
              <label className="panel-blade block cursor-pointer">
                <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Replace avatar</span>
                <input type="file" accept="image/*,video/*" className="mt-3 block w-full text-sm text-silver/70" onChange={(event) => handleIdentityUpload('avatar', event.target.files?.[0] || null)} />
                <p className="mt-2 text-xs text-silver/56">{identityProgress ? `${identityProgress}%` : 'Upload a new group mark.'}</p>
              </label>
              <label className="panel-blade block cursor-pointer">
                <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Replace banner</span>
                <input type="file" accept="image/*,video/*" className="mt-3 block w-full text-sm text-silver/70" onChange={(event) => handleIdentityUpload('banner', event.target.files?.[0] || null)} />
                <p className="mt-2 text-xs text-silver/56">Use cinematic media or a clean brand surface.</p>
              </label>
            </div>
          </div>

          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Manage group</p>
            <form className="mt-6 grid gap-4" onSubmit={handleSaveManage}>
              <textarea className="field-sharp min-h-[110px]" value={manage.description} onChange={(event) => setManage((current) => ({ ...current, description: event.target.value }))} placeholder="Description" required minLength={10} />
              <div className="grid gap-4 md:grid-cols-2">
                <input className="field-sharp" value={manage.region} onChange={(event) => setManage((current) => ({ ...current, region: event.target.value }))} placeholder="Region" />
                <select className="field-sharp" value={manage.visibility} onChange={(event) => setManage((current) => ({ ...current, visibility: event.target.value as 'public' | 'private' }))}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <textarea className="field-sharp min-h-[88px]" value={manage.tags} onChange={(event) => setManage((current) => ({ ...current, tags: event.target.value }))} placeholder="Tags — one per line" />
              <textarea className="field-sharp min-h-[88px]" value={manage.rules} onChange={(event) => setManage((current) => ({ ...current, rules: event.target.value }))} placeholder="Rules — one per line" />
              <textarea className="field-sharp min-h-[88px]" value={manage.applicationQuestions} onChange={(event) => setManage((current) => ({ ...current, applicationQuestions: event.target.value }))} placeholder="Application questions — one per line" />
              <label className="flex items-center gap-3 text-sm text-silver/72">
                <input type="checkbox" checked={manage.discoverable} onChange={(event) => setManage((current) => ({ ...current, discoverable: event.target.checked }))} />
                Show this group in discovery.
              </label>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="panel-blade">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Featured members</p>
                  <div className="mt-4 grid gap-3">
                    {community.members.length ? community.members.map((member) => (
                      <label key={member.id} className="flex items-center gap-3 text-sm text-silver/72">
                        <input type="checkbox" checked={manage.featuredMemberUserIds.includes(member.userId)} onChange={() => setManage((current) => ({ ...current, featuredMemberUserIds: toggleSelection(current.featuredMemberUserIds, member.userId) }))} />
                        <span>{member.displayName}</span>
                      </label>
                    )) : <p className="text-sm text-silver/64">No members available yet.</p>}
                  </div>
                </div>
                <div className="panel-blade">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Featured vehicles</p>
                  <div className="mt-4 grid gap-3">
                    {visibleVehicles.length ? visibleVehicles.map((vehicle) => (
                      <label key={vehicle.id} className="flex items-center gap-3 text-sm text-silver/72">
                        <input type="checkbox" checked={manage.featuredVehicleIds.includes(vehicle.id)} onChange={() => setManage((current) => ({ ...current, featuredVehicleIds: toggleSelection(current.featuredVehicleIds, vehicle.id) }))} />
                        <span>{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || vehicle.nickname || 'Untitled build'}</span>
                      </label>
                    )) : <p className="text-sm text-silver/64">No visible vehicles linked to this group yet.</p>}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary h-12 justify-center text-[11px] disabled:opacity-60" disabled={savingManage}>{savingManage ? 'Saving…' : 'Save group settings'}</button>
            </form>
          </div>
        </div>
      ) : null}

      {isAdmin && community.joinRequests.length ? (
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Join requests</p>
              <h2 className="headline-md mt-3">Private access is deliberate and reviewable.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{community.joinRequests.length} pending</span>
          </div>
          <div className="mt-6 grid gap-4">
            {community.joinRequests.map((request) => (
              <div key={request.id} className="panel-blade">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <AvatarBadge name={request.profile?.displayName || 'Member'} src={request.profile?.avatarUrl} size="md" />
                      <div>
                        <p className="font-semibold text-bone">{request.profile?.displayName || 'Member'}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{new Date(request.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {request.answers.length ? (
                      <div className="mt-4 grid gap-2 text-sm leading-7 text-silver/72">
                        {request.answers.map((answer, index) => <p key={`${request.id}-${index}`}>{answer}</p>)}
                      </div>
                    ) : <p className="mt-4 text-sm text-silver/64">No answers supplied.</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleReviewRequest(request.id, 'approve')} className="btn-primary h-10 px-4 text-[11px]">Approve</button>
                    <button type="button" onClick={() => handleReviewRequest(request.id, 'reject')} className="btn-secondary h-10 px-4 text-[11px]">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="panel-cut p-6 md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Group chat</p>
            <h2 className="headline-md mt-3">Keep the live room intact while the feed grows around it.</h2>
          </div>
          {highlightedPosts.length ? <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{highlightedPosts.length} pinned / featured post(s)</span> : null}
        </div>

        {!currentUserMember ? (
          <div className="mt-6"><EmptyPanel eyebrow="Chat locked" title="Join this community to speak" body="Messages stay member-only instead of pretending the room is open." /></div>
        ) : (
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
              <textarea className="field-sharp min-h-[120px]" placeholder="Send a message" value={text} onChange={(event) => setText(event.target.value)} />
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary h-11 px-4 text-[11px]">Send message</button>
                <select className="field-sharp max-w-[260px]" value={eventId} onChange={(event) => setEventId(event.target.value)}>
                  <option value="">Attach an event</option>
                  {availableEvents.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
                </select>
                <button type="button" onClick={sendEventMention} className="btn-secondary h-11 px-4 text-[11px]">Share event</button>
                <input className="field-sharp max-w-[220px]" placeholder="Location label" value={locationLabel} onChange={(event) => setLocationLabel(event.target.value)} />
                <button type="button" onClick={shareLocation} className="btn-secondary h-11 px-4 text-[11px]">Share location</button>
              </div>
            </form>
          </>
        )}
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
