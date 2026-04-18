import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { NetworkSiteState, RuntimeDiagnostics } from '../../types/network';

export default function AdminSettings() {
  const [site, setSite] = useState<NetworkSiteState | null>(null);
  const [diagnostics, setDiagnostics] = useState<RuntimeDiagnostics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const overview = await networkApi.getAdminOverview();
      setSite(overview.site);
      setDiagnostics(overview.diagnostics || null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(key: string, payload: Partial<NetworkSiteState>) {
    setSavingKey(key);
    try {
      setError(null);
      const updated = await networkApi.updateSite(payload);
      setSite(updated);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <DashboardShell eyebrow="Admin / settings" title="Site command settings" nav={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="panel-cut p-6 md:p-8 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Deployment health</p>
              <h2 className="headline-md mt-3">Canonical domain, API origin, storage, map and moderation controls.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-silver/68">Public QR/share links must resolve through statik.au. Upload URLs must resolve through the Railway backend or configured storage public URL. These checks are read from the backend runtime, not hardcoded UI text.</p>
            </div>
            <button type="button" onClick={() => void load()} className="btn-secondary h-11 px-5 text-xs">Refresh checks</button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="panel-blade">
              <p className="text-xs uppercase tracking-[0.24em] text-silver/45">Public app URL</p>
              <p className="mt-3 break-all font-mono text-sm text-bone">{diagnostics?.publicAppUrl || 'Not reported'}</p>
            </div>
            <div className="panel-blade">
              <p className="text-xs uppercase tracking-[0.24em] text-silver/45">Backend/API URL</p>
              <p className="mt-3 break-all font-mono text-sm text-bone">{diagnostics?.publicServerUrl || 'Not reported'}</p>
            </div>
            <div className="panel-blade">
              <p className="text-xs uppercase tracking-[0.24em] text-silver/45">Storage</p>
              <p className="mt-3 font-mono text-sm text-bone">{diagnostics?.storageProvider || 'unknown'}</p>
              <p className="mt-2 break-all text-xs text-silver/50">{diagnostics?.storagePublicUrl || 'No storage public URL reported'}</p>
            </div>
            <div className="panel-blade">
              <p className="text-xs uppercase tracking-[0.24em] text-silver/45">Upload limit</p>
              <p className="mt-3 font-mono text-sm text-bone">{diagnostics ? `${Math.round(diagnostics.maxUploadBytes / 1024 / 1024)} MB` : 'unknown'}</p>
              <p className="mt-2 text-xs text-silver/50">Node {diagnostics?.nodeEnv || 'unknown'}</p>
            </div>
          </div>
          {diagnostics?.allowedOrigins?.length ? (
            <div className="mt-4 panel-blade">
              <p className="text-xs uppercase tracking-[0.24em] text-silver/45">Allowed origins</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {diagnostics.allowedOrigins.map((origin) => <span key={origin} className="status-chip break-all">{origin}</span>)}
              </div>
            </div>
          ) : null}
          {diagnostics?.warnings?.length ? (
            <div className="mt-4 panel-blade border-[#ffb15c]/30 bg-[#ffb15c]/5">
              <p className="eyebrow text-[#ffcf91]">Production warnings</p>
              <ul className="mt-4 grid gap-2 text-sm leading-7 text-[#ffdfb6]">
                {diagnostics.warnings.map((warning) => <li key={warning}>• {warning}</li>)}
              </ul>
            </div>
          ) : (
            <div className="mt-4 panel-blade border-emerald-300/20 bg-emerald-300/5 text-sm text-emerald-100/80">No backend runtime warnings reported.</div>
          )}
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Core controls</p>
          <div className="mt-6 grid gap-4">
            <div className="panel-blade">
              <h3>Maintenance mode</h3>
              <p className="mt-3 text-sm leading-7 text-silver/68">Pause public access while keeping the command layer available.</p>
              <button type="button" onClick={() => void save('maintenanceMode', { maintenanceMode: !site?.maintenanceMode })} className="btn-primary mt-5 h-11 px-5 text-xs">{savingKey === 'maintenanceMode' ? 'Saving…' : site?.maintenanceMode ? 'Disable maintenance mode' : 'Enable maintenance mode'}</button>
            </div>
            <div className="panel-blade">
              <h3>Registration</h3>
              <p className="mt-3 text-sm leading-7 text-silver/68">Open or close self-serve account creation.</p>
              <button type="button" onClick={() => void save('registrationOpen', { registrationOpen: !site?.registrationOpen })} className="btn-secondary mt-5 h-11 px-5 text-xs">{savingKey === 'registrationOpen' ? 'Saving…' : site?.registrationOpen ? 'Close registration' : 'Open registration'}</button>
            </div>
            <div className="panel-blade">
              <h3>Shop lock</h3>
              <p className="mt-3 text-sm leading-7 text-silver/68">Preserve the shop as secondary until intentionally unlocked.</p>
              <button type="button" onClick={() => void save('shopLocked', { shopLocked: !site?.shopLocked })} className="btn-secondary mt-5 h-11 px-5 text-xs">{savingKey === 'shopLocked' ? 'Saving…' : site?.shopLocked ? 'Unlock shop' : 'Lock shop'}</button>
            </div>
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Events + moderation</p>
          <div className="mt-6 grid gap-4">
            <div className="panel-blade">
              <h3>Homepage hero mode</h3>
              <select className="field-sharp mt-4" value={site?.homepageHeroMode || 'events'} onChange={(e) => void save('homepageHeroMode', { homepageHeroMode: e.target.value as 'events' | 'hybrid' })}>
                <option value="events">events</option>
                <option value="hybrid">hybrid</option>
              </select>
            </div>
            <div className="panel-blade">
              <h3>Event visibility mode</h3>
              <select className="field-sharp mt-4" value={site?.eventVisibilityMode || 'open'} onChange={(e) => void save('eventVisibilityMode', { eventVisibilityMode: e.target.value as 'open' | 'curated' })}>
                <option value="open">open</option>
                <option value="curated">curated</option>
              </select>
            </div>
            <div className="panel-blade">
              <h3>Approval workflow</h3>
              <select className="field-sharp mt-4" value={site?.approvalWorkflowDefault || 'manual'} onChange={(e) => void save('approvalWorkflowDefault', { approvalWorkflowDefault: e.target.value as 'manual' | 'trusted_auto_queue' })}>
                <option value="manual">manual review</option>
                <option value="trusted_auto_queue">trusted queue</option>
              </select>
            </div>
            <div className="panel-blade">
              <h3>Imports enabled</h3>
              <button type="button" onClick={() => void save('importsEnabled', { importsEnabled: !site?.importsEnabled })} className="btn-secondary mt-5 h-11 px-5 text-xs">{savingKey === 'importsEnabled' ? 'Saving…' : site?.importsEnabled ? 'Disable imports' : 'Enable imports'}</button>
            </div>
            <div className="panel-blade">
              <h3>Message moderation</h3>
              <button type="button" onClick={() => void save('messageModerationEnabled', { messageModerationEnabled: !site?.messageModerationEnabled })} className="btn-secondary mt-5 h-11 px-5 text-xs">{savingKey === 'messageModerationEnabled' ? 'Saving…' : site?.messageModerationEnabled ? 'Disable message moderation' : 'Enable message moderation'}</button>
            </div>
            <div className="panel-blade">
              <h3>Sponsor/event modules</h3>
              <button type="button" onClick={() => void save('sponsorEventModuleEnabled', { sponsorEventModuleEnabled: !site?.sponsorEventModuleEnabled })} className="btn-secondary mt-5 h-11 px-5 text-xs">{savingKey === 'sponsorEventModuleEnabled' ? 'Saving…' : site?.sponsorEventModuleEnabled ? 'Disable sponsored modules' : 'Enable sponsored modules'}</button>
            </div>
            <div className="panel-blade">
              <h3>Feature window default</h3>
              <input className="field-sharp mt-4" type="number" min={1} max={30} value={site?.featureWindowDaysDefault || 3} onChange={(e) => setSite((current) => current ? { ...current, featureWindowDaysDefault: Number(e.target.value) || 3 } : current)} />
              <button type="button" onClick={() => void save('featureWindowDaysDefault', { featureWindowDaysDefault: site?.featureWindowDaysDefault || 3 })} className="btn-secondary mt-4 h-11 px-5 text-xs">Save default</button>
            </div>
            <div className="panel-blade">
              <h3>Audit retention days</h3>
              <input className="field-sharp mt-4" type="number" min={30} max={730} value={site?.auditRetentionDays || 180} onChange={(e) => setSite((current) => current ? { ...current, auditRetentionDays: Number(e.target.value) || 180 } : current)} />
              <button type="button" onClick={() => void save('auditRetentionDays', { auditRetentionDays: site?.auditRetentionDays || 180 })} className="btn-secondary mt-4 h-11 px-5 text-xs">Save retention</button>
            </div>
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8 xl:col-span-2">
          <p className="eyebrow">Brand + provider settings</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="panel-blade">
              <h3>Brand tagline</h3>
              <input className="field-sharp mt-4" value={site?.brandTagline || ''} onChange={(e) => setSite((current) => current ? { ...current, brandTagline: e.target.value } : current)} />
              <button type="button" onClick={() => void save('brandTagline', { brandTagline: site?.brandTagline || '' })} className="btn-secondary mt-4 h-11 px-5 text-xs">Save tagline</button>
            </div>
            <div className="panel-blade">
              <h3>Map provider</h3>
              <p className="mt-3 text-sm leading-7 text-silver/60">Google Maps requires VITE_GOOGLE_MAPS_API_KEY on Netlify. Mapbox remains accepted for backwards compatibility, and manual mode keeps precise lat/lng entry available without fake maps.</p>
              <select className="field-sharp mt-4" value={site?.mapProvider || 'manual'} onChange={(e) => void save('mapProvider', { mapProvider: e.target.value as 'google' | 'mapbox' | 'manual' })}>
                <option value="google">google maps</option>
                <option value="mapbox">mapbox legacy</option>
                <option value="manual">manual</option>
              </select>
            </div>
          </div>
          {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}
        </div>
      </div>
    </DashboardShell>
  );
}
