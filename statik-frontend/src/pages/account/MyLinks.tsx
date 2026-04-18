import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { NetworkProfileLink, NetworkShortLink } from '../../types/network';

export default function MyLinks() {
  const [links, setLinks] = useState<NetworkProfileLink[]>([]);
  const [shortLinks, setShortLinks] = useState<NetworkShortLink[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', href: '', type: 'other' as 'social' | 'build' | 'garage' | 'group' | 'other' });
  const [slugDrafts, setSlugDrafts] = useState<Record<string, string>>({});

  async function load() {
    try {
      const [profileLinks, shortLinkPayload] = await Promise.all([networkApi.getMyLinks(), networkApi.listMyShortLinks()]);
      setLinks(profileLinks);
      setShortLinks(shortLinkPayload);
      setSlugDrafts(Object.fromEntries(shortLinkPayload.map((item) => [item.id, item.slug])));
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    try {
      await networkApi.createMyLink(form);
      setForm({ label: '', href: '', type: 'other' });
      load();
    } catch (error: any) {
      setMessage(error.message);
    }
  }

  return (
    <DashboardShell eyebrow="Members / links" title="Share rails + slug control" nav={accountNav}>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Profile links</p>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <input className="field-sharp" placeholder="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
            <input className="field-sharp" placeholder="https://..." value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} required />
            <select className="field-sharp" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}>
              <option value="other">Other</option>
              <option value="social">Social</option>
              <option value="build">Build</option>
              <option value="garage">Garage</option>
              <option value="group">Group</option>
            </select>
            <button className="btn-primary h-12 justify-center text-[11px]">Add external link</button>
          </form>
          <div className="mt-6 grid gap-3">
            {links.length ? links.map((link) => (
              <div key={link.id} className="panel-blade flex items-center justify-between gap-4">
                <div>
                  <h3>{link.label}</h3>
                  <p className="mt-2 text-sm text-silver/70 break-all">{link.href}</p>
                </div>
                <button type="button" onClick={async () => { await networkApi.deleteMyLink(link.id); load(); }} className="btn-secondary h-10 px-4 text-[11px]">Delete</button>
              </div>
            )) : <p className="text-sm text-silver/60">No outbound links yet.</p>}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Short links</p>
          <div className="mt-6 grid gap-4">
            {shortLinks.length ? shortLinks.map((link) => (
              <div key={link.id} className="panel-blade space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3>{link.targetType}</h3>
                    <p className="mt-2 text-sm text-silver/70 break-all">{link.shortUrl}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-silver/50">{link.clickCount} clicks • {link.qrScanCount} qr scans</p>
                  </div>
                  <a href={link.shortUrl} target="_blank" rel="noreferrer" className="btn-secondary h-10 px-4 text-[11px]">Open</a>
                </div>
                <div className="flex flex-wrap gap-3">
                  <input className="field-sharp max-w-[260px]" value={slugDrafts[link.id] || ''} onChange={(e) => setSlugDrafts((prev) => ({ ...prev, [link.id]: e.target.value }))} />
                  <button type="button" onClick={async () => { await networkApi.claimShortLink(link.id, slugDrafts[link.id] || link.slug); load(); }} className="btn-primary h-11 px-4 text-[11px]">Claim slug</button>
                </div>
              </div>
            )) : <p className="text-sm text-silver/60">No short links available yet.</p>}
          </div>
        </div>
      </div>
      {message ? <p className="text-sm text-silver/70">{message}</p> : null}
    </DashboardShell>
  );
}
