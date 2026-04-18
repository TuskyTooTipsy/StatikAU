import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import EmptyPanel from '../../components/EmptyPanel';
import MediaGrid from '../../components/platform/MediaGrid';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { AdminMessageRecord, AdminUserDetail, AdminUserSummary } from '../../types/network';

export default function AdminUsers() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [activeUser, setActiveUser] = useState<AdminUserDetail | null>(null);
  const [messageQuery, setMessageQuery] = useState('');
  const [messageResults, setMessageResults] = useState<AdminMessageRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function loadUsers(currentQuery = query) {
    try {
      setError(null);
      const items = await networkApi.listAdminUsers(currentQuery || undefined);
      setUsers(items);
      if (!activeUser && items[0]) {
        const detail = await networkApi.getAdminUser(items[0].id);
        setActiveUser(detail);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    void loadUsers('');
  }, []);

  async function selectUser(userId: string) {
    try {
      setBusy(userId);
      setActiveUser(await networkApi.getAdminUser(userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  async function moderate(payload: Parameters<typeof networkApi.moderateUser>[1]) {
    if (!activeUser) return;
    setBusy(activeUser.id);
    try {
      await networkApi.moderateUser(activeUser.id, payload);
      const detail = await networkApi.getAdminUser(activeUser.id);
      setActiveUser(detail);
      await loadUsers(query);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  async function searchMessages() {
    try {
      setMessageResults(await networkApi.searchAdminMessages({ q: messageQuery || undefined, userId: activeUser?.id }));
    } catch (err: any) {
      setError(err.message);
    }
  }

  const summaryCounts = useMemo(() => ({
    ownedGroups: activeUser?.ownedCommunities.length || 0,
    hostedEvents: activeUser?.hostedEvents.length || 0,
    vehicles: activeUser?.vehicles.length || 0,
    media: activeUser?.media.length || 0,
  }), [activeUser]);

  return (
    <DashboardShell eyebrow="Admin / users" title="Users and moderation" nav={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="panel-cut p-6 md:p-8">
          <p className="eyebrow">Search users</p>
          <div className="mt-4 flex gap-3">
            <input className="field-sharp" placeholder="Name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="button" onClick={() => void loadUsers(query)} className="btn-secondary h-11 px-4 text-[11px]">Search</button>
          </div>
          <div className="mt-6 grid gap-3">
            {users.length ? users.map((user) => (
              <button key={user.id} type="button" onClick={() => void selectUser(user.id)} className={`panel-blade text-left ${activeUser?.id === user.id ? 'border-white/20 bg-white/[0.08]' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3>{user.profile?.displayName || user.displayName}</h3>
                    <p className="mt-2 text-sm text-silver/70">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-chip">{user.role}</span>
                    {user.isBanned ? <span className="status-chip">banned</span> : null}
                    {user.profile?.verified ? <span className="status-chip">verified</span> : null}
                  </div>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-silver/48">{user.lastIps[0] || 'No IP logged'} • {busy === user.id ? 'loading…' : user.recentActions[0]?.action || 'No recent actions'}</p>
              </button>
            )) : <EmptyPanel eyebrow="Users" title="No users found" body="Adjust the search query or wait for real accounts to land." />}
          </div>
        </div>

        <div className="space-y-6">
          {!activeUser ? (
            <EmptyPanel eyebrow="Moderation detail" title="Select a user" body="Pick a member from the list to inspect moderation history, IPs, messages, groups, events, and uploads." />
          ) : (
            <>
              <div className="panel-cut p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="headline-md">{activeUser.profile?.displayName || activeUser.displayName}</h2>
                      <span className="status-chip">{activeUser.role}</span>
                      {activeUser.isBanned ? <span className="status-chip">banned</span> : null}
                      {activeUser.profile?.verified ? <span className="status-chip">verified</span> : null}
                      {activeUser.profile?.featured ? <span className="status-chip">featured</span> : null}
                    </div>
                    <p className="mt-3 text-sm text-silver/70">{activeUser.email}</p>
                    <p className="mt-2 text-sm text-silver/58">Created {new Date(activeUser.createdAt).toLocaleString()}</p>
                    {activeUser.moderationNote ? <p className="mt-3 text-sm leading-7 text-silver/66">{activeUser.moderationNote}</p> : null}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => void moderate({ role: activeUser.role === 'admin' ? 'user' : 'admin' })} className="btn-secondary h-10 px-4 text-[11px]">{activeUser.role === 'admin' ? 'Revoke admin' : 'Promote admin'}</button>
                    <button type="button" onClick={() => void moderate({ isBanned: !activeUser.isBanned })} className="btn-secondary h-10 px-4 text-[11px]">{activeUser.isBanned ? 'Unban' : 'Ban'}</button>
                    <button type="button" onClick={() => void moderate({ verifyProfile: !activeUser.profile?.verified })} className="btn-secondary h-10 px-4 text-[11px]">{activeUser.profile?.verified ? 'Unverify' : 'Verify'}</button>
                    <button type="button" onClick={() => void moderate({ featureProfile: !activeUser.profile?.featured, featureEndsAt: !activeUser.profile?.featured ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : null })} className="btn-secondary h-10 px-4 text-[11px]">{activeUser.profile?.featured ? 'Unfeature' : 'Feature 3 days'}</button>
                    <button type="button" onClick={() => void moderate({ suspensionEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), moderationNote: 'Suspended for 7 days from admin control board.' })} className="btn-secondary h-10 px-4 text-[11px]">Suspend 7 days</button>
                    <button type="button" onClick={() => void moderate({ suspensionEndsAt: null })} className="btn-secondary h-10 px-4 text-[11px]">Clear suspension</button>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="stat-block"><span className="stat-value">{summaryCounts.ownedGroups}</span><span className="stat-label">owned groups</span></div>
                  <div className="stat-block"><span className="stat-value">{summaryCounts.hostedEvents}</span><span className="stat-label">hosted events</span></div>
                  <div className="stat-block"><span className="stat-value">{summaryCounts.vehicles}</span><span className="stat-label">garage entries</span></div>
                  <div className="stat-block"><span className="stat-value">{summaryCounts.media}</span><span className="stat-label">uploaded media</span></div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="panel-cut p-6 md:p-8">
                  <p className="eyebrow">IP and sessions</p>
                  <div className="mt-6 grid gap-3">
                    <div className="panel-blade">
                      <h3>Last 5 IPs</h3>
                      <div className="mt-3 flex flex-wrap gap-2">{activeUser.lastIps.length ? activeUser.lastIps.map((ip) => <span key={ip} className="status-chip">{ip}</span>) : <span className="text-sm text-silver/54">No IPs logged yet.</span>}</div>
                    </div>
                    {activeUser.recentSessions.map((session) => (
                      <div key={session.id} className="panel-blade">
                        <p className="text-sm text-silver/70">{session.ip || 'No IP'}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">Created {new Date(session.createdAt).toLocaleString()}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-silver/48">Last seen {session.lastSeenAt ? new Date(session.lastSeenAt).toLocaleString() : 'n/a'}</p>
                        {session.userAgent ? <p className="mt-2 text-sm text-silver/58">{session.userAgent}</p> : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel-cut p-6 md:p-8">
                  <p className="eyebrow">Activity + reports</p>
                  <div className="mt-6 grid gap-3">
                    {activeUser.recentActions.map((action) => (
                      <div key={action.id} className="panel-blade">
                        <h3>{action.action}</h3>
                        <p className="mt-2 text-sm text-silver/70">{action.targetType} • {action.targetId}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">{new Date(action.createdAt).toLocaleString()}</p>
                        {action.detail ? <p className="mt-2 text-sm text-silver/58">{action.detail}</p> : null}
                      </div>
                    ))}
                    {activeUser.relatedReports.map((report) => (
                      <div key={report.id} className="panel-blade">
                        <div className="flex items-center gap-2"><h3>{report.targetType}</h3><span className="status-chip">{report.status}</span></div>
                        <p className="mt-2 text-sm text-silver/70">{report.reason}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">{new Date(report.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="panel-cut p-6 md:p-8">
                  <p className="eyebrow">Owned groups + events</p>
                  <div className="mt-6 grid gap-3">
                    {activeUser.ownedCommunities.map((community) => <div key={community.id} className="panel-blade"><h3>{community.name}</h3><p className="mt-2 text-sm text-silver/70">{community.region || 'No region'} • {community.visibility}</p></div>)}
                    {activeUser.adminCommunities.map((community) => <div key={`admin-${community.id}`} className="panel-blade"><h3>{community.name}</h3><p className="mt-2 text-sm text-silver/70">admin role • {community.visibility}</p></div>)}
                    {activeUser.hostedEvents.map((event) => <div key={event.id} className="panel-blade"><h3>{event.name}</h3><p className="mt-2 text-sm text-silver/70">{event.location} • {event.date}</p></div>)}
                  </div>
                </div>
                <div className="panel-cut p-6 md:p-8">
                  <p className="eyebrow">Garage + links</p>
                  <div className="mt-6 grid gap-3">
                    {activeUser.vehicles.map((vehicle) => <div key={vehicle.id} className="panel-blade"><h3>{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}</h3><p className="mt-2 text-sm text-silver/70">{[vehicle.trim, vehicle.specialEdition, vehicle.stage].filter(Boolean).join(' • ') || 'No spec summary'}</p></div>)}
                    {activeUser.shortLinks.map((link) => <div key={link.id} className="panel-blade"><h3>{link.slug}</h3><p className="mt-2 text-sm text-silver/70">{link.targetType} • {link.clickCount} clicks • {link.qrScanCount} qr scans</p></div>)}
                  </div>
                </div>
              </div>

              <div className="panel-cut p-6 md:p-8">
                <p className="eyebrow">Uploaded media</p>
                <div className="mt-6">{activeUser.media.length ? <MediaGrid media={activeUser.media} compact /> : <EmptyPanel eyebrow="Media" title="No uploaded media" body="This account has not uploaded any media yet." />}</div>
              </div>

              <div className="panel-cut p-6 md:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">Message moderation access</p>
                    <h2 className="headline-md mt-3">Search direct community messages for moderation purposes.</h2>
                  </div>
                  <div className="flex gap-3">
                    <input className="field-sharp" placeholder="Search message text" value={messageQuery} onChange={(e) => setMessageQuery(e.target.value)} />
                    <button type="button" onClick={() => void searchMessages()} className="btn-secondary h-11 px-4 text-[11px]">Search</button>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {messageResults.length ? messageResults.map((message) => (
                    <div key={message.id} className="panel-blade">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3>{message.profile?.displayName || message.userId}</h3>
                          <p className="mt-2 text-sm text-silver/70">{message.community?.name || 'No community'} • {message.type}</p>
                          <p className="mt-3 text-sm leading-7 text-silver/68">{message.text}</p>
                        </div>
                        <p className="text-xs uppercase tracking-[0.18em] text-silver/48">{new Date(message.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-silver/58">Search to inspect this user’s messages. Access is audit logged on the backend.</p>}
                </div>
              </div>
            </>
          )}
          {error ? <p className="text-sm text-[#ff8f8f]">{error}</p> : null}
        </div>
      </div>
    </DashboardShell>
  );
}
