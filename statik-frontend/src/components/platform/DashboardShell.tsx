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
      <div className="page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="headline-lg mt-3">{title}</h1>
      </div>
      <div className="grid gap-8 xl:grid-cols-[260px_1fr]">
        <aside className="panel h-fit p-4">
          <div className="space-y-2">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/account' || item.href === '/admin'}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${isActive ? 'border border-white/15 bg-white/10 text-bone' : 'text-silver/65 hover:bg-white/5 hover:text-bone'}`
                }
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
