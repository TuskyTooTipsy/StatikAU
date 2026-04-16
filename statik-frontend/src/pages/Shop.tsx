import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProducts } from '../api';
import Breadcrumbs from '../components/Breadcrumbs';
import NewsletterSignup from '../components/NewsletterSignup';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { shopCollections } from '../data/brand';
import { filterProducts, getCollectionDefinition } from '../lib/catalog';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Product, ShopSort } from '../types/catalog';

const genderOptions = [
  { label: 'All fits', value: 'all' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Unisex', value: 'unisex' },
];

const typeOptions = [
  { label: 'Everything', value: 'all' },
  { label: 'Tees', value: 'tees' },
  { label: 'Hoodies', value: 'hoodies' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Shoes', value: 'shoes' },
];

const sortOptions: { label: string; value: ShopSort }[] = [
  { label: 'Featured first', value: 'featured' },
  { label: 'Newest first', value: 'newest' },
  { label: 'Price low to high', value: 'price-asc' },
  { label: 'Price high to low', value: 'price-desc' },
  { label: 'Name A–Z', value: 'name' },
];

export default function Shop() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('all');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState<ShopSort>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentCollection = getCollectionDefinition(categorySlug) || shopCollections.find((item) => item.slug === 'all-products');
  usePageMeta(currentCollection?.label || 'Shop', currentCollection?.description || 'Premium category-led automotive streetwear and accessories.');

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    if (!categorySlug) return;
    if (['tees', 'hoodies', 'accessories', 'shoes'].includes(categorySlug)) {
      setType(categorySlug);
      setGender('all');
    } else if (['men', 'women', 'unisex'].includes(categorySlug)) {
      setGender(categorySlug);
      setType('all');
    } else {
      setGender('all');
      setType('all');
    }
  }, [categorySlug]);

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        categorySlug,
        gender,
        type,
        search,
        sort,
      }),
    [products, categorySlug, gender, type, search, sort],
  );

  const categoryCards = shopCollections.filter((item) => item.slug !== 'all-products');

  const FilterPanel = (
    <div className="panel space-y-6 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-silver/50">Search</p>
        <input
          type="search"
          className="field mt-3"
          placeholder="Search products, categories, or drop notes"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-silver/50">Fit</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGender(option.value)}
              className={`filter-chip ${gender === option.value ? 'filter-chip-active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-silver/50">Type</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`filter-chip ${type === option.value ? 'filter-chip-active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="shop-sort" className="text-xs uppercase tracking-[0.24em] text-silver/50">
          Sort
        </label>
        <select id="shop-sort" className="field mt-3" value={sort} onChange={(event) => setSort(event.target.value as ShopSort)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-10 pt-8">
      <section className="shell">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            ...(categorySlug ? [{ label: currentCollection?.label || 'Collection' }] : []),
          ]}
        />
        <div className="page-hero overflow-hidden rounded-[2.5rem] border border-white/10 p-6 md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="eyebrow">{currentCollection?.eyebrow || 'Full catalogue'}</p>
              <h1 className="headline-xl mt-3">{currentCollection?.label || 'Shop STATIK'}</h1>
              <p className="body-muted mt-5 max-w-2xl text-base">
                {currentCollection?.description || 'Premium automotive streetwear, accessory staples, and featured drop pieces organised with clearer pathways and better discovery.'}
              </p>
            </div>
            <div className="panel p-5 md:p-6">
              <p className="text-sm font-semibold text-bone">What changed</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-silver/70 sm:grid-cols-2">
                <p>Real category routes for men, women, unisex, tees, hoodies, shoes, accessories, drops, and newness.</p>
                <p>Cleaner product discovery with filters, search, sorting, breadcrumbs, and better empty states.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell space-y-8">
        <SectionHeading
          eyebrow="Collection architecture"
          title="Shop entry points that feel intentional."
          description="Every major path now has its own home, including premium coming-soon states where inventory is still being prepared."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryCards.map((item) => (
            <Link key={item.slug} to={item.href} className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 p-5 transition hover:border-white/20">
              <img src={item.image} alt={item.label} className="absolute inset-0 h-full w-full object-cover opacity-20 transition duration-700 group-hover:scale-105 group-hover:opacity-30" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/75 to-black/35" />
              <div className="relative space-y-3">
                <p className="eyebrow">{item.eyebrow}</p>
                <h2 className="text-xl font-semibold text-bone">{item.label}</h2>
                <p className="text-sm leading-7 text-silver/65">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell grid gap-8 xl:grid-cols-[300px_1fr]">
        <div className="hidden xl:block">{FilterPanel}</div>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-silver/50">Products</p>
              <h2 className="mt-2 text-2xl font-semibold text-bone">{filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'}</h2>
            </div>
            <button type="button" className="btn-secondary h-11 px-5 text-xs xl:hidden" onClick={() => setMobileFiltersOpen((value) => !value)}>
              {mobileFiltersOpen ? 'Hide filters' : 'Show filters'}
            </button>
          </div>
          {mobileFiltersOpen ? <div className="xl:hidden">{FilterPanel}</div> : null}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="panel overflow-hidden p-7 md:p-10">
              <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
                <div>
                  <p className="eyebrow">Coming soon / no current matches</p>
                  <h3 className="headline-md mt-3">This lane is being prepared for the next drop.</h3>
                  <p className="body-muted mt-4 max-w-2xl">
                    The category structure is live now so the shop feels complete, but not every lane is populated yet. Instead of fake filler inventory, STATIK shows a clean waiting state and pushes interested customers into the newsletter.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/shop" className="btn-secondary h-11 px-5 text-xs">
                      Browse all products
                    </Link>
                    <Link to="/lookbook" className="btn-primary h-11 px-5 text-xs">
                      Explore the brand world
                    </Link>
                  </div>
                </div>
                <NewsletterSignup />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
