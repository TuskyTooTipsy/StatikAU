import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AvatarBadge from '../components/AvatarBadge';
import EmptyPanel from '../components/EmptyPanel';
import { networkApi } from '../api/network';
import { useSessionStore } from '../store/session';
import type { NetworkProfile } from '../types/network';

export default function PublicProfilePage() {
  const { slug = '' } = useParams();
  const viewerUser = useSessionStore((state) => state.viewerUser);
  const [profile, setProfile] = useState<NetworkProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  useEffect(() => {
    networkApi.getProfile(slug, viewerUser?.id).then(setProfile).catch((err) => setError(err.message));
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

  if (error) return <div className="shell py-20"><EmptyPanel eyebrow="Profile" title="Profile unavailable" body={error} /></div>;
  if (!profile) return <div className="shell py-20"><div className="panel-cut p-8">Loading profile…</div></div>;

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
          <div className="flex items-center gap-5">
            <AvatarBadge name={profile.displayName} src={profile.avatarUrl} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="headline-md">{profile.displayName}</h1>
                {profile.verified ? <span className="status-chip">verified</span> : null}
                {profile.promoted ? <span className="status-chip">promoted</span> : null}
              </div>
              <p className="mt-3 text-sm uppercase tracking-[0.22em] text-silver/56">{profile.location || 'Location not set'} • {profile.primaryCar || 'Primary car not set'}</p>
            </div>
          </div>
          <div>
            <p className="body-muted">{profile.bio || 'This member has not written a bio yet.'}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-silver/56">
              <span>{profile.stats?.friendCount ?? profile.friendCount ?? 0} friends</span>
              <span>{profile.stats?.communityCount ?? 0} communities</span>
              <span>{profile.stats?.eventAttendanceCount ?? 0} event check-ins</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {viewerUser ? <button type="button" onClick={handleFriendRequest} className="btn-primary h-11 px-4 text-[11px]">Send friend request</button> : <Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Join to connect</Link>}
            </div>
            {requestMessage ? <p className="mt-4 text-sm text-silver/70">{requestMessage}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
