import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarBadge from '../../components/AvatarBadge';
import EmptyPanel from '../../components/EmptyPanel';
import { networkApi } from '../../api/network';
import { useSessionStore } from '../../store/session';
import type { MemberHomePayload } from '../../types/network';

export default function MembersDashboardPage() {
  const [data, setData] = useState<MemberHomePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const viewerProfile = useSessionStore((state) => state.viewerProfile);

  useEffect(() => {
    networkApi.getMemberHome().then(setData).catch((err: any) => setError(err.message));
  }, []);

  const publicRooms = useMemo(() => (data?.communities || []).filter((community) => community.visibility === 'public'), [data?.communities]);

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <div>
            <p className="eyebrow">Member hub</p>
            <h1 className="headline-lg mt-3">Your network value is now tied to your profile, garage, groups, and visibility.</h1>
            <p className="body-muted mt-4 max-w-3xl">
              The public layer gets attention. The member layer turns that attention into belonging, attendance, and build reputation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="stat-block"><span className="stat-value">{data?.myCounts.friends ?? 0}</span><span className="stat-label">friends</span></div>
            <div className="stat-block"><span className="stat-value">{data?.myCounts.communities ?? 0}</span><span className="stat-label">groups</span></div>
            <div className="stat-block"><span className="stat-value">{data?.myCounts.attending ?? 0}</span><span className="stat-label">attending</span></div>
            <div className="stat-block"><span className="stat-value">{data?.myCounts.vehicles ?? 0}</span><span className="stat-label">builds</span></div>
            <div className="stat-block"><span className="stat-value">{data?.myCounts.posts ?? 0}</span><span className="stat-label">posts</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Next moves</p>
                <h2 className="headline-md mt-3">Push your side of the network further.</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link to="/members/garage" className="panel-blade">
                <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Garage system</p>
                <h3 className="mt-3">Add or refine your builds</h3>
                <p className="mt-3 text-sm leading-7 text-silver/72">Turn your cars, bikes, or trucks into real dossiers with media, status tags, and linked groups.</p>
              </Link>
              <Link to="/members/posts" className="panel-blade">
                <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Profile media</p>
                <h3 className="mt-3">Post direct media updates</h3>
                <p className="mt-3 text-sm leading-7 text-silver/72">Short clips, detail shots, and recap posts now live directly on your profile.</p>
              </Link>
              <Link to="/members/links" className="panel-blade">
                <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Share tools</p>
                <h3 className="mt-3">Claim your short links</h3>
                <p className="mt-3 text-sm leading-7 text-silver/72">Profiles, garages, groups, and events now have trackable sharing rails.</p>
              </Link>
              <Link to="/members/analytics" className="panel-blade">
                <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Visibility</p>
                <h3 className="mt-3">Watch profile traction</h3>
                <p className="mt-3 text-sm leading-7 text-silver/72">See who is finding your profile, builds, and posts through real tracked activity.</p>
              </Link>
            </div>
          </div>

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
                          {profile.promoted ? <span className="status-chip">promoted</span> : null}
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{profile.primaryCar || 'No primary build set'}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-silver/72">{profile.bio || 'No bio yet.'}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-silver/56">
                      <span>{profile.mutualFriends ?? 0} mutual</span>
                      <span>{profile.stats?.communityCount ?? 0} groups</span>
                      <span>{profile.stats?.vehicleCount ?? 0} builds</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6"><EmptyPanel eyebrow="Members" title="No suggestions yet" body="Once more real members build out profiles and garages, discovery starts to feel alive here." /></div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Your groups</p>
                <h2 className="headline-md mt-3">Crew pages, hosted events, and member rooms.</h2>
              </div>
              <Link to="/members/communities" className="text-[11px] uppercase tracking-[0.24em] text-silver/56">Open groups</Link>
            </div>
            {data?.communities?.length ? (
              <div className="mt-6 grid gap-3">
                {data.communities.map((community) => (
                  <Link key={community.id} to={`/members/communities/${community.slug}`} className="panel-blade">
                    <div className="flex items-center justify-between gap-3">
                      <h3>{community.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="status-chip">{community.visibility}</span>
                        {community.isMember ? <span className="status-chip">in</span> : null}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-silver/70">{community.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-silver/56">
                      <span>{community.memberCount} members</span>
                      {community.region ? <span>{community.region}</span> : null}
                      {(community.tags || []).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6"><EmptyPanel eyebrow="Groups" title="No groups yet" body="Create the first one and start a real crew identity instead of waiting for one to appear." /></div>
            )}
          </div>

          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Upcoming events</p>
                <h2 className="headline-md mt-3">Where your next attendance signal can come from.</h2>
              </div>
              <Link to="/events" className="text-[11px] uppercase tracking-[0.24em] text-silver/56">All events</Link>
            </div>
            <div className="mt-6 grid gap-3">
              {data?.upcomingEvents?.length ? data.upcomingEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.slug}`} className="panel-blade">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{event.category}</p>
                      <h3 className="mt-2">{event.name}</h3>
                      <p className="mt-3 text-sm text-silver/70">{event.location} • {event.date} • {event.time}</p>
                      {event.hostCommunity ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-silver/54">Hosted by {event.hostCommunity.name}</p> : null}
                    </div>
                    <div className="text-right text-xs uppercase tracking-[0.22em] text-silver/56">
                      <div>{event.counts?.attending ?? 0} attending</div>
                      <div className="mt-1">{event.counts?.interested ?? 0} interested</div>
                    </div>
                  </div>
                </Link>
              )) : <EmptyPanel eyebrow="Events" title="No approved events yet" body="Approved events will surface here as soon as the live calendar has them." />}
            </div>
          </div>

          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Outside layer</p>
            <h2 className="headline-md mt-3">Public discovery that can still pull people inside.</h2>
            {publicRooms?.length ? (
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.22em] text-silver/54">
                {publicRooms.slice(0, 8).map((room) => <span key={room.id} className="status-chip">{room.name}</span>)}
              </div>
            ) : <p className="mt-4 text-sm text-silver/64">No public rooms are visible yet.</p>}
            {viewerProfile ? <Link to={`/profiles/${viewerProfile.slug}`} className="btn-secondary mt-6 h-11 px-4 text-[11px]">Open public profile</Link> : null}
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
