import DashboardShell from '../../components/platform/DashboardShell';
import { adminNav } from '../../data/platform';

export default function AdminShop() {
  return (
    <DashboardShell eyebrow="Admin / shop" title="Shop control" nav={adminNav}>
      <div className="grid gap-5 md:grid-cols-3">
        {['Collection visibility', 'Featured drop rails', 'Homepage secondary merch'].map((item) => (
          <div key={item} className="panel p-6"><p className="text-xl font-semibold text-bone">{item}</p><p className="mt-3 text-sm leading-7 text-silver/68">Merchandising controls keep shop revenue integrated without overpowering the events-first platform hierarchy.</p></div>
        ))}
      </div>
    </DashboardShell>
  );
}
