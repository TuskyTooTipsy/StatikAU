import { Router } from 'express';
import { fallbackCollections, fallbackProducts } from '../data/catalog';

function getCollections() {
  return fallbackCollections.map((collection) => {
    const products = fallbackProducts.filter((product) => product.collection?.slug === collection.slug);
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

export default function collectionsRouter() {
  const router = Router();

  router.get('/', async (_req, res) => {
    return res.json(getCollections());
  });

  router.get('/:slug', async (req, res) => {
    const collection = getCollections().find((item) => item.slug === req.params.slug);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    return res.json(collection);
  });

  return router;
}
