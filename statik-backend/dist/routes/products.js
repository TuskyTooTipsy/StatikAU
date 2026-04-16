"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = productsRouter;
const express_1 = require("express");
const catalog_1 = require("../data/catalog");
function mapProduct(product) {
    return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        shortDesc: product.shortDesc,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        images: product.images,
        collection: product.collection,
        tags: product.tags,
        variants: product.variants,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        image: product.images?.[0]?.url || '',
    };
}
function applyFilters(params) {
    const { tag, collection, search, sort = 'newest' } = params;
    let products = [...catalog_1.fallbackProducts];
    if (tag)
        products = products.filter((product) => product.tags.includes(tag));
    if (collection)
        products = products.filter((product) => product.collection?.slug === collection);
    if (search) {
        const query = search.toLowerCase();
        products = products.filter((product) => `${product.title} ${product.shortDesc} ${product.description}`.toLowerCase().includes(query));
    }
    products.sort((a, b) => {
        if (sort === 'price-asc')
            return a.price - b.price;
        if (sort === 'price-desc')
            return b.price - a.price;
        if (sort === 'name')
            return a.title.localeCompare(b.title);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return products.map(mapProduct);
}
function productsRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (req, res) => {
        const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;
        const collection = typeof req.query.collection === 'string' ? req.query.collection : undefined;
        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';
        return res.json(applyFilters({ tag, collection, search, sort }));
    });
    router.get('/:slug', async (req, res) => {
        const product = catalog_1.fallbackProducts.find((item) => item.slug === req.params.slug);
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        return res.json(mapProduct(product));
    });
    return router;
}
