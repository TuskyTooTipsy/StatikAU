import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { AdminOverviewPayload, MediaAsset } from '../../types/network';

export default function AdminMedia() {
  const [overview, setOverview] = useState<AdminOverviewPayload | null>(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setOverview(await networkApi.getAdminOverview());
    } catch (err: any) {
      setError(err.message || 'Media queue failed to load.');
    }
  }

  useEffect(() => { void load(); }, []);

  const media = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (overview?.media || []).filter((item) => !needle || [item.displayTitle, item.caption, item.altText, item.originalFilename || item.fileName, item.ownerType, item.ownerId, item.ownerUserId, item.mimeType].join(' ').toLowerCase().includes(needle));
  }, [overview, q]);


  async function editMetadata(item: MediaAsset) {
    const displayTitle = window.prompt('Display title', item.displayTitle || '') ?? (item.displayTitle || '');
    const caption = window.prompt('Caption', item.caption || '') ?? (item.caption || '');
    const altText = window.prompt('Alt text', item.altText || displayTitle || caption || '') ?? (item.altText || '');
    setBusyId(item.id);
    try {
      await networkApi.updateMedia(item.id, { displayTitle, caption, altText });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: MediaAsset) {
    if (!window.confirm(`Remove media asset ${item.displayTitle || item.originalFilename || item.id}? This is audit logged.`)) return;
    setBusyId(item.id);
    try {
      await networkApi.adminDeleteMedia(item.id);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardShell eyebrow="Admin / media" title="Upload and storage moderation" nav={adminNav}>
      <section className="panel-cut p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Uploaded assets</p>
            <h2 className="headline-md mt-3">Profile, garage, event and community media control.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-silver/68">Inspect uploaded media ownership, remove abusive assets, and verify storage/provider health from settings.</p>
          </div>
          <button className="btn-secondary h-11 px-5 text-xs" type="button" onClick={() => void load()}>Refresh media</button>
        </div>
        <input className="field-sharp mt-6" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search file, owner, MIME type, entity ID…" />
        {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <article key={item.id} className="panel-blade">
              <div className="aspect-video overflow-hidden border border-white/10 bg-black/40">
                {item.kind === 'video' ? <video src={item.url} className="h-full w-full object-cover" controls /> : <img src={item.url} alt={item.altText || item.displayTitle || item.originalFilename || 'Media asset'} className="h-full w-full object-cover" />}
              </div>
              <h3 className="mt-4 truncate text-sm uppercase tracking-[0.12em] text-bone">{item.displayTitle || item.caption || item.originalFilename || item.fileName}</h3>
              <p className="mt-2 font-mono text-xs text-silver/45">{item.ownerType} · {item.ownerId}</p>
              <p className="mt-1 font-mono text-xs text-silver/45">{item.mimeType} · {Math.round(item.size / 1024)} KB</p>
              {item.originalFilename ? <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-silver/35">original: {item.originalFilename}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2"><button disabled={busyId === item.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void editMetadata(item)}>Edit metadata</button><button disabled={busyId === item.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void remove(item)}>Remove media</button></div>
            </article>
          ))}
        </div>
        {!media.length ? <div className="empty-state mt-6">No uploaded media matches this search.</div> : null}
      </section>
    </DashboardShell>
  );
}
