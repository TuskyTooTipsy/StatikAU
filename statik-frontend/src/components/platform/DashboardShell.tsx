import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export default function DashboardShell({
  eyebrow,
  title,
  nav,
  children,
}: {
  eyebrow: string;
  title: string;
  nav: { label: string; href: string }[];
  children: ReactNode;
}) {
  return (
    <div className="shell space-y-8 py-8">
      <div className="page-hero-cut p-6 md:p-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="headline-lg mt-3">{title}</h1>
      </div>
      <div className="grid gap-8 xl:grid-cols-[260px_1fr]">
        <aside className="panel-cut h-fit p-4">
          <div className="space-y-2">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/members/profile' || item.href === '/members' || item.href === '/admin'}
                className={({ isActive }) =>
                  `block border px-4 py-3 text-sm uppercase tracking-[0.2em] transition ${isActive ? 'border-white/20 bg-white/10 text-bone' : 'border-white/8 bg-white/[0.03] text-silver/65 hover:border-white/16 hover:bg-white/[0.06] hover:text-bone'}`
                }
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </aside>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
