import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav, submissions } from '../../data/platform';

export default function MySubmissions() {
  return (
    <DashboardShell eyebrow="Account / submissions" title="My submissions" nav={accountNav}>
      <div className="panel p-6 md:p-8">
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-bone">{submission.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-silver/55">{submission.type} • {submission.status}</p>
                </div>
                <p className="text-sm text-silver/65">{new Date(submission.submittedAt).toLocaleDateString()}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-silver/67">{submission.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
