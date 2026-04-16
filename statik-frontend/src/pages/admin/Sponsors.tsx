import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, partnerPlacements } from '../../data/platform';

export default function AdminSponsors() {
  return (
    <DashboardShell eyebrow="Admin / sponsors" title="Sponsors and deals" nav={adminNav}>
      <div className="grid gap-5 xl:grid-cols-3">
        {partnerPlacements.map((placement) => (
          <div key={placement.title} className="panel p-6">
            <p className="text-xl font-semibold text-bone">{placement.title}</p>
            <p className="mt-3 text-sm leading-7 text-silver/68">{placement.body}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
