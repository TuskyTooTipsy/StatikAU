import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { NetworkSiteState } from '../../types/network';

export default function AdminSettings() {
  const [site, setSite] = useState<NetworkSiteState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const overview = await networkApi.getAdminOverview();
      setSite(overview.site);
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
      setSite(await networkApi.updateSite(payload));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <DashboardShell eyebrow="Admin / settings" title="Site settings" nav={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
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
              <h3>Imports enabled</h3>
              <button type="button" onClick={() => void save('importsEnabled', { importsEnabled: !site?.importsEnabled })} className="btn-secondary mt-5 h-11 px-5 text-xs">{savingKey === 'importsEnabled' ? 'Saving…' : site?.importsEnabled ? 'Disable imports' : 'Enable imports'}</button>
            </div>
            <div className="panel-blade">
              <h3>Message moderation</h3>
              <button type="button" onClick={() => void save('messageModerationEnabled', { messageModerationEnabled: !site?.messageModerationEnabled })} className="btn-secondary mt-5 h-11 px-5 text-xs">{savingKey === 'messageModerationEnabled' ? 'Saving…' : site?.messageModerationEnabled ? 'Disable message moderation' : 'Enable message moderation'}</button>
            </div>
            <div className="panel-blade">
              <h3>Feature window default</h3>
              <input className="field-sharp mt-4" type="number" min={1} max={30} value={site?.featureWindowDaysDefault || 3} onChange={(e) => setSite((current) => current ? { ...current, featureWindowDaysDefault: Number(e.target.value) || 3 } : current)} />
              <button type="button" onClick={() => void save('featureWindowDaysDefault', { featureWindowDaysDefault: site?.featureWindowDaysDefault || 3 })} className="btn-secondary mt-4 h-11 px-5 text-xs">Save default</button>
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
              <select className="field-sharp mt-4" value={site?.mapProvider || 'manual'} onChange={(e) => void save('mapProvider', { mapProvider: e.target.value as 'mapbox' | 'manual' })}>
                <option value="mapbox">mapbox</option>
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
