import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';

export default function MyAnalytics() {
  const { currentProfile } = useSessionStore();

  return (
    <DashboardShell eyebrow="Account / analytics" title="My analytics" nav={accountNav}>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="panel p-6 md:p-8">
          <p className="eyebrow">Traffic summary</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Profile views</p><p className="mt-3 text-3xl font-semibold text-bone">{currentProfile.analytics.profileViews}</p></div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">QR visits</p><p className="mt-3 text-3xl font-semibold text-bone">{currentProfile.analytics.qrVisits}</p></div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Link clicks</p><p className="mt-3 text-3xl font-semibold text-bone">{currentProfile.analytics.linkClicks}</p></div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.24em] text-silver/50">Engagement</p><p className="mt-3 text-3xl font-semibold text-bone">{currentProfile.analytics.engagementRate}</p></div>
          </div>
        </div>
        <div className="panel p-6 md:p-8">
          <p className="eyebrow">Top traffic sources</p>
          <div className="mt-4 space-y-4 text-sm text-silver/68">
            <p>QR code from event signage</p>
            <p>Instagram bio and reel mentions</p>
            <p>STATIK featured community rail</p>
            <p>Official post profile tags</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
