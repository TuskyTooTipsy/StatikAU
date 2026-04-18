import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { NetworkProfile } from '../../types/network';

function LineStrip({ points }: { points: Array<{ date: string; count: number }> }) {
  const max = Math.max(...points.map((point) => point.count), 1);
  const width = 320;
  const height = 88;
  const path = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * width;
    const y = height - (point.count / max) * (height - 8) - 4;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80" />
    </svg>
  );
}

export default function MyAnalytics() {
  const [analytics, setAnalytics] = useState<NonNullable<NetworkProfile['analytics']> | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    networkApi.getMyAnalytics().then(setAnalytics).catch((error) => setMessage(error.message));
  }, []);

  return (
    <DashboardShell eyebrow="Members / analytics" title="Scene traction telemetry" nav={accountNav}>
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Visibility summary</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="stat-block"><span className="stat-value">{analytics?.profileViews ?? 0}</span><span className="stat-label">profile views</span></div>
            <div className="stat-block"><span className="stat-value">{analytics?.uniqueVisitors ?? 0}</span><span className="stat-label">unique visitors</span></div>
            <div className="stat-block"><span className="stat-value">{analytics?.garageViews ?? 0}</span><span className="stat-label">garage views</span></div>
            <div className="stat-block"><span className="stat-value">{analytics?.linkClicks ?? 0}</span><span className="stat-label">short-link clicks</span></div>
            <div className="stat-block"><span className="stat-value">{analytics?.qrScans ?? 0}</span><span className="stat-label">qr scans</span></div>
            <div className="stat-block"><span className="stat-value">{analytics?.followerCount ?? 0}</span><span className="stat-label">friend network</span></div>
          </div>
          {analytics?.profileViewTrend?.length ? (
            <div className="mt-8 border border-white/10 bg-black/30 p-4" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-silver/50">Profile visit trend</p>
                  <p className="mt-2 text-sm text-silver/70">Last 14 days of real traffic only.</p>
                </div>
                {analytics.visibilitySpike ? <span className="status-chip">Spike {analytics.visibilitySpike}</span> : null}
              </div>
              <LineStrip points={analytics.profileViewTrend} />
            </div>
          ) : null}
        </div>

        <div className="grid gap-6">
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Top-performing vehicles</p>
            <div className="mt-4 grid gap-3">
              {analytics?.topVehicles?.length ? analytics.topVehicles.map((item) => (
                <div key={item.id} className="panel-blade flex items-center justify-between gap-3">
                  <div>
                    <h3>{item.label}</h3>
                  </div>
                  <span className="status-chip">{item.count} views</span>
                </div>
              )) : <p className="text-sm text-silver/60">No vehicle view data yet.</p>}
            </div>
          </div>
          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Top-performing posts</p>
            <div className="mt-4 grid gap-3">
              {analytics?.topPosts?.length ? analytics.topPosts.map((item) => (
                <div key={item.id} className="panel-blade flex items-center justify-between gap-3">
                  <p className="text-sm leading-6 text-silver/72">{item.caption || 'Untitled post'}</p>
                  <span className="status-chip">{item.count} views</span>
                </div>
              )) : <p className="text-sm text-silver/60">No post view data yet.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Discovery sources</p>
          <div className="mt-4 grid gap-3">
            {analytics?.sources?.length ? analytics.sources.map((item) => (
              <div key={item.label} className="panel-blade flex items-center justify-between gap-3">
                <h3>{item.label}</h3>
                <span className="status-chip">{item.count}</span>
              </div>
            )) : <p className="text-sm text-silver/60">No discovery source breakdown yet.</p>}
          </div>
        </div>
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Affiliation lift</p>
          <div className="mt-4 grid gap-3">
            {analytics?.topAffiliations?.length ? analytics.topAffiliations.map((item) => (
              <div key={item.id} className="panel-blade flex items-center justify-between gap-3">
                <div>
                  <h3>{item.name}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-silver/50">{item.role} • {item.visibility}</p>
                </div>
                <span className="status-chip">{item.count} views</span>
              </div>
            )) : <p className="text-sm text-silver/60">No group visibility data yet.</p>}
          </div>
        </div>
      </div>
      {message ? <p className="text-sm text-silver/70">{message}</p> : null}
    </DashboardShell>
  );
}
