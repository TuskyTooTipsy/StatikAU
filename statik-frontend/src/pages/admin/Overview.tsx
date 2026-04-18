import { useEffect, useState } from 'react';
import EmptyPanel from '../../components/EmptyPanel';
import AvatarBadge from '../../components/AvatarBadge';
import { networkApi } from '../../api/network';
import type { AdminOverviewPayload } from '../../types/network';

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverviewPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setData(await networkApi.getAdminOverview());
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (error && !data) return <div className="shell py-20"><EmptyPanel eyebrow="Admin" title="Admin access failed" body={error} /></div>;
  if (!data) return <div className="shell py-20"><div className="panel-cut p-8">Loading admin…</div></div>;

  return (
    <div className="shell space-y-8 pb-16 pt-8">
      <div className="page-hero-cut p-6 md:p-8 xl:p-10">
        <p className="eyebrow">Admin control</p>
        <h1 className="headline-lg mt-3">Moderate the live network, media, group identity, and event approvals without fake operating states.</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-8">
          <div className="stat-block"><span className="stat-value">{data.counts.users}</span><span className="stat-label">users</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.communities}</span><span className="stat-label">groups</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.vehicles}</span><span className="stat-label">builds</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.posts}</span><span className="stat-label">posts</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.media}</span><span className="stat-label">media</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.openReports}</span><span className="stat-label">open reports</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.pendingBusinesses || 0}</span><span className="stat-label">business queue</span></div>
          <div className="stat-block"><span className="stat-value">{data.counts.draftContent || 0}</span><span className="stat-label">content drafts</span></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Site controls</p>
          <div className="mt-6 grid gap-4">
            <div className="panel-blade">
              <h3>Shop visibility</h3>
              <p className="mt-3 text-sm leading-7 text-silver/70">The shop stays secondary until it is intentionally unlocked.</p>
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
            {data.profiles.length ? data.profiles.slice(0, 18).map((profile) => (
              <div key={profile.id} className="panel-blade">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AvatarBadge name={profile.displayName} src={profile.avatarUrl} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3>{profile.displayName}</h3>
                        {profile.featured ? <span className="status-chip">featured</span> : null}
                        {profile.verified ? <span className="status-chip">verified</span> : null}
                        {profile.promoted ? <span className="status-chip">promoted</span> : null}
                      </div>
                      <p className="mt-2 text-sm text-silver/70">{profile.primaryCar || 'No primary build'} • {profile.location || 'No location'} • {profile.stats?.vehicleCount ?? 0} builds</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={async () => { await networkApi.moderateProfile(profile.id, { featured: !profile.featured }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{profile.featured ? 'Unfeature' : 'Feature'}</button>
                    <button type="button" onClick={async () => { await networkApi.moderateProfile(profile.id, { verified: !profile.verified }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{profile.verified ? 'Unverify' : 'Verify'}</button>
                    <button type="button" onClick={async () => { await networkApi.moderateProfile(profile.id, { promoted: !profile.promoted }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{profile.promoted ? 'Unpromote' : 'Promote'}</button>
                  </div>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Profiles" title="No members yet" body="Moderation controls become useful once real profiles start landing." />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Events</p>
              <h2 className="headline-md mt-3">Approve, reject, or feature hosted meets and public event pages.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{data.counts.pendingEvents} pending</span>
          </div>
          <div className="mt-6 grid gap-3">
            {data.events.length ? data.events.map((event) => (
              <div key={event.id} className="panel-blade">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3>{event.name}</h3>
                    <p className="mt-2 text-sm text-silver/70">{event.location} • {event.date} • {event.approvalStatus}</p>
                    {event.hostCommunity ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-silver/54">Host group: {event.hostCommunity.name}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { approvalStatus: event.approvalStatus === 'approved' ? 'pending' : 'approved' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{event.approvalStatus === 'approved' ? 'Set pending' : 'Approve'}</button>
                    <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { featured: !event.featured }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">{event.featured ? 'Unfeature' : 'Feature'}</button>
                    <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { approvalStatus: 'rejected' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Reject</button>
                  </div>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Events" title="No event submissions yet" body="Real event submissions will appear here for approval." />}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Groups</p>
              <h2 className="headline-md mt-3">Discovery, visibility, and crew-page governance.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{data.communities.length} total</span>
          </div>
          <div className="mt-6 grid gap-3">
            {data.communities.length ? data.communities.map((community) => (
              <div key={community.id} className="panel-blade">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3>{community.name}</h3>
                      <span className="status-chip">{community.visibility}</span>
                    </div>
                    <p className="mt-2 text-sm text-silver/70">{community.memberCount} members • {community.region || 'No region'} • {community.discoverable === false ? 'hidden' : 'discoverable'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={async () => { await networkApi.moderateCommunity(community.id, { discoverable: !community.discoverable }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Toggle discovery</button>
                  </div>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Groups" title="No group pages yet" body="As members create groups, moderation controls appear here." />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Reports</p>
              <h2 className="headline-md mt-3">Reported posts, groups, profiles, and media.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{data.reports.length} tracked</span>
          </div>
          <div className="mt-6 grid gap-3">
            {data.reports.length ? data.reports.map((report) => (
              <div key={report.id} className="panel-blade">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3>{report.targetType}</h3>
                      <span className="status-chip">{report.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-silver/70">{report.reason}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-silver/54">{new Date(report.createdAt).toLocaleString()}</p>
                    {report.note ? <p className="mt-2 text-sm text-silver/62">{report.note}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={async () => { await networkApi.moderateReport(report.id, { status: 'resolved' }); load(); }} className="btn-primary h-9 px-3 text-[10px]">Resolve</button>
                    <button type="button" onClick={async () => { await networkApi.moderateReport(report.id, { status: 'dismissed' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Dismiss</button>
                    {report.status !== 'open' ? <button type="button" onClick={async () => { await networkApi.moderateReport(report.id, { status: 'open' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Reopen</button> : null}
                  </div>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Reports" title="No reports yet" body="Nothing is being faked here. Reports only appear when people actually flag content." />}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Media moderation</p>
              <h2 className="headline-md mt-3">Uploaded assets that are actually live in storage.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{data.media.length} showing</span>
          </div>
          <div className="mt-6 grid gap-3">
            {data.media.length ? data.media.map((asset) => (
              <div key={asset.id} className="panel-blade">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {asset.kind === 'video' ? <video src={asset.url} className="h-16 w-24 bg-black object-cover" /> : <img src={asset.url} alt={asset.altText || asset.displayTitle || asset.originalFilename || 'Media asset'} className="h-16 w-24 object-cover" />}
                    <div>
                      <h3>{asset.displayTitle || asset.caption || asset.originalFilename || asset.fileName}</h3>
                      <p className="mt-2 text-sm text-silver/70">{asset.ownerType} • {(asset.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-silver/54">{new Date(asset.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <button type="button" onClick={async () => { await networkApi.adminDeleteMedia(asset.id); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Remove</button>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Media" title="No uploaded media yet" body="Direct uploads are wired, but there is no live media in storage yet." />}
          </div>
        </div>
      </div>


      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Approve bay</p>
              <h2 className="headline-md mt-3">One queue for pending events, imports, flagged items, and unfeatured posts.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{data.approveBay?.events.length || 0} events • {data.approveBay?.imports.length || 0} imports</span>
          </div>
          <div className="mt-6 grid gap-3">
            {data.approveBay?.events.length ? data.approveBay.events.slice(0, 6).map((event) => (
              <div key={event.id} className="panel-blade">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3>{event.name}</h3>
                    <p className="mt-2 text-sm text-silver/70">{event.location} • {event.date} • {event.approvalStatus}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { approvalStatus: 'approved' }); load(); }} className="btn-primary h-9 px-3 text-[10px]">Approve</button>
                    <button type="button" onClick={async () => { await networkApi.moderateEvent(event.id, { approvalStatus: 'revision_requested', adminNote: 'Please refine the event details before publish.' }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Request revision</button>
                  </div>
                </div>
              </div>
            )) : <EmptyPanel eyebrow="Queue" title="No pending events" body="The event queue is currently clear." />}
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Imports + reports</p>
              <h2 className="headline-md mt-3">External candidates and open safety signals waiting for review.</h2>
            </div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-silver/56">{data.counts.pendingImports || 0} pending imports</span>
          </div>
          <div className="mt-6 grid gap-3">
            {data.approveBay?.imports?.slice(0, 4).map((item) => (
              <div key={item.id} className="panel-blade">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3>{item.title}</h3>
                    <p className="mt-2 text-sm text-silver/70">{item.location} • {item.date} • {item.sourceName}</p>
                  </div>
                  <button type="button" onClick={async () => { await networkApi.moderateImportItem(item.id, { publishEvent: true }); load(); }} className="btn-secondary h-9 px-3 text-[10px]">Publish</button>
                </div>
              </div>
            ))}
            {data.approveBay?.reports?.slice(0, 4).map((report) => (
              <div key={report.id} className="panel-blade">
                <div className="flex items-center gap-2">
                  <h3>{report.targetType}</h3>
                  <span className="status-chip">{report.status}</span>
                </div>
                <p className="mt-2 text-sm text-silver/70">{report.reason}</p>
              </div>
            ))}
          </div>
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
          )) : <EmptyPanel eyebrow="Audit" title="No audit activity yet" body="Actions begin to appear here as soon as admins and members start using the live platform." />}
        </div>
      </div>

      {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
    </div>
  );
}
