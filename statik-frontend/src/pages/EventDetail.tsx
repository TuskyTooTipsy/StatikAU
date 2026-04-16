import { Link, useParams } from 'react-router-dom';
import { events, officialPosts, partnerPlacements, profiles } from '../data/platform';
import { usePageMeta } from '../hooks/usePageMeta';

export default function EventDetail() {
  const { slug } = useParams();
  const event = events.find((item) => item.slug === slug) || events[0];
  const relatedProfiles = profiles.slice(0, 2);

  usePageMeta(event.name, event.description);

  return (
    <div className="space-y-10 pb-12 pt-8">
      <section className="shell">
        <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10">
          <img src={event.heroImage} alt={event.name} className="h-[460px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone">{event.category}</span>
                <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-silver/65">{event.sourceLabel}</span>
              </div>
              <h1 className="headline-lg mt-4">{event.name}</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-silver/74">{event.description}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-bone">
                <span>{event.location}</span>
                <span>•</span>
                <span>{event.date}</span>
                <span>•</span>
                <span>{event.time}</span>
                <span>•</span>
                <span>{event.organizer}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="shell grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="panel p-6 md:p-8">
            <p className="eyebrow">About this event</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Approval</p><p className="mt-3 text-lg font-semibold text-bone">{event.approvalStatus}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Source</p><p className="mt-3 text-lg font-semibold text-bone">{event.source}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Attendance</p><p className="mt-3 text-lg font-semibold text-bone">{event.attendanceLabel}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Tags</p><p className="mt-3 text-lg font-semibold text-bone">{event.tags.join(' / ')}</p></div>
            </div>
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm leading-8 text-silver/72">
                This page is designed to attract real attendance and monetize attention. It supports sponsor rails, community spotlights, media galleries, related posts, and clear share surfaces without feeling like a ticketing SaaS template.
              </p>
            </div>
          </div>
          <div className="panel p-6 md:p-8">
            <p className="eyebrow">Related STATIK coverage</p>
            <div className="mt-4 space-y-4">
              {officialPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-bone">{post.title}</p>
                  <p className="mt-2 text-sm leading-7 text-silver/65">{post.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow">Actions</p>
            <div className="mt-4 grid gap-3">
              <button type="button" className="btn-primary h-11 justify-center text-xs">Share event</button>
              <button type="button" className="btn-secondary h-11 justify-center text-xs">Save interest</button>
              <Link to="/submit" className="btn-secondary h-11 justify-center text-xs">Submit media from this event</Link>
            </div>
          </div>
          <div className="panel p-6">
            <p className="eyebrow">Featured profiles attending</p>
            <div className="mt-4 space-y-4">
              {relatedProfiles.map((profile) => (
                <Link key={profile.id} to={`/u/${profile.slug}`} className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
                  <p className="text-sm font-semibold text-bone">{profile.displayName}</p>
                  <p className="mt-2 text-sm text-silver/65">{profile.primaryCar}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <p className="eyebrow">Sponsored placement rail</p>
            <div className="mt-4 space-y-4">
              {partnerPlacements.map((placement) => (
                <div key={placement.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-bone">{placement.title}</p>
                  <p className="mt-2 text-sm leading-7 text-silver/65">{placement.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
