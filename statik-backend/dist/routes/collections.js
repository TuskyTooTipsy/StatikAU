"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = collectionsRouter;
const express_1 = require("express");
const catalog_1 = require("../data/catalog");
function getCollections() {
    return catalog_1.fallbackCollections.map((collection) => {
        const products = catalog_1.fallbackProducts.filter((product) => product.collection?.slug === collection.slug);
        return {
            ...collection,
            productCount: products.length,
            products: products.map((product) => ({
                id: product.id,
                title: product.title,
                slug: product.slug,
                price: product.price,
                image: product.images[0]?.url || '',
            })),
        };
    });
}
function collectionsRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (_req, res) => {
        return res.json(getCollections());
    });
    router.get('/:slug', async (req, res) => {
        const collection = getCollections().find((item) => item.slug === req.params.slug);
        if (!collection)
            return res.status(404).json({ error: 'Collection not found' });
        return res.json(collection);
    });
    return router;
}
