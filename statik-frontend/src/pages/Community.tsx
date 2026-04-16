import ProfileCard from '../components/platform/ProfileCard';
import { profiles } from '../data/platform';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Community() {
  usePageMeta('Community', 'Discover creator, builder, and partner profiles across the STATIK community.');

  return (
    <div className="shell space-y-10 py-8">
      <div className="page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Community / approved profiles only</p>
        <h1 className="headline-lg mt-3">Builder pages, creator pages, partner pages, one identity layer.</h1>
        <p className="body-muted mt-5 max-w-3xl text-base">Every profile lives inside brand guardrails but still gets room for a banner, bio, garage, links, media, sponsors, analytics, and QR-based discovery.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {profiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
      </div>
    </div>
  );
}
