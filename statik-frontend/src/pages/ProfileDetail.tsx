import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AvatarBadge from '../components/AvatarBadge';
import EmptyPanel from '../components/EmptyPanel';
import MediaGrid from '../components/platform/MediaGrid';
import { networkApi } from '../api/network';
import { useSessionStore } from '../store/session';
import type { GarageVehicle, NetworkProfile, ProfilePost } from '../types/network';

export default function PublicProfilePage() {
  const { slug = '' } = useParams();
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const [profile, setProfile] = useState<NetworkProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [activeVehicle, setActiveVehicle] = useState<GarageVehicle | null>(null);
  const [activePost, setActivePost] = useState<ProfilePost | null>(null);

  async function load() {
    try {
      setProfile(await networkApi.getProfile(slug, viewerUser?.id, 'profile-page'));
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [slug, viewerUser?.id]);

  async function handleFriendRequest() {
    if (!profile) return;
    try {
      await networkApi.sendFriendRequest(profile.userId);
      setRequestMessage('Friend request sent.');
    } catch (err: any) {
      setRequestMessage(err.message);
    }
  }

  async function openVehicle(vehicle: GarageVehicle) {
    setActiveVehicle(vehicle);
    await networkApi.trackAnalytics({ eventType: 'vehicle_view', targetType: 'vehicle', targetId: vehicle.id, source: 'profile_detail' }).catch(() => undefined);
  }

  async function openPost(post: ProfilePost) {
    setActivePost(post);
    await networkApi.trackAnalytics({ eventType: 'profile_post_view', targetType: 'profile_post', targetId: post.id, source: 'profile_detail' }).catch(() => undefined);
  }

  if (error) return <div className="shell py-20"><EmptyPanel eyebrow="Profile" title="Profile unavailable" body={error} /></div>;
  if (!profile) return <div className="shell py-20"><div className="panel-cut p-8">Loading profile…</div></div>;

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut overflow-hidden p-0">
        {profile.bannerUrl ? <img src={profile.bannerUrl} alt={`${profile.displayName} cover`} className="h-48 w-full object-cover md:h-64" /> : <div className="h-32 w-full bg-white/[0.03] md:h-40" />}
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
          <div className="flex items-center gap-5">
            <AvatarBadge name={profile.displayName} src={profile.avatarUrl} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="headline-md">{profile.displayName}</h1>
                {profile.verified ? <span className="status-chip">verified</span> : null}
                {profile.promoted ? <span className="status-chip">promoted</span> : null}
              </div>
              <p className="mt-3 text-sm uppercase tracking-[0.22em] text-silver/56">{profile.location || 'Location not set'} • {profile.primaryCar || 'Primary machine not set'}</p>
              {profile.sceneTags?.length ? <div className="mt-3 flex flex-wrap gap-2">{profile.sceneTags.map((tag) => <span key={tag} className="status-chip">{tag}</span>)}</div> : null}
            </div>
          </div>
          <div>
            <p className="body-muted">{profile.bio || 'This member has not written a bio yet.'}</p>
            {profile.about ? <p className="mt-4 text-sm leading-7 text-silver/68">{profile.about}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-silver/56">
              <span>{profile.stats?.friendCount ?? profile.friendCount ?? 0} friends</span>
              <span>{profile.stats?.communityCount ?? 0} groups</span>
              <span>{profile.stats?.vehicleCount ?? 0} vehicles</span>
              <span>{profile.stats?.postCount ?? 0} posts</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {viewerUser ? <button type="button" onClick={handleFriendRequest} className="btn-primary h-11 px-4 text-[11px]">Send friend request</button> : <Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Join to connect</Link>}
              {profile.shortLinks?.[0]?.shortUrl ? <a href={profile.shortLinks[0].shortUrl} target="_blank" rel="noreferrer" className="btn-secondary h-11 px-4 text-[11px]">Open share link</a> : null}
            </div>
            {requestMessage ? <p className="mt-4 text-sm text-silver/70">{requestMessage}</p> : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Garage</p>
              <h2 className="headline-md mt-3">Build dossier bays</h2>
            </div>
            {profile.currentlyBuilding ? <span className="status-chip">{profile.currentlyBuilding}</span> : null}
          </div>
          <div className="mt-6 grid gap-4">
            {profile.garage?.length ? profile.garage.map((vehicle) => (
              <button type="button" key={vehicle.id} onClick={() => void openVehicle(vehicle)} className="panel-blade text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3>{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}</h3>
                    <p className="mt-2 text-sm text-silver/70">{vehicle.trim || 'No trim'} • {vehicle.stage || 'No stage set'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">{vehicle.statusTags.map((tag) => <span key={tag} className="status-chip">{tag}</span>)}</div>
                </div>
                <p className="mt-3 text-sm leading-7 text-silver/72">{vehicle.description || 'No build notes yet.'}</p>
                {vehicle.heroMedia ? <div className="mt-4 overflow-hidden border border-white/10"><img src={vehicle.heroMedia.url} alt={vehicle.heroMedia.altText || vehicle.heroMedia.displayTitle || `${vehicle.nickname || vehicle.model || 'Vehicle'} media`} className="h-56 w-full object-cover" /></div> : null}
              </button>
            )) : <EmptyPanel eyebrow="Garage" title="No vehicles added yet" body="This member has not published any machine dossiers yet." />}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Affiliations</p>
            <div className="mt-4 grid gap-3">
              {profile.affiliations?.length ? profile.affiliations.map((item) => (
                <Link key={item.id} to={`/members/communities/${item.slug}`} className="panel-blade flex items-center justify-between gap-3">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-silver/50">{item.role} • {item.visibility}</p>
                  </div>
                  {item.region ? <span className="status-chip">{item.region}</span> : null}
                </Link>
              )) : <p className="text-sm text-silver/60">No visible group affiliations.</p>}
            </div>
          </div>
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Share rails</p>
            <div className="mt-4 grid gap-3">
              {profile.shortLinks?.length ? profile.shortLinks.map((link) => (
                <div key={link.id} className="panel-blade">
                  <h3>{link.targetType}</h3>
                  <p className="mt-2 text-sm text-silver/70 break-all">{link.shortUrl}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-silver/50">{link.clickCount} clicks • {link.qrScanCount} qr scans</p>
                </div>
              )) : <p className="text-sm text-silver/60">No share links claimed yet.</p>}
            </div>
          </div>
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Profile traction</p>
            {profile.analytics?.visibility === 'public' ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="stat-block"><span className="stat-value">{profile.analytics.profileViews ?? 0}</span><span className="stat-label">views</span></div>
                <div className="stat-block"><span className="stat-value">{profile.analytics.uniqueVisitors ?? 0}</span><span className="stat-label">unique visitors</span></div>
                <div className="stat-block"><span className="stat-value">{profile.analytics.garageViews ?? 0}</span><span className="stat-label">garage views</span></div>
                <div className="stat-block"><span className="stat-value">{profile.analytics.qrScans ?? 0}</span><span className="stat-label">qr scans</span></div>
              </div>
            ) : <p className="text-sm text-silver/60">This member keeps analytics private.</p>}
          </div>
        </div>
      </div>

      <div className="panel-cut p-6 md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Profile posts</p>
            <h2 className="headline-md mt-3">Recent media + build updates</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {profile.posts?.length ? profile.posts.map((post) => (
            <button key={post.id} type="button" onClick={() => void openPost(post)} className="panel-blade text-left">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.22em] text-silver/50">{new Date(post.createdAt).toLocaleString()}</p>
                {post.pinned ? <span className="status-chip">pinned</span> : null}
              </div>
              <p className="mt-3 text-sm leading-7 text-silver/72">{post.caption}</p>
              {post.media.length ? <div className="mt-4"><MediaGrid media={post.media} compact /></div> : null}
            </button>
          )) : <EmptyPanel eyebrow="Posts" title="No profile posts yet" body="No media updates have been published on this profile yet." />}
        </div>
      </div>

      {activeVehicle ? (
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Active dossier</p>
              <h2 className="headline-md mt-3">{[activeVehicle.year, activeVehicle.make, activeVehicle.model].filter(Boolean).join(' ')}</h2>
            </div>
            <button type="button" onClick={() => setActiveVehicle(null)} className="btn-secondary h-10 px-4 text-[11px]">Close</button>
          </div>
          <p className="mt-4 text-sm leading-7 text-silver/72">{activeVehicle.description || 'No build notes yet.'}</p>
          {activeVehicle.modTags.length ? <div className="mt-4 flex flex-wrap gap-2">{activeVehicle.modTags.map((tag) => <span key={tag} className="status-chip">{tag}</span>)}</div> : null}
          {activeVehicle.media?.length ? <div className="mt-6"><MediaGrid media={activeVehicle.media} /></div> : null}
        </div>
      ) : null}

      {activePost ? (
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Post detail</p>
              <h2 className="headline-md mt-3">{new Date(activePost.createdAt).toLocaleDateString()}</h2>
            </div>
            <button type="button" onClick={() => setActivePost(null)} className="btn-secondary h-10 px-4 text-[11px]">Close</button>
          </div>
          <p className="mt-4 text-sm leading-7 text-silver/72">{activePost.caption}</p>
          {activePost.media.length ? <div className="mt-6"><MediaGrid media={activePost.media} /></div> : null}
        </div>
      ) : null}
    </div>
  );
}
