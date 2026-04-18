// Lightweight browser fallback only. The full STATIK vehicle registry lives in the backend
// and is loaded through /api/vehicle-registry so the Build Dossier is not frontend-only.

export type VehicleType = 'car' | 'bike' | 'truck' | 'other';

export type VehicleRegistryModel = {
  name: string;
  generations?: string[];
  trims?: string[];
  specialEditions?: string[];
  bodyStyles?: string[];
  drivetrains?: string[];
  engines?: string[];
  transmissions?: string[];
  regionMarkets?: string[];
};

export type VehicleRegistryNode = {
  vehicleType: VehicleType;
  make: string;
  models: VehicleRegistryModel[];
  regionMarkets?: string[];
};

export const vehicleRegistry: VehicleRegistryNode[] = [
  {
    vehicleType: 'car',
    make: 'Other',
    models: [{ name: 'Other / custom', generations: ['Unknown / custom'], trims: ['Other'], specialEditions: ['Custom special edition', 'Unknown / not sure'] }],
  },
  {
    vehicleType: 'bike',
    make: 'Other',
    models: [{ name: 'Other / custom', generations: ['Unknown / custom'], trims: ['Other'], specialEditions: ['Custom special edition', 'Unknown / not sure'] }],
  },
  {
    vehicleType: 'truck',
    make: 'Other',
    models: [{ name: 'Other / custom', generations: ['Unknown / custom'], trims: ['Other'], specialEditions: ['Custom special edition', 'Unknown / not sure'] }],
  },
];

export const buildStages = ['planning', 'daily-ready', 'project', 'under rebuild', 'track setup', 'show build'];
export const ownershipStatuses = ['current', 'sold', 'project', 'under rebuild'];
export const purposeTags = ['street', 'track', 'show', 'cruise', 'workshop', '4x4', 'bike'];
export const setupTags = ['street setup', 'track setup', 'drift setup', 'drag setup', 'touring setup', 'show setup'];

export function makeOptions(vehicleType: VehicleType) {
  return vehicleRegistry.filter((item) => item.vehicleType === vehicleType).map((item) => item.make).sort();
}

export function findMake(vehicleType: VehicleType, make: string) {
  return vehicleRegistry.find((item) => item.vehicleType === vehicleType && item.make.toLowerCase() === make.toLowerCase());
}

export function findModel(vehicleType: VehicleType, make: string, model: string) {
  return findMake(vehicleType, make)?.models.find((item) => item.name.toLowerCase() === model.toLowerCase());
}
