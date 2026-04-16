import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';

export default function AccountDashboard() {
  const { currentProfile } = useSessionStore();

  return (
    <DashboardShell eyebrow="Account" title="My STATIK account" nav={accountNav}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Profile views', currentProfile.analytics.profileViews],
          ['QR visits', currentProfile.analytics.qrVisits],
          ['Link clicks', currentProfile.analytics.linkClicks],
          ['Engagement', currentProfile.analytics.engagementRate],
        ].map(([label, value]) => (
          <div key={label} className="panel p-5"><p className="text-xs uppercase tracking-[0.24em] text-silver/45">{label}</p><p className="mt-3 text-3xl font-semibold text-bone">{value}</p></div>
        ))}
      </div>
      <div className="panel p-6 md:p-8">
        <p className="eyebrow">Profile snapshot</p>
        <div className="mt-4 grid gap-6 md:grid-cols-[120px_1fr] md:items-center">
          <img src={currentProfile.avatar} alt={currentProfile.displayName} className="h-28 w-28 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-semibold text-bone">{currentProfile.displayName}</h2>
            <p className="mt-2 text-sm text-silver/65">{currentProfile.location} • {currentProfile.primaryCar}</p>
            <p className="mt-4 text-sm leading-7 text-silver/68">{currentProfile.bio}</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
