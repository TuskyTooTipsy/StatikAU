export type CatalogImage = {
  id?: string;
  url: string;
  alt: string;
  position: number;
};

export type CatalogVariant = {
  id: string;
  name: string;
  price: number;
  sku: string;
  options?: Record<string, string> | null;
};

export type CatalogCollection = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogProduct = {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAt: number | null;
  images: CatalogImage[];
  collection: CatalogCollection | null;
  tags: string[];
  variants: CatalogVariant[];
  createdAt: string;
  updatedAt: string;
};

const sharedVariants = (prefix: string, price: number): CatalogVariant[] => [
  { id: `${prefix}-xs`, name: 'XS', price, sku: `${prefix.toUpperCase()}-XS`, options: { size: 'XS' } },
  { id: `${prefix}-s`, name: 'S', price, sku: `${prefix.toUpperCase()}-S`, options: { size: 'S' } },
  { id: `${prefix}-m`, name: 'M', price, sku: `${prefix.toUpperCase()}-M`, options: { size: 'M' } },
  { id: `${prefix}-l`, name: 'L', price, sku: `${prefix.toUpperCase()}-L`, options: { size: 'L' } },
  { id: `${prefix}-xl`, name: 'XL', price, sku: `${prefix.toUpperCase()}-XL`, options: { size: 'XL' } },
];

export const fallbackCollections: CatalogCollection[] = [
  { id: 'night-shift-01', name: 'Night Shift 01', slug: 'night-shift-01' },
  { id: 'pit-lane-core', name: 'Pit Lane Core', slug: 'pit-lane-core' },
];

export const fallbackProducts: CatalogProduct[] = [
  {
    id: '1',
    title: 'Die-Cut Sticker',
    slug: 'die-cut-sticker',
    shortDesc: 'Premium vinyl decal for windscreens, toolboxes, laptops, and the daily carry.',
    description: 'A clean, durable STATIK mark for the surfaces that move with you.',
    price: 8,
    compareAt: null,
    collection: fallbackCollections[0],
    tags: ['accessories', 'unisex', 'new', 'best-seller', 'featured-drop'],
    images: [
      { url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1200&q=80', alt: 'STATIK sticker close-up', position: 0 },
      { url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80', alt: 'Performance car detail in low light', position: 1 }
    ],
    variants: [{ id: 'sticker-os', name: 'One Size', price: 8, sku: 'STK-STICKER-OS', options: { size: 'OS' } }],
    createdAt: '2026-03-30T10:00:00.000Z',
    updatedAt: '2026-03-30T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'STATIK Tee',
    slug: 'statik-tee',
    shortDesc: 'Heavyweight cotton tee with a clean silhouette and subtle culture-coded branding.',
    description: 'The core tee is built with a structured hand feel and a slightly relaxed drape.',
    price: 68,
    compareAt: 82,
    collection: fallbackCollections[0],
    tags: ['tees', 'unisex', 'new', 'featured-drop'],
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80', alt: 'Black heavyweight tee on rack', position: 0 },
      { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80', alt: 'Editorial streetwear portrait', position: 1 }
    ],
    variants: sharedVariants('tee', 68),
    createdAt: '2026-04-04T10:00:00.000Z',
    updatedAt: '2026-04-04T10:00:00.000Z'
  },
  {
    id: '3',
    title: 'STATIK Heavyweight Hoodie',
    slug: 'statik-hoodie',
    shortDesc: 'Oversized fleece hoodie built for cold starts and after-dark layering.',
    description: 'A dense premium fleece cut with a boxy silhouette and enough weight to feel substantial.',
    price: 128,
    compareAt: 148,
    collection: fallbackCollections[0],
    tags: ['hoodies', 'unisex', 'best-seller', 'featured-drop'],
    images: [
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80', alt: 'Black heavyweight hoodie editorial shot', position: 0 },
      { url: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=80', alt: 'Dark hoodie layered under outerwear', position: 1 }
    ],
    variants: sharedVariants('hoodie', 128),
    createdAt: '2026-03-10T10:00:00.000Z',
    updatedAt: '2026-03-10T10:00:00.000Z'
  },
  {
    id: '4',
    title: 'STATIK Pack',
    slug: 'statik-pack',
    shortDesc: 'Minimal carry pack for cameras, cords, essentials, and late-night movement.',
    description: 'A refined everyday bag with enough structure to feel deliberate.',
    price: 118,
    compareAt: 138,
    collection: fallbackCollections[1],
    tags: ['accessories', 'unisex', 'best-seller'],
    images: [
      { url: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80', alt: 'Minimal black backpack product shot', position: 0 },
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', alt: 'Bag and sneaker detail in premium studio light', position: 1 }
    ],
    variants: [{ id: 'pack-os', name: 'One Size', price: 118, sku: 'STK-PACK-OS', options: { size: 'OS' } }],
    createdAt: '2026-02-14T10:00:00.000Z',
    updatedAt: '2026-02-14T10:00:00.000Z'
  }
];

export function getFallbackProductBySlug(slug: string) {
  return fallbackProducts.find((product) => product.slug === slug) || null;
}

export function getFallbackProductById(id: string) {
  return fallbackProducts.find((product) => product.id === id) || null;
}
