import { useEffect, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { AdminOverviewPayload } from '../../types/network';

type AuditLog = AdminOverviewPayload['auditLogs'][number];

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [q, setQ] = useState('');
  const [action, setAction] = useState('');
  const [targetType, setTargetType] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLogs(await networkApi.getAdminAuditLogs({ q, action, targetType }));
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <DashboardShell eyebrow="Admin / audit" title="Audit logs" nav={adminNav}>
      <div className="panel-cut p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Operational history</p>
            <h2 className="headline-md mt-3">Searchable moderation, import, upload, QR, role, and settings actions.</h2>
          </div>
          <span className="status-chip">{logs.length} records</span>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <input className="field-sharp" placeholder="Search action, entity, detail" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="field-sharp" placeholder="Action" value={action} onChange={(e) => setAction(e.target.value)} />
          <input className="field-sharp" placeholder="Target type" value={targetType} onChange={(e) => setTargetType(e.target.value)} />
          <button type="button" onClick={() => void load()} className="btn-primary h-12 px-5 text-[11px]">Search</button>
        </div>
        {error ? <p className="mt-4 text-sm text-[#ff8f8f]">{error}</p> : null}
        <div className="mt-6 grid gap-3">
          {logs.length ? logs.map((log) => (
            <div key={log.id} className="panel-blade grid gap-4 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr] md:items-center">
              <div>
                <h3>{log.action}</h3>
                <p className="mt-2 text-sm text-silver/68">{log.detail || 'No detail payload'}</p>
              </div>
              <p className="text-sm text-silver/70">{log.targetType}<br /><span className="text-silver/44">{log.targetId}</span></p>
              <p className="text-sm text-silver/70">Actor<br /><span className="text-silver/44">{log.actorUserId || 'system'}</span></p>
              <p className="text-xs uppercase tracking-[0.18em] text-silver/48">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
          )) : <div className="panel-blade text-sm text-silver/60">No audit records match this filter.</div>}
        </div>
      </div>
    </DashboardShell>
  );
}
