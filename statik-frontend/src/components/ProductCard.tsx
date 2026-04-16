import { useRef } from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';
import { getPrimaryImage, getProductBadges, getSecondaryImage } from '../lib/catalog';
import type { Product } from '../types/catalog';

export default function ProductCard({ product }: { product: Product }) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const badges = getProductBadges(product);
  const primaryImage = getPrimaryImage(product);
  const secondaryImage = getSecondaryImage(product);
  const sizes = product.variants
    .map((variant) => variant.options?.size || variant.name)
    .filter(Boolean)
    .slice(0, 4) as string[];

  return (
    <article className="product-card group">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
        <Link to={`/product/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood/70">
          <div ref={imageRef} className="relative aspect-[4/5] overflow-hidden bg-graphite">
            <img
              src={primaryImage}
              alt={product.images[0]?.alt || product.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
            {secondaryImage && secondaryImage !== primaryImage ? (
              <img
                src={secondaryImage}
                alt={product.images[1]?.alt || `${product.title} alternate view`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100"
                loading="lazy"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${
                    badge.tone === 'accent'
                      ? 'bg-blood/80 text-bone'
                      : badge.tone === 'neutral'
                        ? 'bg-white/10 text-bone'
                        : 'bg-black/40 text-bone'
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <div className="absolute inset-x-4 bottom-4 flex translate-y-3 justify-between gap-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <AddToCartButton product={product} sourceRef={imageRef} compact className="flex-1" />
          <Link to={`/product/${product.slug}`} className="btn-secondary h-11 px-4 text-xs">
            View
          </Link>
        </div>
      </div>
      <div className="space-y-4 px-1 pb-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            {product.collection ? (
              <p className="text-[10px] uppercase tracking-[0.28em] text-silver/60">{product.collection.name}</p>
            ) : null}
            <Link to={`/product/${product.slug}`} className="mt-2 block text-lg font-semibold tracking-wide text-bone transition hover:text-white">
              {product.title}
            </Link>
            <p className="body-muted mt-2 line-clamp-2 text-sm">{product.shortDesc}</p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-bone">${product.price.toFixed(2)}</p>
            {product.compareAt && product.compareAt > product.price ? (
              <p className="mt-1 text-sm text-silver/50 line-through">${product.compareAt.toFixed(2)}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.24em] text-silver/60">
          <div className="flex flex-wrap gap-2">
            {sizes.length > 0 ? sizes.map((size) => <span key={size}>{size}</span>) : <span>One size</span>}
          </div>
          <span>{product.tags.find((tag) => ['tees', 'hoodies', 'accessories', 'men', 'unisex'].includes(tag)) || 'Core'}</span>
        </div>
      </div>
    </article>
  );
}
