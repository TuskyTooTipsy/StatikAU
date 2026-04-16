import { Link } from 'react-router-dom';
import { announcements } from '../../data/platform';

export default function AnnouncementBar() {
  const item = announcements[0];

  return (
    <div className="border-b border-white/10 bg-white/[0.03]">
      <div className="shell flex flex-col gap-3 py-3 text-sm text-silver/80 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="mr-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-bone">
            Live
          </span>
          <span className="font-semibold text-bone">{item.title}</span>
          <span className="ml-3 text-silver/65">{item.body}</span>
        </div>
        {item.ctaHref ? (
          <Link to={item.ctaHref} className="text-xs uppercase tracking-[0.24em] text-bone transition hover:text-white">
            {item.ctaLabel} ↗
          </Link>
        ) : null}
      </div>
    </div>
  );
}
