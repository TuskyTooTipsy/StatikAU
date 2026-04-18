import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { AdminOverviewPayload } from '../../types/network';

export default function AdminLinksPage() {
  const [overview, setOverview] = useState<AdminOverviewPayload | null>(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try { setError(null); setOverview(await networkApi.getAdminOverview()); } catch (err: any) { setError(err.message || 'Short links failed to load.'); }
  }
  useEffect(() => { void load(); }, []);

  const links = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (overview?.shortLinks || []).filter((link) => !needle || [link.slug, link.targetType, link.targetId, link.ownerUserId].join(' ').toLowerCase().includes(needle));
  }, [overview, q]);

  return (
    <DashboardShell eyebrow="Admin / QR + links" title="Canonical short-link and QR command board" nav={adminNav}>
      <section className="panel-cut p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">statik.au only</p>
            <h2 className="headline-md mt-3">Inspect slugs, QR scans, and click tracking.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-silver/68">User-facing share URLs must stay on the canonical public app domain. Backend/Railway/local URLs stay out of public QR displays.</p>
          </div>
          <button className="btn-secondary h-11 px-5 text-xs" type="button" onClick={() => void load()}>Refresh</button>
        </div>
        <input className="field-sharp mt-6" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search slug, target type, owner…" />
        {error ? <p className="mt-4 text-sm text-[#ff8f8f]">{error}</p> : null}
        <div className="mt-6 grid gap-3">
          {links.map((link) => (
            <article key={link.id} className="panel-blade">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3>https://statik.au/s/{link.slug}</h3>
                  <p className="mt-2 text-sm text-silver/70">{link.targetType} · {link.targetId}</p>
                  <p className="mt-2 font-mono text-xs text-silver/45">Owner: {link.ownerUserId}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="status-chip">{link.clickCount || 0} clicks</span>
                  <span className="status-chip">{link.qrScanCount || 0} QR scans</span>
                </div>
              </div>
            </article>
          ))}
          {!links.length ? <div className="empty-state">No short links match this search yet.</div> : null}
        </div>
      </section>
    </DashboardShell>
  );
}
