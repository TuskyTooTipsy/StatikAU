export interface ProductImage {
  id?: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  options?: Record<string, string> | null;
}

export interface CollectionSummary {
  id?: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAt?: number | null;
  images: ProductImage[];
  collection?: CollectionSummary | null;
  tags: string[];
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export type ShopSort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name';

export interface CollectionDefinition {
  slug: string;
  label: string;
  description: string;
  eyebrow: string;
  href: string;
  filters: {
    tags?: string[];
    collection?: string[];
  };
  image: string;
  accent: string;
  comingSoon?: boolean;
}

export interface ProductDetailStory {
  designedFor: string;
  fit: string;
  materials: string[];
  care: string[];
  styling: string;
  delivery: string;
  notes: string[];
}
