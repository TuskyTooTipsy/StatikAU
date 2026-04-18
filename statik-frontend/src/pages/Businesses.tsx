import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyPanel from '../components/EmptyPanel';
import MediaGrid from '../components/platform/MediaGrid';
import { networkApi } from '../api/network';
import { useSessionStore } from '../store/session';
import type { BusinessListing } from '../types/network';

export default function BusinessesPage() {
  const [items, setItems] = useState<BusinessListing[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitForm, setSubmitForm] = useState({ businessName: '', category: 'mechanic', region: '', description: '', website: '', email: '' });
  const user = useSessionStore((state) => state.user);

  async function load() {
    try {
      const payload = await networkApi.listBusinesses({ q, category, region });
      setItems(payload.items);
      setCategories(payload.categories);
      setRegions(payload.regions);
      setError(null);
    } catch (err: any) { setError(err.message); }
  }

  useEffect(() => { void load(); }, [category, region]);

  async function submitBusiness(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await networkApi.submitBusiness({
        ...submitForm,
        services: submitForm.description ? [submitForm.description.slice(0, 120)] : [],
        specialties: [],
        subcategories: [],
        socialLinks: [],
        galleryMediaIds: [],
        linkedEventIds: [],
        linkedArticleIds: [],
        linkedNewsIds: [],
        linkedCommunityIds: [],
        adminNote: 'Public business directory submission',
      });
      setSubmitted(true);
      setSubmitForm({ businessName: '', category: 'mechanic', region: '', description: '', website: '', email: '' });
    } catch (err: any) {
      setError(err.message || 'Business submission failed.');
    }
  }

  return (
    <div className="shell space-y-8 py-10">
      <section className="page-hero-cut p-6 md:p-10">
        <p className="eyebrow">Trusted automotive services</p>
        <h1 className="headline-lg mt-3">Business Directory</h1>
        <p className="body-muted mt-4 max-w-3xl">Approved workshops, vendors, media teams, event services, and partners. Listings appear only after admin review, sponsorship/trust flags are controlled, and nothing is faked.</p>
      </section>
      <section className="panel-cut p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
          <input className="field-sharp" placeholder="Search business, service, specialty" value={q} onChange={(event) => setQ(event.target.value)} />
          <select className="field-sharp" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <select className="field-sharp" value={region} onChange={(event) => setRegion(event.target.value)}><option value="">All regions</option>{regions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <button className="btn-primary h-12 px-5 text-[11px]" onClick={load}>Search</button>
        </div>
      </section>

      <section className="panel-cut p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="eyebrow">Business intake</p>
            <h2 className="headline-md mt-3">Apply for a trusted directory listing.</h2>
            <p className="mt-3 text-sm leading-7 text-silver/68">Listings go pending until admin review. Trusted, sponsored, and featured badges are never self-assigned.</p>
            {!user ? <p className="mt-4 text-sm text-silver/65">Sign in or create an account to submit a business for approval.</p> : null}
            {submitted ? <div className="mt-4 panel-blade border-emerald-300/20 bg-emerald-300/5 text-sm text-emerald-100/80">Business submitted to admin review. It will not appear publicly until approved.</div> : null}
          </div>
          <form onSubmit={submitBusiness} className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input className="field-sharp" placeholder="Business name" value={submitForm.businessName} onChange={(event) => setSubmitForm({ ...submitForm, businessName: event.target.value })} required disabled={!user} />
              <select className="field-sharp" value={submitForm.category} onChange={(event) => setSubmitForm({ ...submitForm, category: event.target.value })} disabled={!user}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <input className="field-sharp" placeholder="Region" value={submitForm.region} onChange={(event) => setSubmitForm({ ...submitForm, region: event.target.value })} disabled={!user} />
              <input className="field-sharp" placeholder="Website" value={submitForm.website} onChange={(event) => setSubmitForm({ ...submitForm, website: event.target.value })} disabled={!user} />
              <input className="field-sharp" placeholder="Contact email" type="email" value={submitForm.email} onChange={(event) => setSubmitForm({ ...submitForm, email: event.target.value })} disabled={!user} />
            </div>
            <textarea className="field-sharp min-h-[110px]" placeholder="What services do you provide?" value={submitForm.description} onChange={(event) => setSubmitForm({ ...submitForm, description: event.target.value })} disabled={!user} />
            <button className="btn-primary h-11 px-5 text-[11px]" disabled={!user} type="submit">Submit for approval</button>
          </form>
        </div>
      </section>

      {items.length ? <section className="grid gap-5 lg:grid-cols-3">{items.map((business) => (
        <Link key={business.id} to={`/businesses/${business.slug}`} className="panel-cut overflow-hidden p-0">
          {business.bannerMedia || business.logoMedia ? <MediaGrid media={[business.bannerMedia || business.logoMedia].filter(Boolean) as any} compact /> : <div className="h-48 bg-white/[0.04]" />}
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2"><span className="status-chip">{business.category}</span>{business.trusted ? <span className="status-chip">trusted</span> : null}{business.sponsored ? <span className="status-chip">sponsored</span> : null}{business.featured ? <span className="status-chip">featured</span> : null}</div>
            <h2 className="text-2xl font-semibold tracking-[-0.05em] text-bone">{business.businessName}</h2>
            <p className="text-sm leading-7 text-silver/68">{business.description || 'No public description supplied yet.'}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-silver/46">{business.region || business.address || 'Location not listed'}</p>
          </div>
        </Link>
      ))}</section> : <EmptyPanel eyebrow="Directory" title="No approved businesses yet" body="Approved/trusted businesses will appear here after admin review. No spam listings, no fake logos, no invented reviews." action={<Link to="/join" className="btn-primary h-11 px-4 text-[11px]">Join to submit</Link>} />}
      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
