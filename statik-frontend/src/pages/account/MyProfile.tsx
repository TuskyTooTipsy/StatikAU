import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';

export default function MyProfile() {
  const { currentProfile } = useSessionStore();

  return (
    <DashboardShell eyebrow="Account / profile" title="Edit profile" nav={accountNav}>
      <div className="panel space-y-5 p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div><label className="text-xs uppercase tracking-[0.24em] text-silver/50">Display name</label><input defaultValue={currentProfile.displayName} className="field mt-3" /></div>
          <div><label className="text-xs uppercase tracking-[0.24em] text-silver/50">Location</label><input defaultValue={currentProfile.location} className="field mt-3" /></div>
        </div>
        <div><label className="text-xs uppercase tracking-[0.24em] text-silver/50">Bio</label><textarea defaultValue={currentProfile.bio} className="field mt-3 min-h-[160px]" /></div>
        <div className="grid gap-5 md:grid-cols-2">
          <div><label className="text-xs uppercase tracking-[0.24em] text-silver/50">Primary car</label><input defaultValue={currentProfile.primaryCar} className="field mt-3" /></div>
          <div><label className="text-xs uppercase tracking-[0.24em] text-silver/50">Sponsors</label><input defaultValue={currentProfile.sponsors.join(', ')} className="field mt-3" /></div>
        </div>
        <button type="button" className="btn-primary h-12 px-6 text-xs">Save profile changes</button>
      </div>
    </DashboardShell>
  );
}
