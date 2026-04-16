import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProduct, fetchProducts } from '../api';
import AddToCartButton from '../components/AddToCartButton';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { productStories } from '../data/products';
import { getProductBadges, getRelatedProducts } from '../lib/catalog';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Product } from '../types/catalog';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [catalogue, setCatalogue] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetchProduct(slug)
      .then((result) => {
        setProduct(result);
        setSelectedVariant(result.variants[0]?.name || 'Default');
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('We could not load this product right now.');
      });

    fetchProducts().then(setCatalogue).catch(console.error);
  }, [slug]);

  const story = product ? productStories[product.slug] : null;
  const badges = useMemo(() => (product ? getProductBadges(product) : []), [product]);
  const relatedProducts = useMemo(() => (product ? getRelatedProducts(catalogue, product) : []), [catalogue, product]);

  usePageMeta(product?.title, product?.shortDesc || product?.description);

  if (error) {
    return <div className="shell py-16 text-silver/70">{error}</div>;
  }

  if (!product) {
    return <div className="shell py-16 text-silver/70">Loading product…</div>;
  }

  const activeImage = product.images[selectedImage] || product.images[0];
  const selectedVariantData = product.variants.find((variant) => variant.name === selectedVariant) || product.variants[0];

  return (
    <div className="space-y-16 pb-20 pt-8">
      <section className="shell">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            ...(product.collection ? [{ label: product.collection.name, href: `/shop/featured-drop` }] : []),
            { label: product.title },
          ]}
        />
        <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div ref={heroRef} className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5">
              <img src={activeImage.url} alt={activeImage.alt || product.title} className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-[1.25rem] border transition ${selectedImage === index ? 'border-blood/70' : 'border-white/10 hover:border-white/20'}`}
                >
                  <img src={image.url} alt={image.alt || `${product.title} thumbnail ${index + 1}`} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <div className="panel p-6 md:p-7">
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge.label} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-silver/70">
                    {badge.label}
                  </span>
                ))}
                {product.collection ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-silver/70">
                    {product.collection.name}
                  </span>
                ) : null}
              </div>
              <h1 className="headline-lg mt-5">{product.title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-silver/72">{product.shortDesc}</p>
              <div className="mt-6 flex items-end gap-3">
                <p className="text-3xl font-semibold text-bone">${(selectedVariantData?.price || product.price).toFixed(2)}</p>
                {product.compareAt && product.compareAt > product.price ? (
                  <p className="pb-1 text-base text-silver/40 line-through">${product.compareAt.toFixed(2)}</p>
                ) : null}
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-silver/50">Size</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant.name)}
                      className={`filter-chip min-w-[3.25rem] justify-center ${selectedVariant === variant.name ? 'filter-chip-active' : ''}`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
                <AddToCartButton product={product} optionLabel={selectedVariant} sourceRef={heroRef} className="h-12 justify-center" />
                <Link to="/shipping" className="btn-secondary h-12 justify-center px-5 text-xs">
                  Shipping info
                </Link>
              </div>
              <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm text-silver/65 sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-bone">Designed for</p>
                  <p className="mt-2 leading-7">{story?.designedFor}</p>
                </div>
                <div>
                  <p className="font-semibold text-bone">Delivery notes</p>
                  <p className="mt-2 leading-7">{story?.delivery}</p>
                </div>
                <div>
                  <p className="font-semibold text-bone">Returns summary</p>
                  <p className="mt-2 leading-7">Faults and incorrect items are prioritised. Policy details stay clear on the dedicated support page.</p>
                </div>
              </div>
            </div>

            <div className="panel p-6 md:p-7">
              <p className="text-base leading-8 text-silver/72">{product.description}</p>
              <div className="mt-8 space-y-4">
                <details className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-4" open>
                  <summary className="cursor-pointer list-none font-semibold text-bone">Fit & silhouette</summary>
                  <p className="mt-3 text-sm leading-7 text-silver/68">{story?.fit}</p>
                </details>
                <details className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <summary className="cursor-pointer list-none font-semibold text-bone">Materials & care</summary>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-silver/68">
                      {story?.materials?.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-silver/68">
                      {story?.care?.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </details>
                <details className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <summary className="cursor-pointer list-none font-semibold text-bone">Styling notes & product cues</summary>
                  <p className="mt-3 text-sm leading-7 text-silver/68">{story?.styling}</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-silver/68">
                    {story?.notes?.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="shell space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Related pieces</p>
              <h2 className="headline-lg mt-3">Complete the uniform.</h2>
            </div>
            <p className="body-muted max-w-xl">Recommended from shared collection language, category tags, and overall merchandising fit.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/85 p-4 backdrop-blur-xl xl:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-bone">{product.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-silver/60">{selectedVariantData?.name || 'Default'} · ${(selectedVariantData?.price || product.price).toFixed(2)}</p>
          </div>
          <AddToCartButton product={product} optionLabel={selectedVariant} sourceRef={heroRef} compact={false} className="h-11 px-5 text-xs" />
        </div>
      </div>
    </div>
  );
}
