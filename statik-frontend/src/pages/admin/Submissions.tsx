import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, submissions } from '../../data/platform';

export default function AdminSubmissions() {
  return (
    <DashboardShell eyebrow="Admin / submissions" title="Community submissions" nav={adminNav}>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="panel p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-bone">{submission.title}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-silver/55">{submission.type} • {submission.status}</p>
              </div>
              <p className="text-sm text-silver/65">{submission.submittedBy}</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-silver/68">{submission.notes}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
