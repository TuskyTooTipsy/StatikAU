import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Profile } from '../../types/platform';

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-black/60">
      <div className="relative h-52 overflow-hidden">
        <img src={profile.banner} alt={profile.displayName} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        <img src={profile.avatar} alt={profile.displayName} className="absolute bottom-4 left-4 h-16 w-16 rounded-full border border-white/15 object-cover shadow-2xl shadow-black/40" />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-bone">{profile.displayName}</h3>
            {profile.featured ? <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone">Featured</span> : null}
          </div>
          <p className="mt-2 text-sm text-silver/60">{profile.location} • {profile.primaryCar}</p>
        </div>
        <p className="text-sm leading-7 text-silver/72">{profile.bio}</p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs uppercase tracking-[0.2em] text-silver/55">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><p className="text-bone">{profile.analytics.profileViews}</p><p className="mt-1">views</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><p className="text-bone">{profile.analytics.qrVisits}</p><p className="mt-1">qr</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><p className="text-bone">{profile.analytics.linkClicks}</p><p className="mt-1">clicks</p></div>
        </div>
        <Link to={`/u/${profile.slug}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-bone transition hover:text-white">
          View profile ↗
        </Link>
      </div>
    </motion.article>
  );
}
