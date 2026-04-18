import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import MediaGrid from '../components/platform/MediaGrid';
import { networkApi } from '../api/network';
import type { BusinessListing } from '../types/network';

export default function BusinessDetailPage() {
  const { slug = '' } = useParams();
  const [business, setBusiness] = useState<BusinessListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void networkApi.getBusiness(slug).then(setBusiness).catch((err: any) => setError(err.message)); }, [slug]);
  if (error) return <div className="shell py-10"><EmptyPanel eyebrow="Business" title="Listing not available" body={error} /></div>;
  if (!business) return <div className="shell py-10"><EmptyPanel eyebrow="Business" title="Loading listing" body="Pulling the approved business record." /></div>;

  return (
    <div className="shell space-y-8 py-10">
      <section className="page-hero-cut p-6 md:p-10">
        <div className="flex flex-wrap gap-2"><span className="status-chip">{business.category}</span>{business.trusted ? <span className="status-chip">trusted</span> : null}{business.sponsored ? <span className="status-chip">sponsored</span> : null}{business.featured ? <span className="status-chip">featured</span> : null}</div>
        <h1 className="headline-lg mt-5">{business.businessName}</h1>
        <p className="body-muted mt-4 max-w-3xl">{business.description}</p>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-silver/52">{business.region || business.address || 'Location not listed'}</p>
      </section>
      {business.bannerMedia || business.logoMedia ? <MediaGrid media={[business.bannerMedia || business.logoMedia].filter(Boolean) as any} /> : null}
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Services</p>
          <div className="mt-4 flex flex-wrap gap-2">{[...business.services, ...business.specialties].length ? [...business.services, ...business.specialties].map((item) => <span key={item} className="status-chip">{item}</span>) : <span className="text-sm text-silver/60">No public services listed yet.</span>}</div>
          {business.openingHours ? <p className="mt-6 whitespace-pre-line text-sm leading-7 text-silver/70">{business.openingHours}</p> : null}
          {business.galleryMedia?.length ? <div className="mt-6"><MediaGrid media={business.galleryMedia} /></div> : null}
        </div>
        <aside className="panel-cut h-fit p-6">
          <p className="eyebrow">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-silver/70">
            {business.website ? <a className="text-bone" href={business.website} target="_blank" rel="noreferrer">Website</a> : null}
            {business.email ? <a className="text-bone" href={`mailto:${business.email}`}>{business.email}</a> : null}
            {business.phone ? <a className="text-bone" href={`tel:${business.phone}`}>{business.phone}</a> : null}
            {business.shortLink?.qrUrl ? <a className="btn-secondary h-11 px-4 text-[11px]" href={business.shortLink.qrUrl}>QR share</a> : null}
          </div>
        </aside>
      </section>
      <Link to="/businesses" className="btn-secondary h-11 px-4 text-[11px]">Back to directory</Link>
    </div>
  );
}
