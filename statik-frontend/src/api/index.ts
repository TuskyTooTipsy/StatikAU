import { fallbackProducts } from '../data/products';
import type { CollectionSummary, Product, ProductImage, ProductVariant, ShopSort } from '../types/catalog';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function buildImages(input: any): ProductImage[] {
  if (Array.isArray(input.images) && input.images.length > 0) {
    return input.images.map((image: any, index: number) => ({
      id: image.id ? String(image.id) : undefined,
      url: String(image.url),
      alt: String(image.alt || input.title || 'STATIK product image'),
      position: Number(image.position ?? index),
    }));
  }

  if (input.image) {
    return [
      {
        url: String(input.image),
        alt: String(input.title || 'STATIK product image'),
        position: 0,
      },
    ];
  }

  return [];
}

function buildVariants(input: any): ProductVariant[] {
  if (!Array.isArray(input.variants)) return [];

  return input.variants.map((variant: any, index: number) => ({
    id: String(variant.id || `${input.slug || 'variant'}-${index}`),
    name: String(variant.name || variant.options?.size || 'Default'),
    price: Number(variant.price || input.price || 0),
    sku: String(variant.sku || `${String(input.slug || 'statik').toUpperCase()}-${index}`),
    options: variant.options || null,
  }));
}

function buildCollection(input: any): CollectionSummary | null {
  if (!input.collection) return null;
  return {
    id: input.collection.id ? String(input.collection.id) : undefined,
    name: String(input.collection.name),
    slug: String(input.collection.slug),
  };
}

function mapProduct(input: any): Product {
  const fallback = fallbackProducts.find((product) => product.slug === input.slug) || fallbackProducts[0];

  return {
    id: String(input.id),
    title: String(input.title),
    slug: String(input.slug),
    shortDesc: String(input.shortDesc || fallback.shortDesc),
    description: String(input.description || fallback.description),
    price: Number(input.price),
    compareAt: input.compareAt == null ? fallback.compareAt || null : Number(input.compareAt),
    images: buildImages(input).length > 0 ? buildImages(input) : fallback.images,
    collection: buildCollection(input) || fallback.collection || null,
    tags: Array.isArray(input.tags) && input.tags.length > 0 ? input.tags.map(String) : fallback.tags,
    variants: buildVariants(input).length > 0 ? buildVariants(input) : fallback.variants,
    createdAt: input.createdAt || fallback.createdAt,
    updatedAt: input.updatedAt || fallback.updatedAt,
  };
}

function queryString(params?: { tag?: string; collection?: string; search?: string; sort?: ShopSort }) {
  const query = new URLSearchParams();
  if (!params) return '';
  if (params.tag) query.set('tag', params.tag);
  if (params.collection) query.set('collection', params.collection);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  const value = query.toString();
  return value ? `?${value}` : '';
}

export async function fetchProducts(params?: {
  tag?: string;
  collection?: string;
  search?: string;
  sort?: ShopSort;
}): Promise<Product[]> {
  if (!API_BASE) return fallbackProducts;

  const res = await fetch(`${API_BASE}/products${queryString(params)}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapProduct) : fallbackProducts;
}

export async function fetchProduct(slug: string): Promise<Product> {
  if (!API_BASE) {
    const fallback = fallbackProducts.find((product) => product.slug === slug);
    if (fallback) return fallback;
    throw new Error('Product not found');
  }

  const res = await fetch(`${API_BASE}/products/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const data = await res.json();
  return mapProduct(data);
}

export async function submitContact(payload: { name: string; email: string; message: string }) {
  if (!API_BASE) return { success: true };

  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to send message');
  }

  return res.json();
}

export async function submitNewsletter(payload: { email: string }) {
  if (!API_BASE) return { success: true };

  const res = await fetch(`${API_BASE}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to join newsletter');
  }

  return res.json();
}
