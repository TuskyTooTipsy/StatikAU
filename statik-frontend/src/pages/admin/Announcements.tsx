import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, announcements } from '../../data/platform';

export default function AdminAnnouncements() {
  return (
    <DashboardShell eyebrow="Admin / announcements" title="Announcements" nav={adminNav}>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="panel p-6">
            <p className="text-sm font-semibold text-bone">{announcement.title}</p>
            <p className="mt-3 text-sm leading-7 text-silver/68">{announcement.body}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
