import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const collections = [
  { name: 'Night Shift 01', slug: 'night-shift-01' },
  { name: 'Pit Lane Core', slug: 'pit-lane-core' },
];

const sharedVariants = (prefix: string, price: number) => [
  { name: 'XS', price, sku: `${prefix.toUpperCase()}-XS`, options: { size: 'XS' } },
  { name: 'S', price, sku: `${prefix.toUpperCase()}-S`, options: { size: 'S' } },
  { name: 'M', price, sku: `${prefix.toUpperCase()}-M`, options: { size: 'M' } },
  { name: 'L', price, sku: `${prefix.toUpperCase()}-L`, options: { size: 'L' } },
  { name: 'XL', price, sku: `${prefix.toUpperCase()}-XL`, options: { size: 'XL' } },
];

const products = [
  {
    title: 'Die-Cut Sticker',
    slug: 'die-cut-sticker',
    shortDesc: 'Premium vinyl decal for windscreens, toolboxes, laptops, and the daily carry.',
    description:
      'A clean, durable STATIK mark for the surfaces that move with you. Sharp cut lines, strong adhesive, and a restrained graphic hit that avoids cheap merch energy.',
    price: 8,
    compareAt: null,
    collectionSlug: 'night-shift-01',
    tags: ['accessories', 'unisex', 'new', 'best-seller', 'featured-drop'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1200&q=80',
        alt: 'STATIK sticker close-up',
        position: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        alt: 'Performance car detail in low light',
        position: 1,
      },
    ],
    variants: [{ name: 'One Size', price: 8, sku: 'STK-STICKER-OS', options: { size: 'OS' } }],
  },
  {
    title: 'STATIK Tee',
    slug: 'statik-tee',
    shortDesc: 'Heavyweight cotton tee with a clean silhouette and subtle culture-coded branding.',
    description:
      'The core tee is built with a structured hand feel and a slightly relaxed drape, designed to work under outerwear or on its own. Premium enough for the city, durable enough for the garage.',
    price: 68,
    compareAt: 82,
    collectionSlug: 'night-shift-01',
    tags: ['tees', 'unisex', 'new', 'featured-drop'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
        alt: 'Black heavyweight tee on rack',
        position: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Editorial streetwear portrait',
        position: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Folded premium tee with dark styling',
        position: 2,
      },
    ],
    variants: sharedVariants('tee', 68),
  },
  {
    title: 'STATIK Shorts',
    slug: 'statik-shorts',
    shortDesc: 'Utility-minded shorts for warm weather, warehouse sessions, and pit-lane movement.',
    description:
      'Cut for comfort without losing line, these shorts carry the same restrained attitude as the core tops. Clean finishes, practical pockets, and a shape that works with oversized tops and jackets.',
    price: 82,
    compareAt: null,
    collectionSlug: 'pit-lane-core',
    tags: ['men', 'featured-drop'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Tailored black shorts with minimal styling',
        position: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Streetwear fit with shorts and oversized tee',
        position: 1,
      },
    ],
    variants: sharedVariants('short', 82),
  },
  {
    title: 'STATIK Pack',
    slug: 'statik-pack',
    shortDesc: 'Minimal carry pack for cameras, cords, essentials, and late-night movement.',
    description:
      'A refined everyday bag with enough structure to feel deliberate and enough flexibility to work on the move. Ideal for quick shoots, city laps, and the daily reset between work and culture.',
    price: 118,
    compareAt: 138,
    collectionSlug: 'pit-lane-core',
    tags: ['accessories', 'unisex', 'best-seller'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
        alt: 'Minimal black backpack product shot',
        position: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        alt: 'Bag and sneaker detail in premium studio light',
        position: 1,
      },
    ],
    variants: [{ name: 'One Size', price: 118, sku: 'STK-PACK-OS', options: { size: 'OS' } }],
  },
  {
    title: 'Cuffed Beanie',
    slug: 'cuffed-beanie',
    shortDesc: 'Dense knit beanie finished with a subtle woven STATIK mark.',
    description:
      'The cold-weather staple: understated, durable, and easy to wear with the rest of the range. Clean enough for daily use, grounded enough to still feel like part of the culture.',
    price: 42,
    compareAt: null,
    collectionSlug: 'pit-lane-core',
    tags: ['accessories', 'unisex', 'best-seller'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Dark cuffed beanie product detail',
        position: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Streetwear styling with knit accessory',
        position: 1,
      },
    ],
    variants: [{ name: 'One Size', price: 42, sku: 'STK-BEANIE-OS', options: { size: 'OS' } }],
  },
  {
    title: 'STATIK Heavyweight Hoodie',
    slug: 'statik-hoodie',
    shortDesc: 'Oversized fleece hoodie built for cold starts and after-dark layering.',
    description:
      'A dense premium fleece cut with a boxy silhouette and enough weight to feel substantial. Designed to bridge the garage, the street, and the long drive home.',
    price: 128,
    compareAt: 148,
    collectionSlug: 'night-shift-01',
    tags: ['hoodies', 'unisex', 'best-seller', 'featured-drop'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        alt: 'Black heavyweight hoodie editorial shot',
        position: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=80',
        alt: 'Dark hoodie layered under outerwear',
        position: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
        alt: 'Night drive mood frame',
        position: 2,
      },
    ],
    variants: sharedVariants('hoodie', 128),
  },
];

async function main() {
  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: { name: collection.name },
      create: collection,
    });
  }

  for (const product of products) {
    const collection = await prisma.collection.findUnique({ where: { slug: product.collectionSlug } });

    if (!collection) {
      throw new Error(`Collection not found for ${product.slug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        shortDesc: product.shortDesc,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        tags: product.tags,
        collectionId: collection.id,
        images: {
          deleteMany: {},
          create: product.images,
        },
        variants: {
          deleteMany: {},
          create: product.variants,
        },
      },
      create: {
        title: product.title,
        slug: product.slug,
        shortDesc: product.shortDesc,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        tags: product.tags,
        collectionId: collection.id,
        images: {
          create: product.images,
        },
        variants: {
          create: product.variants,
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
