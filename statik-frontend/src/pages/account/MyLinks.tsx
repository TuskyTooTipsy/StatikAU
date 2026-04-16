import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';

export default function MyLinks() {
  const { currentProfile } = useSessionStore();

  return (
    <DashboardShell eyebrow="Account / links" title="My links" nav={accountNav}>
      <div className="panel p-6 md:p-8">
        <div className="space-y-4">
          {currentProfile.links.map((link) => (
            <div key={link.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-bone">{link.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-silver/55">{link.type}</p>
                </div>
                <p className="text-sm text-silver/65">{link.clicks} clicks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
