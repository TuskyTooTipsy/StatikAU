import { useEffect, useState } from 'react';
import EmptyPanel from '../../components/EmptyPanel';
import { networkApi } from '../../api/network';
import type { AdminOverviewPayload } from '../../types/network';

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverviewPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setData(await networkApi.getAdminOverview());
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  if (error && !data) return <div className="shell py-20"><EmptyPanel eyebrow="Admin" title="Admin access failed" body={error} /></div>;
  if (!data) return <div className="shell py-20"><div className="panel-cut p-8">Loading admin…</div></div>;

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="headline-lg mt-3">Control the live platform without fake operating states.</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <div className="stat-block"><span className="stat-value">{data.counts.users}</span><span className="stat-label">users</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.featuredProfiles}</span><span className="stat-label">featured</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.verifiedProfiles}</span><span className="stat-label">verified</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.approvedEvents}</span><span className="stat-label">approved events</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.pendingEvents}</span><span className="stat-label">pending events</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.communities}</span><span className="stat-label">communities</span></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Site controls</p>
          <div className="mt-6 grid gap-4">
            <div className="panel-blade">
              <h3>Shop visibility</h3>
              <p className="mt-3 text-sm leading-7 text-silver/70">The shop is intentionally secondary and only becomes public when it is actually ready.</p>
              <button type="button" onClick={async () => { await networkApi.updateSite({ shopLocked: !data.site.shopLocked }); load(); }} className="btn-primary mt-4 h-10 px-4 text-[11px]">{data.site.shopLocked ? 'Unlock shop' : 'Lock shop'}</button>
            </div>
            <div className="panel-blade">
              <h3>Maintenance mode</h3>
              <button type="button" onClick={async () => { await networkApi.updateSite({ maintenanceMode: !data.site.maintenanceMode }); load(); }} className="btn-secondary mt-4 h-10 px-4 text-[11px]">{data.site.maintenanceMode ? 'Disable maintenance' : 'Enable maintenance'}</button>
            </div>
            <div className="panel-blade">
              <h3>Registration</h3>
              <button type="button" onClick={async () => { await networkApi.updateSite({ registrationOpen: !data.site.registrationOpen }); load(); }} className="btn-secondary mt-4 h-10 px-4 text-[11px]">{data.site.registrationOpen ? 'Close registration' : 'Open registration'}</button>
            </div>
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Profiles</p>
          <div className="mt-6 grid gap-3">
            {data.profiles.length ? data.profiles.map((profile) => (
              <div key={profile.id} className="panel-blade">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3>{profile.displayName}</h3>
                    <p className="mt-2 text-sm text-silver/70">{profile.primaryCar || 'No primary car'} • {profile.location || 'No location'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={async () => { await networkApi.moderateProfile(profile.id, { featured: !profile.featured }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{profile.featured ? 'Unfeature' : 'Feature'}</button>
                    <button type="button" onClick={async () => { await networkApi.moderateProfile(profile.id, { verified: !profile.verified }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{profile.verified ? 'Unverify' : 'Verify'}</button>
                    <button type="button" onClick={async () => { await networkApi.moderateProfile(profile.id, { promoted: !profile.promoted }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{profile.promoted ? 'Unpromote' : 'Promote'}</button>
                  </div>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Profiles" title="No members yet" body="Moderation controls will become useful once people start registering." />}
          </div>
        </div>
      </div>

      <div className="panel-cut p-6 md:p-8">
        <p className="eyebrow">Events</p>
        <div className="mt-6 grid gap-3">
          {data.events.length ? data.events.map((event) => (
            <div key={event.id} className="panel-blade">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3>{event.name}</h3>
                  <p className="mt-2 text-sm text-silver/70">{event.location} • {event.date} • {event.approvalStatus}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { approvalStatus: event.approvalStatus === 'approved' ? 'pending' : 'approved' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{event.approvalStatus === 'approved' ? 'Set pending' : 'Approve'}</button>
                  <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { featured: !event.featured }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{event.featured ? 'Unfeature' : 'Feature'}</button>
                  <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { approvalStatus: 'rejected' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Reject</button>
                </div>
              </div>
            </div>
          )) : <EmptyPanel eyebrow="Events" title="No event submissions yet" body="As real events are submitted they can be approved, rejected, or featured here." />}
        </div>
      </div>

      <div className="panel-cut p-6 md:p-8">
        <p className="eyebrow">Audit</p>
        <div className="mt-6 grid gap-3">
          {data.auditLogs.length ? data.auditLogs.map((log) => (
            <div key={log.id} className="panel-blade">
              <h3>{log.action}</h3>
              <p className="mt-2 text-sm text-silver/70">{log.targetType} • {log.targetId} • {new Date(log.createdAt).toLocaleString()}</p>
              {log.detail ? <p className="mt-2 text-sm text-silver/64">{log.detail}</p> : null}
            </div>
          )) : <EmptyPanel eyebrow="Audit" title="No audit activity yet" body="Actions begin to appear here as soon as members and admins start using the platform." />}
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
