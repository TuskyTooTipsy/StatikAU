import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchIndex } from '../data/platform';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Search() {
  const [query, setQuery] = useState('');
  usePageMeta('Search', 'Search across profiles, events, posts, submissions, and commerce.');

  const results = useMemo(() => {
    if (!query) return searchIndex;
    return searchIndex.filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="shell space-y-8 py-8">
      <div className="page-hero rounded-[2.5rem] border border-white/10 p-6 md:p-10">
        <p className="eyebrow">Search across the STATIK graph</p>
        <h1 className="headline-lg mt-3">Find people, events, updates, submissions, and product lanes.</h1>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="field mt-6 max-w-2xl" placeholder="Search events, profiles, posts, sponsors, products..." />
      </div>
      <div className="grid gap-4">
        {results.map((result) => (
          <Link key={`${result.type}-${result.id}`} to={result.href} className="panel flex gap-5 p-5 transition hover:border-white/20">
            {result.image ? <img src={result.image} alt={result.title} className="h-20 w-20 rounded-2xl object-cover" /> : <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/[0.03]" />}
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-silver/50">{result.type}</p>
              <h2 className="mt-2 text-xl font-semibold text-bone">{result.title}</h2>
              <p className="mt-2 text-sm leading-7 text-silver/68">{result.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
