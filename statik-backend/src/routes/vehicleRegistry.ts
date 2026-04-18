import { Router } from 'express';
import { vehicleRegistry, buildStages, ownershipStatuses, purposeTags, setupTags } from '../data/vehicleRegistry';

const DATASET_VERSION = '2026.04-statik-au-enthusiast-v2';

export default function vehicleRegistryRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const vehicleType = typeof req.query.vehicleType === 'string' ? req.query.vehicleType : '';
    const make = typeof req.query.make === 'string' ? req.query.make.toLowerCase() : '';
    const model = typeof req.query.model === 'string' ? req.query.model.toLowerCase() : '';
    let nodes = vehicleRegistry;
    if (vehicleType) nodes = nodes.filter((node) => node.vehicleType === vehicleType);
    if (make) nodes = nodes.filter((node) => node.make.toLowerCase() === make);
    const shaped = nodes.map((node) => ({
      ...node,
      models: model ? node.models.filter((item) => item.name.toLowerCase() === model) : node.models,
    }));
    return res.json({
      version: DATASET_VERSION,
      source: 'STATIK structured enthusiast reference dataset',
      allowCustom: true,
      registry: shaped,
      buildStages,
      ownershipStatuses,
      purposeTags,
      setupTags,
    });
  });

  return router;
}
