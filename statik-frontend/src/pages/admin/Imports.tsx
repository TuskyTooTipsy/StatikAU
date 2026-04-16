import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, adminQueues } from '../../data/platform';

export default function AdminImports() {
  return (
    <DashboardShell eyebrow="Admin / imports" title="Event imports" nav={adminNav}>
      <div className="panel p-6 md:p-8">
        <div className="space-y-4">
          {adminQueues.imports.map((row) => (
            <div key={row.join('-')} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-bone">{row[0]}</p>
              <p className="mt-2 text-sm text-silver/65">{row[1]}</p>
              <p className="mt-1 text-sm text-silver/55">{row[2]}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
