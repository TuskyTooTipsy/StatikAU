import DashboardShell from '../../components/platform/DashboardShell';
import { adminMetrics, adminNav } from '../../data/platform';

export default function AdminAnalytics() {
  return (
    <DashboardShell eyebrow="Admin / analytics" title="Platform analytics" nav={adminNav}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => <div key={metric.label} className="panel p-5"><p className="text-xs uppercase tracking-[0.24em] text-silver/45">{metric.label}</p><p className="mt-3 text-3xl font-semibold text-bone">{metric.value}</p></div>)}
      </div>
      <div className="panel p-6 md:p-8">
        <p className="eyebrow">What is tracked</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm text-silver/68">
          <p>profile views</p><p>qr-driven visits</p><p>link clicks</p><p>event traffic</p><p>post engagement</p><p>sponsor slot performance</p><p>import job outcomes</p><p>moderation throughput</p>
        </div>
      </div>
    </DashboardShell>
  );
}
