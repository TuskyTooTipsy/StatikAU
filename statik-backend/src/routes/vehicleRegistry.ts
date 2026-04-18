import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { vehicleRegistry, buildStages, ownershipStatuses, purposeTags, setupTags } from '../data/vehicleRegistry';
import { logAudit, mutateDb } from '../lib/store';

const DATASET_VERSION = '2026.04-statik-au-expanded-v3';
type VehicleType = 'car' | 'bike' | 'truck' | 'other';
const allowedTypes: VehicleType[] = ['car', 'bike', 'truck', 'other'];

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function nodeFor(type: VehicleType | '', make: string) {
  return vehicleRegistry.find((node) => (!type || node.vehicleType === type) && node.make.toLowerCase() === make.toLowerCase());
}

function modelFor(type: VehicleType | '', make: string, model: string) {
  return nodeFor(type, make)?.models.find((item) => item.name.toLowerCase() === model.toLowerCase());
}

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function metadata() {
  const makesByType = allowedTypes.reduce((acc, type) => {
    acc[type] = unique(vehicleRegistry.filter((node) => node.vehicleType === type).map((node) => node.make));
    return acc;
  }, {} as Record<VehicleType, string[]>);
  return {
    version: DATASET_VERSION,
    source: 'STATIK structured enthusiast reference dataset — Australian market first, global enthusiast compatible',
    allowCustom: true,
    counts: {
      makes: vehicleRegistry.length,
      carMakes: makesByType.car.length,
      bikeMakes: makesByType.bike.length,
      truckMakes: makesByType.truck.length,
      models: vehicleRegistry.reduce((sum, node) => sum + node.models.length, 0),
    },
    buildStages,
    ownershipStatuses,
    purposeTags,
    setupTags,
  };
}

export default function vehicleRegistryRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const vehicleType = clean(req.query.vehicleType) as VehicleType | '';
    const make = clean(req.query.make).toLowerCase();
    const model = clean(req.query.model).toLowerCase();
    let nodes = vehicleRegistry;
    if (vehicleType && allowedTypes.includes(vehicleType)) nodes = nodes.filter((node) => node.vehicleType === vehicleType);
    if (make) nodes = nodes.filter((node) => node.make.toLowerCase() === make);
    const shaped = nodes.map((node) => ({
      ...node,
      models: model ? node.models.filter((item) => item.name.toLowerCase() === model) : node.models,
    }));
    return res.json({ ...metadata(), registry: shaped });
  });

  router.get('/makes', async (req, res) => {
    const type = clean(req.query.type || req.query.vehicleType) as VehicleType | '';
    const makes = unique(vehicleRegistry.filter((node) => !type || node.vehicleType === type).map((node) => node.make));
    return res.json({ ...metadata(), items: makes });
  });

  router.get('/models', async (req, res) => {
    const type = clean(req.query.type || req.query.vehicleType) as VehicleType | '';
    const make = clean(req.query.make);
    const node = make ? nodeFor(type, make) : null;
    const items = node ? node.models.map((item) => item.name) : [];
    return res.json({ ...metadata(), make, items });
  });

  router.get('/generations', async (req, res) => {
    const type = clean(req.query.type || req.query.vehicleType) as VehicleType | '';
    const make = clean(req.query.make);
    const model = clean(req.query.model);
    return res.json({ ...metadata(), make, model, items: unique(modelFor(type, make, model)?.generations || []) });
  });

  router.get('/trims', async (req, res) => {
    const type = clean(req.query.type || req.query.vehicleType) as VehicleType | '';
    const make = clean(req.query.make);
    const model = clean(req.query.model);
    return res.json({ ...metadata(), make, model, items: unique(modelFor(type, make, model)?.trims || []) });
  });

  router.get('/variants', async (req, res) => {
    const type = clean(req.query.type || req.query.vehicleType) as VehicleType | '';
    const make = clean(req.query.make);
    const model = clean(req.query.model);
    const entry = modelFor(type, make, model);
    return res.json({ ...metadata(), make, model, items: unique([...(entry?.specialEditions || []), 'Other', 'Custom special edition', 'Unknown / not sure']) });
  });

  router.get('/search', async (req, res) => {
    const q = clean(req.query.q).toLowerCase();
    const type = clean(req.query.type || req.query.vehicleType) as VehicleType | '';
    const results: any[] = [];
    if (!q || q.length < 2) return res.json({ ...metadata(), items: [] });
    vehicleRegistry
      .filter((node) => !type || node.vehicleType === type)
      .forEach((node) => {
        node.models.forEach((model) => {
          const haystack = [node.vehicleType, node.make, model.name, ...(model.generations || []), ...(model.trims || []), ...(model.specialEditions || []), ...(model.engines || [])].join(' ').toLowerCase();
          if (haystack.includes(q)) {
            results.push({ vehicleType: node.vehicleType, make: node.make, model: model.name, generations: model.generations || [], trims: model.trims || [], specialEditions: model.specialEditions || [] });
          }
        });
      });
    return res.json({ ...metadata(), items: results.slice(0, 60) });
  });

  router.post('/custom-suggestion', requireAuth, async (req, res) => {
    const schema = z.object({ vehicleType: z.enum(['car', 'bike', 'truck', 'other']), make: z.string().min(1).max(80), model: z.string().min(1).max(100), note: z.string().max(500).optional() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid vehicle suggestion payload' });
    const viewer = (req as any).viewer;
    mutateDb((db) => {
      logAudit(db, viewer.user.id, 'vehicle_registry_custom_suggestion', 'vehicle_registry', `${parsed.data.make}/${parsed.data.model}`, parsed.data.note || '');
    });
    return res.status(202).json({ success: true, message: 'Custom vehicle suggestion recorded for registry expansion.' });
  });

  return router;
}
