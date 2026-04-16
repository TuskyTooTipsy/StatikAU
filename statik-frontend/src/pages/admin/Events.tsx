import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, events } from '../../data/platform';

export default function AdminEvents() {
  return (
    <DashboardShell eyebrow="Admin / events" title="Events module" nav={adminNav}>
      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.24em] text-silver/45">
          <p>Event</p><p>Date</p><p>Source</p><p>Category</p><p>Status</p>
        </div>
        {events.map((event) => (
          <div key={event.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-sm text-silver/70 last:border-b-0">
            <p className="text-bone">{event.name}</p><p>{event.date}</p><p>{event.sourceLabel}</p><p>{event.category}</p><p>{event.approvalStatus}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
