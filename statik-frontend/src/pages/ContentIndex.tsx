import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import MediaGrid from '../components/platform/MediaGrid';
import { networkApi } from '../api/network';
import type { ContentItem } from '../types/network';

export default function ContentIndex({ type }: { type: 'articles' | 'news' }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const label = type === 'articles' ? 'Articles' : 'News';

  async function load() {
    try {
      const payload = await networkApi.listContent(type, { q, category });
      setItems(payload.items);
      setCategories(payload.categories);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => { void load(); }, [type, category]);

  return (
    <div className="shell space-y-8 py-10">
      <section className="page-hero-cut p-6 md:p-10">
        <p className="eyebrow">STATIK editorial</p>
        <h1 className="headline-lg mt-3">{label}</h1>
        <p className="body-muted mt-4 max-w-3xl">Real published {label.toLowerCase()} only. Build features, event coverage, business spotlights, platform updates, and community stories appear here after admin approval.</p>
      </section>
      <section className="panel-cut p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input className="field-sharp" placeholder={`Search ${label.toLowerCase()}`} value={q} onChange={(event) => setQ(event.target.value)} />
          <select className="field-sharp" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className="btn-primary h-12 px-5 text-[11px]" onClick={load}>Search</button>
        </div>
      </section>
      {items.length ? (
        <section className="grid gap-5 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} to={`/${type}/${item.slug}`} className="panel-cut overflow-hidden p-0 transition hover:border-white/20">
              {item.heroMedia ? <MediaGrid media={[item.heroMedia]} compact /> : <div className="h-52 bg-white/[0.04]" />}
              <div className="space-y-4 p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="status-chip">{item.category}</span>
                  {item.featured ? <span className="status-chip">featured</span> : null}
                  {item.sponsored ? <span className="status-chip">sponsored</span> : null}
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.05em] text-bone">{item.title}</h2>
                <p className="text-sm leading-7 text-silver/68">{item.excerpt || 'No excerpt provided.'}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-silver/46">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Published'}</p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <EmptyPanel eyebrow={label} title={`No published ${label.toLowerCase()} yet`} body="Nothing is being faked. Once admin publishes real editorial content, it will appear here." action={<Link to="/events" className="btn-secondary h-11 px-4 text-[11px]">Explore events</Link>} />
      )}
      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
