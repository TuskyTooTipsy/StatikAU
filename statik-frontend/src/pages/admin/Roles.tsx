import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';

export default function AdminRoles() {
  return (
    <DashboardShell eyebrow="Admin / roles" title="Roles and permissions" nav={adminNav}>
      <div className="panel overflow-hidden">
        <div className="grid grid-cols-2 gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.24em] text-silver/45"><p>Role</p><p>Core powers</p></div>
        {[
          ['guest', 'read public content'],
          ['user', 'profile, submit, comment, own analytics'],
          ['moderator', 'review submissions, comments, reports'],
          ['admin', 'site operations, approvals, imports, placements'],
          ['super-admin', 'roles, maintenance, critical settings'],
        ].map((item) => (
          <div key={item[0]} className="grid grid-cols-2 gap-4 border-b border-white/10 px-6 py-4 text-sm text-silver/68 last:border-b-0"><p className="text-bone">{item[0]}</p><p>{item[1]}</p></div>
        ))}
      </div>
    </DashboardShell>
  );
}
