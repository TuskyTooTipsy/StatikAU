import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, adminQueues } from '../../data/platform';

export default function AdminReports() {
  return (
    <DashboardShell eyebrow="Admin / reports" title="Comments and reports" nav={adminNav}>
      <div className="space-y-4">
        {adminQueues.reports.map((row) => (
          <div key={row.join('-')} className="panel p-6">
            <p className="text-sm font-semibold text-bone">{row[0]}</p>
            <p className="mt-2 text-sm text-silver/65">{row[1]}</p>
            <p className="mt-1 text-sm text-silver/55">{row[2]}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
