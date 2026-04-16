import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';

export default function AdminSettings() {
  const { maintenanceMode, toggleMaintenanceMode } = useSessionStore();

  return (
    <DashboardShell eyebrow="Admin / settings" title="Site settings" nav={adminNav}>
      <div className="panel p-6 md:p-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-semibold text-bone">Maintenance mode</p>
          <p className="mt-3 text-sm leading-7 text-silver/68">Pause public access while keeping admin access available for moderation, imports, or emergency updates.</p>
          <button type="button" onClick={toggleMaintenanceMode} className="btn-primary mt-5 h-11 px-5 text-xs">{maintenanceMode ? 'Disable maintenance mode' : 'Enable maintenance mode'}</button>
        </div>
      </div>
    </DashboardShell>
  );
}
