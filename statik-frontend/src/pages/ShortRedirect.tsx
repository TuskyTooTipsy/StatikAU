import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { networkApi } from '../api/network';

export default function ShortRedirect() {
  const { slug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      try {
        const src = searchParams.get('src') || undefined;
        const result = await networkApi.resolveShortLink(slug, src);
        if (cancelled) return;
        navigate(result.href, { replace: true });
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'This STATIK link is unavailable.');
      }
    }
    void resolve();
    return () => { cancelled = true; };
  }, [navigate, searchParams, slug]);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-xl panel-cut p-8 text-center">
        <p className="eyebrow">STATIK short link</p>
        <h1 className="headline-md mt-4">Resolving scene pass…</h1>
        {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : <p className="mt-5 text-sm leading-7 text-silver/68">Tracking the click and sending you to the right public page.</p>}
      </div>
    </section>
  );
}
