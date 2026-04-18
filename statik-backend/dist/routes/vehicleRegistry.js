"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = vehicleRegistryRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const vehicleRegistry_1 = require("../data/vehicleRegistry");
const store_1 = require("../lib/store");
const DATASET_VERSION = '2026.04-statik-au-expanded-v3';
const allowedTypes = ['car', 'bike', 'truck', 'other'];
function clean(value) {
    return typeof value === 'string' ? value.trim() : '';
}
function nodeFor(type, make) {
    return vehicleRegistry_1.vehicleRegistry.find((node) => (!type || node.vehicleType === type) && node.make.toLowerCase() === make.toLowerCase());
}
function modelFor(type, make, model) {
    return nodeFor(type, make)?.models.find((item) => item.name.toLowerCase() === model.toLowerCase());
}
function unique(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}
function metadata() {
    const makesByType = allowedTypes.reduce((acc, type) => {
        acc[type] = unique(vehicleRegistry_1.vehicleRegistry.filter((node) => node.vehicleType === type).map((node) => node.make));
        return acc;
    }, {});
    return {
        version: DATASET_VERSION,
        source: 'STATIK structured enthusiast reference dataset — Australian market first, global enthusiast compatible',
        allowCustom: true,
        counts: {
            makes: vehicleRegistry_1.vehicleRegistry.length,
            carMakes: makesByType.car.length,
            bikeMakes: makesByType.bike.length,
            truckMakes: makesByType.truck.length,
            models: vehicleRegistry_1.vehicleRegistry.reduce((sum, node) => sum + node.models.length, 0),
        },
        buildStages: vehicleRegistry_1.buildStages,
        ownershipStatuses: vehicleRegistry_1.ownershipStatuses,
        purposeTags: vehicleRegistry_1.purposeTags,
        setupTags: vehicleRegistry_1.setupTags,
    };
}
function vehicleRegistryRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const vehicleType = clean(req.query.vehicleType);
        const make = clean(req.query.make).toLowerCase();
        const model = clean(req.query.model).toLowerCase();
        let nodes = vehicleRegistry_1.vehicleRegistry;
        if (vehicleType && allowedTypes.includes(vehicleType))
            nodes = nodes.filter((node) => node.vehicleType === vehicleType);
        if (make)
            nodes = nodes.filter((node) => node.make.toLowerCase() === make);
        const shaped = nodes.map((node) => ({
            ...node,
            models: model ? node.models.filter((item) => item.name.toLowerCase() === model) : node.models,
        }));
        return res.json({ ...metadata(), registry: shaped });
    });
    router.get('/makes', async (req, res) => {
        const type = clean(req.query.type || req.query.vehicleType);
        const makes = unique(vehicleRegistry_1.vehicleRegistry.filter((node) => !type || node.vehicleType === type).map((node) => node.make));
        return res.json({ ...metadata(), items: makes });
    });
    router.get('/models', async (req, res) => {
        const type = clean(req.query.type || req.query.vehicleType);
        const make = clean(req.query.make);
        const node = make ? nodeFor(type, make) : null;
        const items = node ? node.models.map((item) => item.name) : [];
        return res.json({ ...metadata(), make, items });
    });
    router.get('/generations', async (req, res) => {
        const type = clean(req.query.type || req.query.vehicleType);
        const make = clean(req.query.make);
        const model = clean(req.query.model);
        return res.json({ ...metadata(), make, model, items: unique(modelFor(type, make, model)?.generations || []) });
    });
    router.get('/trims', async (req, res) => {
        const type = clean(req.query.type || req.query.vehicleType);
        const make = clean(req.query.make);
        const model = clean(req.query.model);
        return res.json({ ...metadata(), make, model, items: unique(modelFor(type, make, model)?.trims || []) });
    });
    router.get('/variants', async (req, res) => {
        const type = clean(req.query.type || req.query.vehicleType);
        const make = clean(req.query.make);
        const model = clean(req.query.model);
        const entry = modelFor(type, make, model);
        return res.json({ ...metadata(), make, model, items: unique([...(entry?.specialEditions || []), 'Other', 'Custom special edition', 'Unknown / not sure']) });
    });
    router.get('/search', async (req, res) => {
        const q = clean(req.query.q).toLowerCase();
        const type = clean(req.query.type || req.query.vehicleType);
        const results = [];
        if (!q || q.length < 2)
            return res.json({ ...metadata(), items: [] });
        vehicleRegistry_1.vehicleRegistry
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
    router.post('/custom-suggestion', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({ vehicleType: zod_1.z.enum(['car', 'bike', 'truck', 'other']), make: zod_1.z.string().min(1).max(80), model: zod_1.z.string().min(1).max(100), note: zod_1.z.string().max(500).optional() });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid vehicle suggestion payload' });
        const viewer = req.viewer;
        (0, store_1.mutateDb)((db) => {
            (0, store_1.logAudit)(db, viewer.user.id, 'vehicle_registry_custom_suggestion', 'vehicle_registry', `${parsed.data.make}/${parsed.data.model}`, parsed.data.note || '');
        });
        return res.status(202).json({ success: true, message: 'Custom vehicle suggestion recorded for registry expansion.' });
    });
    return router;
}
