import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import EmptyPanel from '../../components/EmptyPanel';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { EventImportItem, EventImportRun, EventImportSource } from '../../types/network';

export default function AdminImports() {
  const [sources, setSources] = useState<EventImportSource[]>([]);
  const [runs, setRuns] = useState<EventImportRun[]>([]);
  const [items, setItems] = useState<EventImportItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busySourceKey, setBusySourceKey] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<EventImportItem>>>({});

  async function load() {
    try {
      setError(null);
      const payload = await networkApi.getAdminImports();
      setSources(payload.sources);
      setRuns(payload.runs);
      setItems(payload.items);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const pendingItems = useMemo(() => items.filter((item) => item.status === 'pending'), [items]);

  async function handleRun(sourceKey: string) {
    setBusySourceKey(sourceKey);
    try {
      await networkApi.runAdminImport(sourceKey);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusySourceKey(null);
    }
  }

  async function handleSourceToggle(source: EventImportSource) {
    setBusySourceKey(source.key);
    try {
      await networkApi.updateImportSource(source.id, { enabled: !source.enabled });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusySourceKey(null);
    }
  }

  async function handleModerate(item: EventImportItem, action: 'reject' | 'archive' | 'approve' | 'publish') {
    setActiveItemId(item.id);
    try {
      await networkApi.moderateImportItem(item.id, {
        title: drafts[item.id]?.title || item.title,
        location: drafts[item.id]?.location || item.location,
        date: drafts[item.id]?.date || item.date,
        time: drafts[item.id]?.time || item.time,
        category: drafts[item.id]?.category || item.category,
        description: drafts[item.id]?.description || item.description,
        adminNote: drafts[item.id]?.adminNote || item.adminNote,
        status: action === 'publish' ? 'approved' : action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'archived',
        publishEvent: action === 'publish',
      });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActiveItemId(null);
    }
  }

  return (
    <DashboardShell eyebrow="Admin / imports" title="Event imports" nav={adminNav}>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="panel-cut p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Source health</p>
                <h2 className="headline-md mt-3">Run source adapters, inspect status, and stage external events for review.</h2>
              </div>
              <span className="status-chip">{pendingItems.length} pending</span>
            </div>
            <div className="mt-6 grid gap-4">
              {sources.length ? sources.map((source) => (
                <div key={source.id} className="panel-blade">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3>{source.name}</h3>
                        <span className="status-chip">{source.enabled ? 'enabled' : 'disabled'}</span>
                        {source.lastRunStatus ? <span className="status-chip">{source.lastRunStatus}</span> : null}
                      </div>
                      <p className="mt-3 text-sm text-silver/70">{source.baseUrl}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">Last run {source.lastRunAt ? new Date(source.lastRunAt).toLocaleString() : 'never'}</p>
                      {source.lastRunMessage ? <p className="mt-2 text-sm text-silver/58">{source.lastRunMessage}</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => void handleSourceToggle(source)} className="btn-secondary h-10 px-4 text-[11px]">{busySourceKey === source.key ? 'Saving…' : source.enabled ? 'Disable source' : 'Enable source'}</button>
                      <button type="button" disabled={!source.enabled} onClick={() => void handleRun(source.key)} className="btn-primary h-10 px-4 text-[11px] disabled:cursor-not-allowed disabled:opacity-45">{busySourceKey === source.key ? 'Running…' : 'Run import'}</button>
                    </div>
                  </div>
                </div>
              )) : <EmptyPanel eyebrow="Imports" title="No import sources configured" body="Add a source adapter to begin staging external event candidates." />}
            </div>
          </div>

          <div className="panel-cut p-6 md:p-8">
            <p className="eyebrow">Recent runs</p>
            <div className="mt-6 grid gap-3">
              {runs.length ? runs.map((run) => (
                <div key={run.id} className="panel-blade">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3>{run.sourceKey}</h3>
                      <p className="mt-2 text-sm text-silver/70">{new Date(run.startedAt).toLocaleString()} • {run.status}</p>
                    </div>
                    <div className="grid gap-1 text-xs uppercase tracking-[0.18em] text-silver/50 sm:text-right">
                      <span>{run.importedCount} imported</span>
                      <span>{run.duplicateCount} duplicates</span>
                      <span>{run.errorCount} errors</span>
                    </div>
                  </div>
                  {run.note ? <p className="mt-3 text-sm text-silver/58">{run.note}</p> : null}
                </div>
              )) : <EmptyPanel eyebrow="Runs" title="No import runs yet" body="Run a source to create the first staged import log." />}
            </div>
          </div>
        </div>

        <div className="panel-cut p-6 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Approval staging</p>
              <h2 className="headline-md mt-3">Review raw candidates, normalize details, then publish only what actually belongs on the site.</h2>
            </div>
            <span className="status-chip">{items.length} staged</span>
          </div>
          <div className="mt-6 grid gap-4">
            {items.length ? items.map((item) => {
              const draft = drafts[item.id] || {};
              return (
                <div key={item.id} className="panel-blade space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3>{item.title}</h3>
                        <span className="status-chip">{item.status}</span>
                        {item.duplicateOfEventId ? <span className="status-chip">duplicate candidate</span> : null}
                      </div>
                      <p className="mt-2 text-sm text-silver/70">{item.location} • {item.date} • {item.time}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">{item.sourceName} • {item.category}</p>
                      {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs uppercase tracking-[0.18em] text-silver/50 hover:text-bone">Open source ↗</a> : null}
                    </div>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-20 w-28 object-cover" /> : null}
                  </div>
                  <textarea className="field-sharp min-h-[120px]" value={draft.description ?? item.description} onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], description: e.target.value } }))} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="field-sharp" value={draft.title ?? item.title} onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], title: e.target.value } }))} />
                    <input className="field-sharp" value={draft.location ?? item.location} onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], location: e.target.value } }))} />
                    <input className="field-sharp" value={draft.date ?? item.date} onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], date: e.target.value } }))} />
                    <input className="field-sharp" value={draft.time ?? item.time} onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], time: e.target.value } }))} />
                    <input className="field-sharp" value={draft.category ?? item.category} onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], category: e.target.value } }))} />
                    <input className="field-sharp" placeholder="Moderator note" value={draft.adminNote ?? item.adminNote ?? ''} onChange={(e) => setDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], adminNote: e.target.value } }))} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void handleModerate(item, 'publish')} className="btn-primary h-10 px-4 text-[11px]">{activeItemId === item.id ? 'Working…' : 'Publish event'}</button>
                    <button type="button" onClick={() => void handleModerate(item, 'approve')} className="btn-secondary h-10 px-4 text-[11px]">Approve only</button>
                    <button type="button" onClick={() => void handleModerate(item, 'reject')} className="btn-secondary h-10 px-4 text-[11px]">Reject</button>
                    <button type="button" onClick={() => void handleModerate(item, 'archive')} className="btn-secondary h-10 px-4 text-[11px]">Archive</button>
                  </div>
                </div>
              );
            }) : <EmptyPanel eyebrow="Import staging" title="No staged items yet" body="Run the source adapter to pull candidate events into the moderation queue." />}
          </div>
          {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}
        </div>
      </div>
    </DashboardShell>
  );
}
