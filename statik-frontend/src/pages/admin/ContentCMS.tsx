import { FormEvent, useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import EmptyPanel from '../../components/EmptyPanel';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import { uploadMediaFile } from '../../api/uploads';
import MediaGrid from '../../components/platform/MediaGrid';
import type { ContentItem } from '../../types/network';

const emptyDraft = (type: 'article' | 'news') => ({
  type,
  title: '',
  excerpt: '',
  body: '',
  category: type === 'news' ? 'Scene update' : 'Feature',
  tags: [],
  status: 'draft' as const,
  featured: false,
  sponsored: false,
  aiAssisted: false,
  galleryMediaIds: [],
  relatedEventIds: [],
  relatedBusinessIds: [],
  relatedProfileIds: [],
  relatedCommunityIds: [],
});

export default function AdminContentCMS({ type }: { type: 'article' | 'news' }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [draft, setDraft] = useState<any>(emptyDraft(type));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const label = type === 'article' ? 'Articles' : 'News';

  async function load() {
    try {
      const payload = await networkApi.getAdminContent({ type, status, q });
      setItems(payload.items);
      setMessage(null);
    } catch (err: any) { setMessage(err.message); }
  }

  useEffect(() => { setDraft(emptyDraft(type)); setEditingId(null); void load(); }, [type, status]);

  function edit(item: ContentItem) {
    setEditingId(item.id);
    setDraft({ ...item, tags: item.tags || [] });
  }


  async function uploadContentMedia(file: File, target: 'hero' | 'gallery') {
    if (!editingId) {
      setMessage('Save the draft first, then upload hero/gallery media so ownership can be attached safely.');
      return;
    }
    setUploading(true);
    try {
      const asset = await uploadMediaFile(file, 'content', editingId);
      if (target === 'hero') {
        const updated = { ...draft, heroMediaId: asset.id };
        setDraft(updated);
        await networkApi.updateAdminContent(editingId, updated);
      } else {
        const galleryMediaIds = [...(draft.galleryMediaIds || []), asset.id];
        const updated = { ...draft, galleryMediaIds };
        setDraft(updated);
        await networkApi.updateAdminContent(editingId, updated);
      }
      setMessage('Media uploaded and attached. Public pages show previews/titles, not raw filenames.');
      await load();
    } catch (err: any) {
      setMessage(err.message || 'Media upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const payload = { ...draft, type, tags: Array.isArray(draft.tags) ? draft.tags : String(draft.tags || '').split(',').map((item) => item.trim()).filter(Boolean) };
      if (editingId) await networkApi.updateAdminContent(editingId, payload);
      else await networkApi.createAdminContent(payload);
      setDraft(emptyDraft(type));
      setEditingId(null);
      setMessage(`${label.slice(0, -1)} saved. Publishing state is real and public pages only show published records.`);
      await load();
    } catch (err: any) { setMessage(err.message); }
  }

  return (
    <DashboardShell eyebrow={`Admin / ${label}`} title={`${label} CMS`} nav={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="panel-cut p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <input className="field-sharp" placeholder="Search title/category/tags" value={q} onChange={(event) => setQ(event.target.value)} />
            <select className="field-sharp" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All status</option><option value="draft">Draft</option><option value="pending">Pending</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></select>
            <button className="btn-primary h-12 px-4 text-[11px]" onClick={load}>Search</button>
          </div>
          <div className="mt-5 grid gap-3">
            {items.length ? items.map((item) => (
              <button key={item.id} type="button" onClick={() => edit(item)} className="panel-blade text-left">
                <div className="flex flex-wrap items-center justify-between gap-3"><h3>{item.title}</h3><span className="status-chip">{item.status}</span></div>
                <p className="mt-2 text-sm text-silver/65">{item.category} • {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''}</p>
                <p className="mt-2 line-clamp-2 text-sm text-silver/55">{item.excerpt}</p>
              </button>
            )) : <EmptyPanel eyebrow={label} title={`No ${label.toLowerCase()} records`} body="Create the first real draft. Public pages remain empty until an item is published." />}
          </div>
        </section>
        <form onSubmit={submit} className="panel-cut space-y-4 p-5">
          <div className="flex items-center justify-between gap-3"><p className="eyebrow">{editingId ? 'Edit record' : 'New draft'}</p>{editingId ? <button type="button" className="btn-secondary h-9 px-3 text-[10px]" onClick={() => { setEditingId(null); setDraft(emptyDraft(type)); }}>Clear</button> : null}</div>
          <input className="field-sharp" placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          <input className="field-sharp" placeholder="Category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          <textarea className="field-sharp min-h-[80px]" placeholder="Excerpt" value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
          <textarea className="field-sharp min-h-[220px]" placeholder="Body / draft copy" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <input className="field-sharp" placeholder="Tags comma separated" value={Array.isArray(draft.tags) ? draft.tags.join(', ') : draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} />
          <div className="panel-blade">
            <h3>Hero / gallery media</h3>
            <p className="mt-2 text-sm leading-7 text-silver/62">Save the draft first, then attach uploaded media. Metadata can be edited in the Media Library.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="field-sharp cursor-pointer">{uploading ? 'Uploading…' : 'Upload hero media'}<input className="hidden" type="file" accept="image/*,video/*" disabled={!editingId || uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadContentMedia(file, 'hero'); e.currentTarget.value = ''; }} /></label>
              <label className="field-sharp cursor-pointer">{uploading ? 'Uploading…' : 'Add gallery media'}<input className="hidden" type="file" accept="image/*,video/*" disabled={!editingId || uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadContentMedia(file, 'gallery'); e.currentTarget.value = ''; }} /></label>
            </div>
            {draft.heroMedia ? <div className="mt-4"><MediaGrid media={[draft.heroMedia]} compact /></div> : null}
            {draft.galleryMedia?.length ? <div className="mt-4"><MediaGrid media={draft.galleryMedia} compact /></div> : null}
          </div>
          <div className="grid gap-3 md:grid-cols-3"><select className="field-sharp" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="draft">Draft</option><option value="pending">Pending</option><option value="published">Publish now</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></select><label className="panel-blade flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /> Featured</label><label className="panel-blade flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.sponsored} onChange={(e) => setDraft({ ...draft, sponsored: e.target.checked })} /> Sponsored</label></div>
          <div className="grid gap-3 md:grid-cols-2"><input className="field-sharp" placeholder="SEO title" value={draft.metaTitle || ''} onChange={(e) => setDraft({ ...draft, metaTitle: e.target.value })} /><input className="field-sharp" placeholder="SEO description" value={draft.metaDescription || ''} onChange={(e) => setDraft({ ...draft, metaDescription: e.target.value })} /></div>
          <button className="btn-primary h-12 justify-center text-[11px]" type="submit">{editingId ? 'Save revision' : 'Create draft'}</button>
          {message ? <p className="text-sm text-silver/70">{message}</p> : null}
        </form>
      </div>
    </DashboardShell>
  );
}
