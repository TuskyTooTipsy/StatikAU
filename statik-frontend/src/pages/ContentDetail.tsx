import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import MediaGrid from '../components/platform/MediaGrid';
import { networkApi } from '../api/network';
import type { ContentItem } from '../types/network';

export default function ContentDetail({ type }: { type: 'articles' | 'news' }) {
  const { slug = '' } = useParams();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void networkApi.getContent(type, slug).then(setItem).catch((err: any) => setError(err.message));
  }, [type, slug]);

  if (error) return <div className="shell py-10"><EmptyPanel eyebrow="Content" title="Content not available" body={error} /></div>;
  if (!item) return <div className="shell py-10"><EmptyPanel eyebrow="Content" title="Loading editorial file" body="Pulling the published record from the STATIK content system." /></div>;

  return (
    <article className="shell space-y-8 py-10">
      <section className="page-hero-cut p-6 md:p-10">
        <div className="flex flex-wrap gap-2">
          <span className="status-chip">{item.type}</span>
          <span className="status-chip">{item.category}</span>
          {item.aiAssisted ? <span className="status-chip">AI-assisted draft reviewed</span> : null}
          {item.sponsored ? <span className="status-chip">sponsored</span> : null}
        </div>
        <h1 className="headline-lg mt-5">{item.title}</h1>
        <p className="body-muted mt-4 max-w-3xl">{item.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-silver/52">
          <span>{item.authorDisplayName || 'STATIK editorial'}</span>
          <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Published'}</span>
          {item.shortLink?.qrUrl ? <a className="text-bone" href={item.shortLink.qrUrl}>QR share</a> : null}
        </div>
      </section>
      {item.heroMedia ? <MediaGrid media={[item.heroMedia]} /> : null}
      <section className="panel-cut p-6 md:p-8">
        <div className="prose prose-invert max-w-none whitespace-pre-line text-silver/78 prose-headings:text-bone prose-a:text-bone">
          {item.body || 'No body copy has been published for this item yet.'}
        </div>
        {item.tags?.length ? <div className="mt-8 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="status-chip">#{tag}</span>)}</div> : null}
      </section>
      {item.galleryMedia?.length ? <MediaGrid media={item.galleryMedia} /> : null}
      <section className="flex flex-wrap gap-3">
        <Link to={`/${type}`} className="btn-secondary h-11 px-4 text-[11px]">Back to {type}</Link>
        {item.shortLink?.shortUrl ? <a className="btn-primary h-11 px-4 text-[11px]" href={item.shortLink.shortUrl}>Share short link</a> : null}
      </section>
    </article>
  );
}
