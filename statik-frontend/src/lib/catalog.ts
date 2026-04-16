import { shopCollections } from '../data/brand';
import type { CollectionDefinition, Product, ShopSort } from '../types/catalog';

export function normaliseTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function hasTag(product: Product, tag: string) {
  return product.tags.some((item) => normaliseTag(item) === normaliseTag(tag));
}

export function getCollectionDefinition(slug?: string | null): CollectionDefinition | undefined {
  if (!slug) return undefined;
  return shopCollections.find((collection) => collection.slug === slug);
}

export function getPrimaryImage(product: Product) {
  return product.images[0]?.url || '';
}

export function getSecondaryImage(product: Product) {
  return product.images[1]?.url || getPrimaryImage(product);
}

export function getProductBadges(product: Product) {
  const badges: { label: string; tone: 'accent' | 'neutral' | 'ghost' }[] = [];

  if (hasTag(product, 'new')) badges.push({ label: 'New', tone: 'accent' });
  if (hasTag(product, 'best-seller')) badges.push({ label: 'Best Seller', tone: 'neutral' });
  if (hasTag(product, 'featured-drop')) badges.push({ label: 'Drop', tone: 'ghost' });
  if (hasTag(product, 'sale') || (product.compareAt && product.compareAt > product.price)) {
    badges.push({ label: 'Marked Down', tone: 'accent' });
  }

  return badges.slice(0, 3);
}

export function getCategoryProducts(products: Product[], slug?: string | null) {
  const definition = getCollectionDefinition(slug);
  if (!definition) return products;

  return products.filter((product) => {
    const tagMatch = !definition.filters.tags?.length || definition.filters.tags.some((tag) => hasTag(product, tag));
    const collectionMatch =
      !definition.filters.collection?.length ||
      definition.filters.collection.some((collectionSlug) => product.collection?.slug === collectionSlug);

    return tagMatch && collectionMatch;
  });
}

export function filterProducts(
  products: Product[],
  options: {
    categorySlug?: string | null;
    gender?: string;
    type?: string;
    search?: string;
    sort?: ShopSort;
  },
) {
  const categoryFiltered = getCategoryProducts(products, options.categorySlug);
  const searchTerm = options.search?.trim().toLowerCase() || '';

  const filtered = categoryFiltered.filter((product) => {
    const genderMatch = !options.gender || options.gender === 'all' || hasTag(product, options.gender);
    const typeMatch = !options.type || options.type === 'all' || hasTag(product, options.type);
    const searchMatch =
      !searchTerm ||
      `${product.title} ${product.shortDesc} ${product.description} ${product.tags.join(' ')}`
        .toLowerCase()
        .includes(searchTerm);

    return genderMatch && typeMatch && searchMatch;
  });

  return filtered.sort((left, right) => {
    const sort = options.sort || 'featured';

    if (sort === 'price-asc') return left.price - right.price;
    if (sort === 'price-desc') return right.price - left.price;
    if (sort === 'name') return left.title.localeCompare(right.title);
    if (sort === 'newest') {
      const leftDate = new Date(left.createdAt || 0).getTime();
      const rightDate = new Date(right.createdAt || 0).getTime();
      return rightDate - leftDate;
    }

    const score = (product: Product) => {
      let total = 0;
      if (hasTag(product, 'featured-drop')) total += 3;
      if (hasTag(product, 'best-seller')) total += 2;
      if (hasTag(product, 'new')) total += 1;
      return total;
    };

    return score(right) - score(left) || right.price - left.price;
  });
}

export function getRelatedProducts(products: Product[], currentProduct: Product) {
  const currentTags = currentProduct.tags.map(normaliseTag);

  return products
    .filter((product) => product.slug !== currentProduct.slug)
    .map((product) => ({
      product,
      score: product.tags.filter((tag) => currentTags.includes(normaliseTag(tag))).length,
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map((item) => item.product);
}
