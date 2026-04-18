import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { AdminOverviewPayload } from '../../types/network';

export default function AdminGarage() {
  const [overview, setOverview] = useState<AdminOverviewPayload | null>(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setOverview(await networkApi.getAdminOverview());
    } catch (err: any) {
      setError(err.message || 'Garage registry failed to load.');
    }
  }

  useEffect(() => { void load(); }, []);

  const vehicles = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (overview?.vehicles || []).filter((vehicle) => !needle || [vehicle.nickname, vehicle.make, vehicle.model, vehicle.generation, vehicle.trim, vehicle.specialEdition, vehicle.profileId, vehicle.visibility].join(' ').toLowerCase().includes(needle));
  }, [overview, q]);

  return (
    <DashboardShell eyebrow="Admin / garage" title="Machine registry oversight" nav={adminNav}>
      <section className="panel-cut p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Garage isolation and build dossiers</p>
            <h2 className="headline-md mt-3">Inspect vehicle ownership, visibility and dossier completeness.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-silver/68">Vehicles remain owner-scoped. Admin inspection is operational only and all direct user actions are managed from the user detail page.</p>
          </div>
          <button className="btn-secondary h-11 px-5 text-xs" type="button" onClick={() => void load()}>Refresh registry</button>
        </div>
        <input className="field-sharp mt-6" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search make, model, variant, profile ID, visibility…" />
        {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {vehicles.map((vehicle) => (
            <article key={vehicle.id} className="panel-blade">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-rust">{vehicle.nickname || 'Garage bay'}</p>
                  <h3 className="mt-2 text-xl uppercase tracking-[0.08em] text-bone">{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}</h3>
                  <p className="mt-2 text-sm text-silver/65">{[vehicle.generation, vehicle.trim, vehicle.specialEdition].filter(Boolean).join(' · ') || 'No trim/variant recorded'}</p>
                </div>
                <span className="status-chip">{vehicle.visibility}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="panel-blade bg-black/20"><p className="text-xs uppercase tracking-[0.18em] text-silver/45">Drivetrain</p><p className="mt-2 text-sm text-bone">{vehicle.drivetrain || '—'}</p></div>
                <div className="panel-blade bg-black/20"><p className="text-xs uppercase tracking-[0.18em] text-silver/45">Engine</p><p className="mt-2 text-sm text-bone">{vehicle.engineCode || vehicle.engineFamily || '—'}</p></div>
                <div className="panel-blade bg-black/20"><p className="text-xs uppercase tracking-[0.18em] text-silver/45">Profile</p><p className="mt-2 break-all font-mono text-xs text-bone">{vehicle.profileId}</p></div>
              </div>
            </article>
          ))}
        </div>
        {!vehicles.length ? <div className="empty-state mt-6">No vehicles match this registry search.</div> : null}
      </section>
    </DashboardShell>
  );
}
