import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';

export default function AdminAuditLogs() {
  return (
    <DashboardShell eyebrow="Admin / audit" title="Audit logs" nav={adminNav}>
      <div className="space-y-4">
        {[
          'Admin approved imported event from Queensland Raceway adapter',
          'Moderator requested revision on S15 video submission',
          'Admin updated homepage featured rail order',
          'Super-admin toggled maintenance mode off',
        ].map((item, index) => (
          <div key={item} className="panel p-6"><p className="text-sm font-semibold text-bone">{item}</p><p className="mt-2 text-sm text-silver/65">Audit #{184 + index} • actor tracked • timestamp stored • entity linked</p></div>
        ))}
      </div>
    </DashboardShell>
  );
}
