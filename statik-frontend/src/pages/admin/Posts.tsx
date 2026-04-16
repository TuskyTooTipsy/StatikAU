import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav, officialPosts } from '../../data/platform';

export default function AdminPosts() {
  return (
    <DashboardShell eyebrow="Admin / posts" title="Official posts" nav={adminNav}>
      <div className="space-y-4">
        {officialPosts.map((post) => (
          <div key={post.id} className="panel p-6">
            <p className="text-sm font-semibold text-bone">{post.title}</p>
            <p className="mt-2 text-sm text-silver/65">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</p>
            <p className="mt-3 text-sm leading-7 text-silver/68">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
