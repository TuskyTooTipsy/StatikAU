import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import { networkApi } from '../api/network';
import type { PublicPlatformPayload } from '../types/network';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  const [data, setData] = useState<PublicPlatformPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  usePageMeta('Home', 'STATIK is evolving into a sharper automotive event platform with premium discovery, hosted events, profiles, garages, and communities.');

  useEffect(() => {
    void networkApi.getPublicPlatform()
      .then((payload) => {
        setData(payload);
        setError(null);
      })
      .catch((err: any) => setError(err.message));
  }, []);

  return (
    <div className="pb-16">
      <section className="shell pt-8">
        <div className="page-hero-cut p-6 md:p-10">
          <p className="eyebrow">Events-first automotive culture network</p>
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
            <div>
              <h1 className="headline-lg mt-3">Track what is happening. Submit what matters. Build an identity that carries past the event itself.</h1>
              <p className="body-muted mt-5 max-w-3xl text-base">STATIK is pushing harder toward hosted events, premium discovery, stronger group identity, richer garage dossiers, and cleaner moderation. The event layer now leads the experience instead of sitting off to the side.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/events" className="btn-primary h-12 px-5 text-[11px]">Explore events</Link>
                <Link to="/submit" className="btn-secondary h-12 px-5 text-[11px]">Submit event</Link>
                <Link to="/join" className="btn-secondary h-12 px-5 text-[11px]">Create account</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="stat-block"><span className="stat-value">{data?.counts.approvedEvents ?? '—'}</span><span className="stat-label">approved events</span></div>
              <div className="stat-block"><span className="stat-value">{data?.counts.sponsoredEvents ?? '—'}</span><span className="stat-label">sponsored events</span></div>
              <div className="stat-block"><span className="stat-value">{data?.counts.publicCommunities ?? '—'}</span><span className="stat-label">public groups</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-10">
        <div className="grid gap-4 xl:grid-cols-3">
          {(data?.flagshipEvents || data?.featuredEvents || []).slice(0, 3).map((event) => (
            <Link key={event.id} to={`/events/${event.slug}`} className="panel-cut overflow-hidden p-0">
              {event.media?.[0] ? (
                event.media[0].kind === 'video'
                  ? <video src={event.media[0].url} className="h-56 w-full object-cover" muted playsInline />
                  : <img src={event.media[0].url} alt={event.name} className="h-56 w-full object-cover" />
              ) : (
                <div className="h-56 w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))]" />
              )}
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="status-chip">{event.category}</span>
                  {event.sponsored ? <span className="status-chip">sponsored</span> : null}
                  {event.sourceType === 'statik_hosted' ? <span className="status-chip">STATIK hosted</span> : null}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.05em] text-bone">{event.name}</h2>
                  <p className="mt-3 text-sm text-silver/66">{[event.location, event.date, event.time].filter(Boolean).join(' • ')}</p>
                </div>
                <p className="text-sm leading-7 text-silver/70">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell mt-16">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Explore lanes</p>
              <h2 className="headline-md mt-3">Browse the scene by event pattern instead of digging through thin calendar rows.</h2>
            </div>
            <Link to="/events" className="btn-secondary h-11 px-4 text-[11px]">Open event index</Link>
          </div>
          {data?.eventCategories?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {data.eventCategories.map((category) => (
                <Link key={category.label} to={`/events?category=${encodeURIComponent(category.label)}`} className="panel-blade inline-flex min-w-[170px] items-center justify-between gap-3">
                  <span className="text-sm text-bone">{category.label}</span>
                  <span className="status-chip">{category.count}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6"><EmptyPanel eyebrow="Categories" title="No public categories yet" body="As approved events accumulate, the strongest discovery lanes will appear here automatically." /></div>
          )}
        </div>
      </section>

      <section className="shell mt-16">
        <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Upcoming</p>
                <h2 className="headline-md mt-3">What is close enough to act on now.</h2>
              </div>
              <Link to="/events" className="btn-secondary h-11 px-4 text-[11px]">See all</Link>
            </div>
            <div className="mt-6 grid gap-4">
              {(data?.upcomingEvents || []).length ? (data?.upcomingEvents || []).slice(0, 6).map((event) => (
                <Link key={event.id} to={`/events/${event.slug}`} className="event-list-card">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-silver/50">{event.category}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-bone">{event.name}</h3>
                    <p className="mt-2 text-sm text-silver/70">{[event.location, event.date, event.time].filter(Boolean).join(' • ')}</p>
                  </div>
                  <div className="grid gap-2 text-xs uppercase tracking-[0.22em] text-silver/56 sm:text-right">
                    <span>{event.counts?.attending ?? 0} attending</span>
                    <span>{event.counts?.interested ?? 0} interested</span>
                    <span>{event.sponsored ? 'sponsored' : event.organizer}</span>
                  </div>
                </Link>
              )) : <EmptyPanel eyebrow="Upcoming" title="No approved upcoming events yet" body="The homepage only shows real approved events. Submit the first one to start building the calendar." action={<Link to="/submit" className="btn-primary h-11 px-4 text-[11px]">Submit event</Link>} />}
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel-cut p-6 md:p-8">
              <p className="eyebrow">Why join</p>
              <div className="mt-4 grid gap-3">
                <div className="panel-blade"><h3>Track attendance</h3><p className="mt-3 text-sm leading-7 text-silver/68">RSVP, show up with more context, and turn event traffic into profile and garage visibility.</p></div>
                <div className="panel-blade"><h3>Submit better events</h3><p className="mt-3 text-sm leading-7 text-silver/68">Venue search, direct media uploads, sponsor-aware intake, and approval tracking make submissions more operationally useful.</p></div>
                <div className="panel-blade"><h3>Carry the signal forward</h3><p className="mt-3 text-sm leading-7 text-silver/68">Profiles, groups, and build dossiers keep the event from being the end of the interaction.</p></div>
              </div>
            </div>
            <div className="panel-cut p-6 md:p-8">
              <p className="eyebrow">Featured profiles</p>
              {data?.featuredProfiles?.length ? (
                <div className="mt-4 grid gap-3">
                  {data.featuredProfiles.slice(0, 4).map((profile) => (
                    <Link key={profile.id} to={`/profiles/${profile.slug}`} className="panel-blade">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3>{profile.displayName}</h3>
                          <p className="mt-2 text-sm text-silver/70">{profile.primaryCar || 'No primary build'} • {profile.location || 'No location'}</p>
                        </div>
                        <div className="flex gap-2">
                          {profile.featured ? <span className="status-chip">featured</span> : null}
                          {profile.verified ? <span className="status-chip">verified</span> : null}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-4"><EmptyPanel eyebrow="Profiles" title="No featured profiles yet" body="Featured members only show once there are real profiles worth surfacing alongside the event layer." /></div>
              )}
            </div>
          </div>
        </div>
      </section>


      <section className="shell mt-16">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div><p className="eyebrow">Newest members</p><h2 className="headline-md mt-3">Fresh profiles joining the scene.</h2></div>
              <Link to="/members" className="btn-secondary h-11 px-4 text-[11px]">Member hub</Link>
            </div>
            <div className="mt-6 grid gap-3">
              {data?.newestMembers?.length ? data.newestMembers.slice(0, 5).map((profile) => (
                <Link key={profile.id} to={`/profiles/${profile.slug}`} className="panel-blade">
                  <div className="flex items-center gap-3">
                    {profile.avatarUrl ? <img src={profile.avatarUrl} alt={`${profile.displayName} avatar`} className="h-12 w-12 object-cover" /> : <div className="h-12 w-12 border border-white/10 bg-white/[0.04]" />}
                    <div className="min-w-0"><h3 className="truncate">{profile.displayName}</h3><p className="mt-1 text-xs uppercase tracking-[0.18em] text-silver/50">{profile.memberType?.replace(/_/g, ' ') || 'member'} {profile.location ? `• ${profile.location}` : ''}</p></div>
                  </div>
                  {profile.featuredVehicle ? <p className="mt-3 text-sm text-silver/64">Bay: {[profile.featuredVehicle.year, profile.featuredVehicle.make, profile.featuredVehicle.model].filter(Boolean).join(' ')}</p> : null}
                </Link>
              )) : <EmptyPanel eyebrow="Members" title="No visible newest members yet" body="Members appear here only when they opt into discovery and pass account visibility checks." />}
            </div>
          </div>

          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Articles / News</p><h2 className="headline-md mt-3">Editorial around the event layer.</h2></div><Link to="/articles" className="btn-secondary h-11 px-4 text-[11px]">Open</Link></div>
            <div className="mt-6 grid gap-3">
              {[...(data?.latestArticles || []), ...(data?.latestNews || [])].slice(0, 5).length ? [...(data?.latestArticles || []), ...(data?.latestNews || [])].slice(0, 5).map((item) => (
                <Link key={item.id} to={`/${item.type === 'news' ? 'news' : 'articles'}/${item.slug}`} className="panel-blade">
                  <div className="flex flex-wrap gap-2"><span className="status-chip">{item.type}</span><span className="status-chip">{item.category}</span></div>
                  <h3 className="mt-3">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-silver/64">{item.excerpt}</p>
                </Link>
              )) : <EmptyPanel eyebrow="Editorial" title="No published editorial yet" body="Articles and news stay empty until admin publishes real content." />}
            </div>
          </div>

          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Trusted businesses</p><h2 className="headline-md mt-3">Approved services around the scene.</h2></div><Link to="/businesses" className="btn-secondary h-11 px-4 text-[11px]">Directory</Link></div>
            <div className="mt-6 grid gap-3">
              {data?.trustedBusinesses?.length ? data.trustedBusinesses.slice(0, 4).map((business) => (
                <Link key={business.id} to={`/businesses/${business.slug}`} className="panel-blade">
                  <div className="flex flex-wrap gap-2"><span className="status-chip">{business.category}</span>{business.trusted ? <span className="status-chip">trusted</span> : null}{business.sponsored ? <span className="status-chip">sponsored</span> : null}</div>
                  <h3 className="mt-3">{business.businessName}</h3>
                  <p className="mt-2 text-sm text-silver/64">{business.region || business.address || 'Location not listed'}</p>
                </Link>
              )) : <EmptyPanel eyebrow="Directory" title="No trusted businesses yet" body="Only approved/trusted/sponsored real listings will be surfaced here." />}
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-16">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Public groups</p>
              <h2 className="headline-md mt-3">Crew identities, host pages, and member clusters that support the event surface.</h2>
            </div>
            <Link to="/members/communities" className="btn-secondary h-11 px-4 text-[11px]">Group hub</Link>
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
            <div className="mt-6"><EmptyPanel eyebrow="Communities" title="No public groups yet" body="Nothing is being faked. Groups appear here only when members create them and make them visible." /></div>
          )}
          {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}
        </div>
      </section>
    </div>
  );
}
