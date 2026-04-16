import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-silver/70">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {item.href ? (
            <Link to={item.href} className="transition hover:text-bone">
              {item.label}
            </Link>
          ) : (
            <span className="text-bone">{item.label}</span>
          )}
          {index < items.length - 1 ? <span className="text-silver/30">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
