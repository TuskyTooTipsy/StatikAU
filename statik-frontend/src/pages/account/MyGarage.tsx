import DashboardShell from '../../components/platform/DashboardShell';
import { accountNav } from '../../data/platform';
import { useSessionStore } from '../../store/session';

export default function MyGarage() {
  const { currentProfile } = useSessionStore();

  return (
    <DashboardShell eyebrow="Account / garage" title="My garage" nav={accountNav}>
      <div className="grid gap-5 md:grid-cols-2">
        {currentProfile.garage.map((car) => (
          <div key={car.id} className="panel overflow-hidden">
            <img src={car.image} alt={car.name} className="h-64 w-full object-cover" />
            <div className="space-y-3 p-6">
              <h2 className="text-2xl font-semibold text-bone">{car.name}</h2>
              <p className="text-sm text-silver/65">{car.chassis}</p>
              <p className="text-sm text-silver/70">{car.power}</p>
              <p className="text-sm leading-7 text-silver/65">{car.setup}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
