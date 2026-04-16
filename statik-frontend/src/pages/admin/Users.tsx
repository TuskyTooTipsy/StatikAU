import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, profiles } from '../../data/platform';

export default function AdminUsers() {
  return (
    <DashboardShell eyebrow="Admin / users" title="Users and profiles" nav={adminNav}>
      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.24em] text-silver/45">
          <p>User</p><p>Location</p><p>Primary car</p><p>Status</p>
        </div>
        {profiles.map((profile) => (
          <div key={profile.id} className="grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-sm text-silver/70 last:border-b-0">
            <p className="text-bone">{profile.displayName}</p><p>{profile.location}</p><p>{profile.primaryCar}</p><p>{profile.featured ? 'featured' : 'approved'}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
