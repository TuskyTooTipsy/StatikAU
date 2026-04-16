import DashboardShell from '../../components/platform/DashboardShell';
import { adminMetrics, adminNav, adminQueues } from '../../data/platform';

export default function AdminOverview() {
  return (
    <DashboardShell eyebrow="Admin" title="STATIK control center" nav={adminNav}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <div key={metric.label} className="panel p-5"><p className="text-xs uppercase tracking-[0.24em] text-silver/45">{metric.label}</p><p className="mt-3 text-3xl font-semibold text-bone">{metric.value}</p><p className="mt-2 text-sm text-silver/65">{metric.delta}</p></div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {Object.entries(adminQueues).map(([key, rows]) => (
          <div key={key} className="panel p-6">
            <p className="eyebrow">{key}</p>
            <div className="mt-4 space-y-4">
              {rows.map((row) => (
                <div key={row.join('-')} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-bone">{row[0]}</p>
                  <p className="mt-2 text-sm text-silver/65">{row[1]}</p>
                  <p className="mt-1 text-sm text-silver/55">{row[2]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
