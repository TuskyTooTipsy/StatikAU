import { FormEvent, useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import EmptyPanel from '../../components/EmptyPanel';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
import MediaGrid from '../../components/platform/MediaGrid';
import type { BusinessListing } from '../../types/network';

const emptyBusiness = { businessName: '', category: 'mechanic', subcategories: [], description: '', services: [], specialties: [], region: '', address: '', phone: '', email: '', website: '', socialLinks: [], status: 'pending' as const, trusted: false, sponsored: false, featured: false, galleryMediaIds: [] };

export default function AdminBusinessesPage() {
  const [items, setItems] = useState<BusinessListing[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [draft, setDraft] = useState<any>(emptyBusiness);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      const payload = await networkApi.getAdminBusinesses({ q, status });
      setItems(payload.items);
      setCategories(payload.categories);
      setMessage(null);
    } catch (err: any) { setMessage(err.message); }
  }
  useEffect(() => { void load(); }, [status]);
  function edit(item: BusinessListing) { setEditingId(item.id); setDraft({ ...item }); }


  async function uploadBusinessMedia(file: File, target: 'logo' | 'banner' | 'gallery') {
    if (!editingId) {
      setMessage('Save the business first, then attach logo/banner/gallery media safely.');
      return;
    }
    setUploading(true);
    try {
      const asset = await uploadMediaFile(file, 'business', editingId);
      let updated: any = { ...draft };
      if (target === 'logo') updated.logoMediaId = asset.id;
      else if (target === 'banner') updated.bannerMediaId = asset.id;
      else updated.galleryMediaIds = [...(draft.galleryMediaIds || []), asset.id];
      setDraft(updated);
      await networkApi.updateAdminBusiness(editingId, updated);
      setMessage('Business media uploaded and attached. Original filenames remain admin/internal metadata only.');
      await load();
    } catch (err: any) {
      setMessage(err.message || 'Business media upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const normalize = (value: any) => Array.isArray(value) ? value : String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
      const payload = { ...draft, subcategories: normalize(draft.subcategories), services: normalize(draft.services), specialties: normalize(draft.specialties), socialLinks: normalize(draft.socialLinks), offers: normalize(draft.offers) };
      if (editingId) await networkApi.updateAdminBusiness(editingId, payload);
      else await networkApi.createAdminBusiness(payload);
      setEditingId(null);
      setDraft(emptyBusiness);
      setMessage('Business record saved. Public directory visibility follows approval status only.');
      await load();
    } catch (err: any) { setMessage(err.message); }
  }

  return (
    <DashboardShell eyebrow="Admin / business directory" title="Trusted business control board" nav={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="panel-cut p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]"><input className="field-sharp" placeholder="Search businesses" value={q} onChange={(e) => setQ(e.target.value)} /><select className="field-sharp" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="suspended">Suspended</option><option value="archived">Archived</option></select><button className="btn-primary h-12 px-4 text-[11px]" onClick={load}>Search</button></div>
          <div className="mt-5 grid gap-3">{items.length ? items.map((item) => <button key={item.id} type="button" onClick={() => edit(item)} className="panel-blade text-left"><div className="flex flex-wrap justify-between gap-3"><h3>{item.businessName}</h3><span className="status-chip">{item.status}</span></div><p className="mt-2 text-sm text-silver/65">{item.category} • {item.region || 'No region'}</p><div className="mt-3 flex flex-wrap gap-2">{item.trusted ? <span className="status-chip">trusted</span> : null}{item.sponsored ? <span className="status-chip">sponsored</span> : null}{item.featured ? <span className="status-chip">featured</span> : null}</div></button>) : <EmptyPanel eyebrow="Businesses" title="No business records" body="Create or approve the first real listing. Public directory remains empty until approved." />}</div>
        </section>
        <form onSubmit={submit} className="panel-cut space-y-4 p-5">
          <div className="flex items-center justify-between"><p className="eyebrow">{editingId ? 'Edit listing' : 'Create listing'}</p>{editingId ? <button type="button" className="btn-secondary h-9 px-3 text-[10px]" onClick={() => { setEditingId(null); setDraft(emptyBusiness); }}>Clear</button> : null}</div>
          <input className="field-sharp" placeholder="Business name" value={draft.businessName} onChange={(e) => setDraft({ ...draft, businessName: e.target.value })} required />
          <div className="grid gap-3 md:grid-cols-2"><select className="field-sharp" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select><select className="field-sharp" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="draft">Draft</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="suspended">Suspended</option><option value="archived">Archived</option></select></div>
          <textarea className="field-sharp min-h-[120px]" placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <input className="field-sharp" placeholder="Services comma separated" value={Array.isArray(draft.services) ? draft.services.join(', ') : draft.services} onChange={(e) => setDraft({ ...draft, services: e.target.value })} />
          <input className="field-sharp" placeholder="Specialties comma separated" value={Array.isArray(draft.specialties) ? draft.specialties.join(', ') : draft.specialties} onChange={(e) => setDraft({ ...draft, specialties: e.target.value })} />
          <div className="grid gap-3 md:grid-cols-2"><input className="field-sharp" placeholder="Region" value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })} /><input className="field-sharp" placeholder="Address" value={draft.address || ''} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></div>
          <div className="grid gap-3 md:grid-cols-3"><input className="field-sharp" placeholder="Phone" value={draft.phone || ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /><input className="field-sharp" placeholder="Email" value={draft.email || ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /><input className="field-sharp" placeholder="Website" value={draft.website || ''} onChange={(e) => setDraft({ ...draft, website: e.target.value })} /></div>
          <div className="panel-blade">
            <h3>Logo, banner, and gallery media</h3>
            <p className="mt-2 text-sm leading-7 text-silver/62">Save the listing first, then attach media. The public directory shows previews and captions, not raw filenames.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="field-sharp cursor-pointer">{uploading ? 'Uploading…' : 'Upload logo'}<input className="hidden" type="file" accept="image/*" disabled={!editingId || uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadBusinessMedia(file, 'logo'); e.currentTarget.value = ''; }} /></label>
              <label className="field-sharp cursor-pointer">{uploading ? 'Uploading…' : 'Upload banner'}<input className="hidden" type="file" accept="image/*,video/*" disabled={!editingId || uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadBusinessMedia(file, 'banner'); e.currentTarget.value = ''; }} /></label>
              <label className="field-sharp cursor-pointer">{uploading ? 'Uploading…' : 'Add gallery'}<input className="hidden" type="file" accept="image/*,video/*" disabled={!editingId || uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadBusinessMedia(file, 'gallery'); e.currentTarget.value = ''; }} /></label>
            </div>
            {draft.logoMedia || draft.bannerMedia ? <div className="mt-4"><MediaGrid media={[draft.bannerMedia || draft.logoMedia].filter(Boolean)} compact /></div> : null}
            {draft.galleryMedia?.length ? <div className="mt-4"><MediaGrid media={draft.galleryMedia} compact /></div> : null}
          </div>
          <div className="grid gap-3 md:grid-cols-3"><label className="panel-blade flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.trusted} onChange={(e) => setDraft({ ...draft, trusted: e.target.checked })} /> Trusted</label><label className="panel-blade flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.sponsored} onChange={(e) => setDraft({ ...draft, sponsored: e.target.checked })} /> Sponsored</label><label className="panel-blade flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> Featured</label></div>
          <button className="btn-primary h-12 justify-center text-[11px]">Save listing</button>
          {message ? <p className="text-sm text-silver/70">{message}</p> : null}
        </form>
      </div>
    </DashboardShell>
  );
}
