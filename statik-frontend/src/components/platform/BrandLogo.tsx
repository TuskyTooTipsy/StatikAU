import { Link } from 'react-router-dom';

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <img src="/brand/statik-logo-emblem.jpg" alt="STATIK emblem" className={`rounded-xl object-cover ${compact ? 'h-10 w-10' : 'h-12 w-12'}`} />
      <div className="leading-none">
        <p className="text-[10px] uppercase tracking-[0.34em] text-silver/60">STATIK</p>
        <p className={`${compact ? 'text-lg' : 'text-xl'} font-semibold tracking-[0.18em] text-bone`}>WORLD</p>
      </div>
    </Link>
  );
}
