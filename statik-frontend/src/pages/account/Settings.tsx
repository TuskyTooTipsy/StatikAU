import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';
import type { UserRole } from '../../types/platform';

const roles: UserRole[] = ['guest', 'user', 'moderator', 'admin', 'super-admin'];

export default function AccountSettings() {
  const { role, setRole } = useSessionStore();

  return (
    <DashboardShell eyebrow="Account / settings" title="Account settings" nav={accountNav}>
      <div className="panel space-y-5 p-6 md:p-8">
        <div>
          <label className="text-xs uppercase tracking-[0.24em] text-silver/50">Role preview</label>
          <select value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="field mt-3 max-w-sm">
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <p className="mt-3 text-sm leading-7 text-silver/68">For this build, role switching is exposed in the UI so the admin and moderation surfaces can be tested quickly.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
