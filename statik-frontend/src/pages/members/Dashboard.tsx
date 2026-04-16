import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarBadge from '../../components/AvatarBadge';
import EmptyPanel from '../../components/EmptyPanel';
import { networkApi } from '../../api/network';
import type { MemberHomePayload } from '../../types/network';

export default function MembersDashboardPage() {
  const [data, setData] = useState<MemberHomePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    networkApi.getMemberHome().then(setData).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <p className="eyebrow">Member hub</p>
        <h1 className="headline-lg mt-3">The real value lives inside the network.</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="stat-block"><span className="stat-value">{data?.myCounts.friends ?? 0}</span><span className="stat-label">friends</span></div>
          <div className="stat-block"><span className="stat-value">{data?.myCounts.communities ?? 0}</span><span className="stat-label">communities</span></div>
          <div className="stat-block"><span className="stat-value">{data?.myCounts.attending ?? 0}</span><span className="stat-label">attending</span></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Suggested members</p>
              <h2 className="headline-md mt-3">People worth connecting with.</h2>
            </div>
            <Link to="/members/friends" className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Friend system</Link>
          </div>
          {data?.suggestedProfiles?.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {data.suggestedProfiles.map((profile) => (
                <Link to={`/profiles/${profile.slug}`} key={profile.id} className="profile-tile">
                  <div className="flex items-center gap-3">
                    <AvatarBadge name={profile.displayName} src={profile.avatarUrl} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-bone">{profile.displayName}</p>
                        {profile.verified ? <span className="status-chip">verified</span> : null}
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{profile.primaryCar || 'No primary car yet'}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-silver/72">{profile.bio || 'No bio yet.'}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-silver/56">{profile.mutualFriends ?? 0} mutual friends</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6"><EmptyPanel eyebrow="Members" title="No suggestions yet" body="Once more members join, discovery starts to feel alive here." /></div>
          )}
        </div>

        <div className="grid gap-6">
          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Communities</p>
                <h2 className="headline-md mt-3">Jump into groups or start your own.</h2>
              </div>
              <Link to="/members/communities" className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Open communities</Link>
            </div>
            {data?.communities?.length ? (
              <div className="mt-6 grid gap-3">
                {data.communities.map((community) => (
                  <Link key={community.id} to={`/members/communities/${community.slug}`} className="panel-blade">
                    <div className="flex items-center justify-between gap-3">
                      <h3>{community.name}</h3>
                      <span className="status-chip">{community.visibility}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-silver/70">{community.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6"><EmptyPanel eyebrow="Communities" title="No communities yet" body="Create the first one and start the local scene layer yourself." /></div>
            )}
          </div>
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Upcoming events</p>
            <div className="mt-6 grid gap-3">
              {data?.upcomingEvents?.length ? data.upcomingEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.slug}`} className="panel-blade">
                  <h3>{event.name}</h3>
                  <p className="mt-3 text-sm text-silver/70">{event.location} • {event.date} • {event.time}</p>
                </Link>
              )) : <EmptyPanel eyebrow="Events" title="No approved events yet" body="Approved events will surface here for members too." />}
            </div>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
