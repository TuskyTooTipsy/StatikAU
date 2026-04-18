import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';
import { networkApi } from '../../api/network';
import type { AdminOverviewPayload, EventImportItem, NetworkEvent, ContentItem, BusinessListing } from '../../types/network';

type QueueFilter = 'all' | 'events' | 'imports' | 'reports' | 'posts' | 'content' | 'businesses';

export default function AdminApprovalBay() {
  const [bay, setBay] = useState<AdminOverviewPayload['approveBay'] | null>(null);
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setBay(await networkApi.getApproveBay());
    } catch (err: any) {
      setError(err.message || 'Approval bay failed to load.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const queue = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = [
      ...(bay?.events || []).map((event) => ({ type: 'events' as const, id: event.id, title: event.name, meta: `${event.date} · ${event.category}`, body: event.description || event.location, raw: event })),
      ...(bay?.imports || []).map((item) => ({ type: 'imports' as const, id: item.id, title: item.title, meta: `${item.sourceName} · ${item.date}`, body: item.description || item.sourceUrl, raw: item })),
      ...(bay?.reports || []).map((report) => ({ type: 'reports' as const, id: report.id, title: `${report.targetType} report`, meta: `${report.status} · ${new Date(report.createdAt).toLocaleString()}`, body: report.reason, raw: report })),
      ...(bay?.posts || []).map((post) => ({ type: 'posts' as const, id: post.id, title: post.queueType.replace('_', ' '), meta: new Date(post.createdAt).toLocaleString(), body: post.caption, raw: post })),
      ...(bay?.content || []).map((item) => ({ type: 'content' as const, id: item.id, title: item.title, meta: `${item.type} · ${item.status} · ${item.category || 'uncategorised'}`, body: item.excerpt || item.body || 'No excerpt supplied.', raw: item })),
      ...(bay?.businesses || []).map((biz) => ({ type: 'businesses' as const, id: biz.id, title: biz.businessName, meta: `${biz.status} · ${biz.category || 'uncategorised'} · ${biz.region || 'No region'}`, body: biz.description || biz.services?.join(', ') || 'No description supplied.', raw: biz })),
    ];
    return items
      .filter((item) => filter === 'all' || item.type === filter)
      .filter((item) => !q || [item.title, item.meta, item.body, item.type].join(' ').toLowerCase().includes(q));
  }, [bay, filter, query]);

  async function approveEvent(event: NetworkEvent) {
    setBusyId(event.id);
    try {
      await networkApi.moderateEvent(event.id, { approvalStatus: 'approved' });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function rejectEvent(event: NetworkEvent) {
    const adminNote = window.prompt('Reason / moderation note for rejecting or requesting revision?', 'Needs clearer event details before publish.') || '';
    setBusyId(event.id);
    try {
      await networkApi.moderateEvent(event.id, { approvalStatus: 'revision_requested', adminNote });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function publishImport(item: EventImportItem) {
    setBusyId(item.id);
    try {
      await networkApi.moderateImportItem(item.id, { status: 'approved', publishEvent: true });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }


  async function publishContent(item: ContentItem) {
    setBusyId(item.id);
    try {
      await networkApi.updateAdminContent(item.id, { status: 'published', publishedAt: item.publishedAt || new Date().toISOString() });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function archiveContent(item: ContentItem) {
    const adminNotes = window.prompt('Reason / editorial note?', 'Archived during approval review.') || '';
    setBusyId(item.id);
    try {
      await networkApi.updateAdminContent(item.id, { status: 'archived', adminNotes });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function approveBusiness(item: BusinessListing) {
    setBusyId(item.id);
    try {
      await networkApi.updateAdminBusiness(item.id, { status: 'approved', approvedAt: item.approvedAt || new Date().toISOString() });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function rejectBusiness(item: BusinessListing) {
    const adminNotes = window.prompt('Reason / business approval note?', 'Rejected during business directory review.') || '';
    setBusyId(item.id);
    try {
      await networkApi.updateAdminBusiness(item.id, { status: 'rejected', adminNotes });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function rejectImport(item: EventImportItem) {
    const adminNote = window.prompt('Reason / duplicate / rejection note?', 'Rejected during import review.') || '';
    setBusyId(item.id);
    try {
      await networkApi.moderateImportItem(item.id, { status: 'rejected', adminNote });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardShell eyebrow="Admin / approval bay" title="Central moderation command queue" nav={adminNav}>
      <section className="panel-cut p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Approvals, imports, reports and content pressure</p>
            <h2 className="headline-md mt-3">One queue. Fast decisions. Audit-backed actions.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-silver/68">Use this bay for pending event submissions, scraped/imported records, reports and content waiting for review. External events never publish until approved here.</p>
          </div>
          <button type="button" className="btn-secondary h-11 px-5 text-xs" onClick={() => void load()}>Refresh bay</button>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[220px_1fr]">
          <select className="field-sharp" value={filter} onChange={(e) => setFilter(e.target.value as QueueFilter)}>
            <option value="all">all queue types</option>
            <option value="events">event submissions</option>
            <option value="imports">scraped/imported events</option>
            <option value="reports">reports</option>
            <option value="posts">posts/content</option>
            <option value="content">articles/news</option>
            <option value="businesses">business directory</option>
          </select>
          <input className="field-sharp" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, source, reason, category, body…" />
        </div>

        {error ? <p className="mt-5 text-sm text-[#ff8f8f]">{error}</p> : null}

        <div className="mt-6 grid gap-4">
          {queue.map((item) => (
            <article key={`${item.type}-${item.id}`} className="panel-blade">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-rust">{item.type}</p>
                  <h3 className="mt-2 text-xl uppercase tracking-[0.08em] text-bone">{item.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-silver/48">{item.meta}</p>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-silver/70">{item.body || 'No body supplied.'}</p>
                  {item.type === 'imports' ? <a className="mt-3 inline-block text-xs uppercase tracking-[0.2em] text-bone underline decoration-rust/60" href={(item.raw as EventImportItem).sourceUrl} target="_blank" rel="noreferrer">Open source record</a> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.type === 'events' ? (
                    <>
                      <button disabled={busyId === item.id} className="btn-primary h-10 px-4 text-xs" onClick={() => void approveEvent(item.raw as NetworkEvent)}>Approve</button>
                      <button disabled={busyId === item.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void rejectEvent(item.raw as NetworkEvent)}>Request revision</button>
                    </>
                  ) : null}
                  {item.type === 'imports' ? (
                    <>
                      <button disabled={busyId === item.id} className="btn-primary h-10 px-4 text-xs" onClick={() => void publishImport(item.raw as EventImportItem)}>Approve + publish</button>
                      <button disabled={busyId === item.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void rejectImport(item.raw as EventImportItem)}>Reject</button>
                    </>
                  ) : null}
                  {item.type === 'content' ? (
                    <>
                      <button disabled={busyId === item.id} className="btn-primary h-10 px-4 text-xs" onClick={() => void publishContent(item.raw as ContentItem)}>Publish</button>
                      <button disabled={busyId === item.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void archiveContent(item.raw as ContentItem)}>Archive</button>
                    </>
                  ) : null}
                  {item.type === 'businesses' ? (
                    <>
                      <button disabled={busyId === item.id} className="btn-primary h-10 px-4 text-xs" onClick={() => void approveBusiness(item.raw as BusinessListing)}>Approve</button>
                      <button disabled={busyId === item.id} className="btn-secondary h-10 px-4 text-xs" onClick={() => void rejectBusiness(item.raw as BusinessListing)}>Reject</button>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {!queue.length ? <div className="empty-state">No approval items match this filter. The queue is clear for now.</div> : null}
        </div>
      </section>
    </DashboardShell>
  );
}
