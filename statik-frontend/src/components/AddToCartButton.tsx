import { useMemo, useState, type MouseEvent, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getPrimaryImage } from '../lib/catalog';
import { useCartStore } from '../store/cart';
import type { Product } from '../types/catalog';

interface AddToCartButtonProps {
  product: Product;
  optionLabel?: string;
  className?: string;
  sourceRef?: RefObject<HTMLElement | null>;
  compact?: boolean;
}

export default function AddToCartButton({
  product,
  optionLabel,
  className = '',
  sourceRef,
  compact = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const reduceMotion = useReducedMotion();
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(() => {
    if (optionLabel) {
      return product.variants.find((variant) => variant.name === optionLabel) || product.variants[0];
    }
    return product.variants[0];
  }, [optionLabel, product.variants]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const sourceRect = sourceRef?.current?.getBoundingClientRect() || event.currentTarget.getBoundingClientRect();

    if (!reduceMotion) {
      window.dispatchEvent(
        new CustomEvent('statik:add-to-cart', {
          detail: {
            image: getPrimaryImage(product),
            sourceRect: {
              left: sourceRect.left,
              top: sourceRect.top,
              width: sourceRect.width,
              height: sourceRect.height,
            },
          },
        }),
      );
    }

    addItem({
      lineId: `${product.id}:${selectedVariant?.name || 'default'}`,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: Number(selectedVariant?.price || product.price),
      quantity: 1,
      image: getPrimaryImage(product),
      optionLabel: selectedVariant?.name,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.button
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      onClick={handleClick}
      className={`${compact ? 'btn-secondary h-11 px-4 text-xs' : 'btn-primary h-11 px-5 text-xs'} ${className}`}
      type="button"
      aria-label={`Add ${product.title} to cart`}
    >
      <span className="relative inline-flex items-center gap-2 overflow-hidden">
        <span
          className={`absolute inset-0 rounded-full bg-white/10 blur-xl transition-opacity duration-300 ${added ? 'opacity-100' : 'opacity-0'}`}
        />
        <span className="relative">{added ? 'Added to cart' : compact ? 'Quick add' : 'Add to cart'}</span>
      </span>
    </motion.button>
  );
}
