import { officialPosts, profiles } from '../data/platform';
import PostCard from '../components/platform/PostCard';
import ProfileCard from '../components/platform/ProfileCard';
import SectionHeading from '../components/SectionHeading';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Updates() {
  usePageMeta('Updates', 'Official STATIK updates, culture drops, partner placements, and platform announcements.');

  return (
    <div className="shell space-y-10 py-8">
      <div className="page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Official feed / admin-published only</p>
        <h1 className="headline-lg mt-3">Updates that feel alive without turning into noise.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">
          STATIK publishes the feed. Community interaction happens underneath through comments, reactions, shares, and profile crossover, but nothing self-publishes to the public front door without moderation.
        </p>
      </div>
      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {officialPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
        <div className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow">Pinned modules</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-bone">Featured event rail</p>
                <p className="mt-2 text-sm leading-7 text-silver/65">Approved events rotate here, with source labels and sponsor priority controls.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-bone">Partner spot</p>
                <p className="mt-2 text-sm leading-7 text-silver/65">A revenue lane for tasteful sponsors, not banner-ad clutter.</p>
              </div>
            </div>
          </div>
          <SectionHeading eyebrow="Featured community" title="Profiles worth following" description="Recent builders, media creators, and partners pushed from admin curation." />
          <div className="space-y-5">
            {profiles.slice(0, 2).map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
