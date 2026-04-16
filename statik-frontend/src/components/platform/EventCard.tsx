import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { EventItem } from '../../types/platform';

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <motion.article layout whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/60">
      <img src={event.heroImage} alt={event.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/25" />
      <div className="relative flex min-h-[360px] flex-col justify-between p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone">{event.category}</span>
          <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-silver/70">{event.sourceLabel}</span>
          {event.featured ? <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone">Featured</span> : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-silver/55">{event.date} • {event.time}</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-bone">{event.name}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-silver/72">{event.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-silver/72">
            <span>{event.location}</span>
            <span>•</span>
            <span>{event.attendanceLabel}</span>
          </div>
          <Link to={`/events/${event.slug}`} className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-bone transition hover:text-white">
            Open event
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
