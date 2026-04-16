import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import AvatarBadge from '../components/AvatarBadge';
import { networkApi } from '../api/network';
import type { PublicPlatformPayload } from '../types/network';

export default function Home() {
  const [data, setData] = useState<PublicPlatformPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    networkApi.getPublicPlatform().then(setData).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="pb-16 pt-8 md:pt-10">
      <section className="shell">
        <div className="hero-cut overflow-hidden p-6 md:p-8 xl:p-12">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div className="space-y-7">
              <div className="space-y-4">
                <p className="eyebrow">STATIK / events-first / members behind the gate</p>
                <h1 className="headline-xl max-w-5xl">Sharper, darker, and built to turn public attention into real scene membership.</h1>
                <p className="body-muted max-w-3xl text-base md:text-lg">The homepage is the invitation. The real layer lives inside: friend connections, event intent, communities, and group chat for people who actually want to be part of the culture.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/join" className="btn-primary h-12 px-6 text-[11px]">Create account</Link>
                <Link to="/events" className="btn-secondary h-12 px-6 text-[11px]">View events</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="stat-block">
                  <span className="stat-value">{data?.counts.members ?? '0'}</span>
                  <span className="stat-label">live members</span>
                </div>
                <div className="stat-block">
                  <span className="stat-value">{data?.counts.approvedEvents ?? '0'}</span>
                  <span className="stat-label">approved events</span>
                </div>
                <div className="stat-block">
                  <span className="stat-value">{data?.counts.publicCommunities ?? '0'}</span>
                  <span className="stat-label">public communities</span>
                </div>
              </div>
              {data?.foundingPhase ? <p className="text-xs uppercase tracking-[0.24em] text-silver/56">Founding phase is live. Early members shape the scene layer before it fills in.</p> : null}
            </div>
            <div className="panel-cut h-full p-6 md:p-8">
              <p className="eyebrow">Why signing up matters</p>
              <div className="mt-6 grid gap-4 text-sm text-silver/72">
                <div className="feature-row"><span className="feature-kicker">01</span><div><h3 className="feature-title">Event intent is social</h3><p>Interested, attending, and maybe are real states with real people attached.</p></div></div>
                <div className="feature-row"><span className="feature-kicker">02</span><div><h3 className="feature-title">Communities have real chat</h3><p>Group chat supports normal messages, event attachments, and privacy-aware location sharing.</p></div></div>
                <div className="feature-row"><span className="feature-kicker">03</span><div><h3 className="feature-title">Profiles are meant to be found</h3><p>Admin-curated featured members, verified builders, standout accounts, and friend-driven discovery.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-16 grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured profiles</p>
              <h2 className="headline-md mt-3">Curated accounts worth keeping an eye on.</h2>
            </div>
            <Link to="/join" className="text-[11px] uppercase tracking-[0.24em] text-silver/60">Members unlock more</Link>
          </div>
          {data?.featuredProfiles?.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.featuredProfiles.map((profile) => (
                <Link to={`/profiles/${profile.slug}`} key={profile.id} className="profile-tile">
                  <div className="flex items-center gap-3">
                    <AvatarBadge name={profile.displayName} src={profile.avatarUrl} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-bone">{profile.displayName}</p>
                        {profile.verified ? <span className="status-chip">verified</span> : null}
                        {profile.promoted ? <span className="status-chip">promoted</span> : null}
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-silver/50">{profile.primaryCar || 'No primary car added yet'}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-silver/72">{profile.bio || 'This member has not added a bio yet.'}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-silver/56">
                    <span>{profile.stats?.friendCount ?? 0} friends</span>
                    <span>{profile.stats?.communityCount ?? 0} communities</span>
                    <span>{profile.stats?.eventAttendanceCount ?? 0} events</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6"><EmptyPanel eyebrow="No featured members" title="No featured profiles yet" body="Founding members can create accounts now. Admins can then promote standout builders, creators, or community anchors once they exist." /></div>
          )}
        </div>

        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured events</p>
              <h2 className="headline-md mt-3">Public previews. Social depth inside the account layer.</h2>
            </div>
            <Link to="/events" className="text-[11px] uppercase tracking-[0.24em] text-silver/60">All events</Link>
          </div>
          {data?.featuredEvents?.length ? (
            <div className="mt-6 grid gap-4">
              {data.featuredEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.slug}`} className="event-list-card">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-silver/50">{event.category}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-bone">{event.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-silver/70">{event.location} • {event.date} • {event.time}</p>
                    <p className="mt-3 text-sm leading-7 text-silver/72">{event.description}</p>
                  </div>
                  <div className="grid gap-2 text-xs uppercase tracking-[0.22em] text-silver/56 sm:text-right">
                    <span>{event.counts?.attending ?? 0} attending</span>
                    <span>{event.counts?.interested ?? 0} interested</span>
                    <span>{event.counts?.maybe ?? 0} maybe</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6"><EmptyPanel eyebrow="No featured events" title="No upcoming featured events yet" body="When the first approved event lands, it shows up here with real attending, interested, and maybe activity instead of fake numbers." /></div>
          )}
        </div>
      </section>

      <section className="shell mt-16">
        <div className="panel-cut p-6 md:p-8">
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
            <div>
              <p className="eyebrow">Locked layer</p>
              <h2 className="headline-md mt-3">What opens up after sign-up.</h2>
              <p className="body-muted mt-4 max-w-xl">Access gating is used to create actual member value, not to fake exclusivity. Public visitors can see the culture. Members get the network.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="panel-blade"><h3>Friends</h3><p>Send requests, accept or reject, remove friends, and build a scene map that feels personal instead of anonymous.</p></div>
              <div className="panel-blade"><h3>Communities</h3><p>Create public or private car communities with member lists, owner/admin controls, and real group chat.</p></div>
              <div className="panel-blade"><h3>Chat attachments</h3><p>Drop events directly into chat or send your live location through a privacy-aware location message.</p></div>
              <div className="panel-blade"><h3>Member discovery</h3><p>Suggested profiles, verified standouts, community membership, and event participation all become visible in the member hub.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-16">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Community preview</p>
              <h2 className="headline-md mt-3">A few public groups can show on the outside. Full access stays member-only.</h2>
            </div>
          </div>
          {data?.publicCommunities?.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.publicCommunities.map((community) => (
                <div key={community.id} className="panel-blade">
                  <div className="flex items-center justify-between gap-3">
                    <h3>{community.name}</h3>
                    <span className="status-chip">{community.visibility}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-silver/70">{community.description}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-silver/56">{community.memberCount} members</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6"><EmptyPanel eyebrow="No public communities" title="Communities will appear here once members create them" body="Nothing is faked. Public groups only show once real members create them and make them visible." /></div>
          )}
          {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}
        </div>
      </section>
    </div>
  );
}
