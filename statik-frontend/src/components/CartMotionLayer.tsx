import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface MotionState {
  key: number;
  image: string;
  sourceRect: { left: number; top: number; width: number; height: number };
  targetRect: { left: number; top: number; width: number; height: number };
}

export default function CartMotionLayer() {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<MotionState | null>(null);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (!detail?.image || !detail?.sourceRect) return;

      const target = document.querySelector('[data-cart-button]');
      if (!target) return;
      const targetRect = target.getBoundingClientRect();

      setState({
        key: Date.now(),
        image: detail.image,
        sourceRect: detail.sourceRect,
        targetRect: {
          left: targetRect.left,
          top: targetRect.top,
          width: targetRect.width,
          height: targetRect.height,
        },
      });
    };

    window.addEventListener('statik:add-to-cart', handler);
    return () => window.removeEventListener('statik:add-to-cart', handler);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {state ? (
        <motion.img
          key={state.key}
          src={state.image}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed z-[73] rounded-2xl object-cover shadow-2xl shadow-black/40"
          initial={{
            left: state.sourceRect.left,
            top: state.sourceRect.top,
            width: state.sourceRect.width,
            height: state.sourceRect.height,
            opacity: 0.95,
            scale: 1,
            rotate: 0,
          }}
          animate={{
            left: state.targetRect.left + state.targetRect.width / 2 - 18,
            top: state.targetRect.top + state.targetRect.height / 2 - 18,
            width: 36,
            height: 36,
            opacity: 0.1,
            scale: 0.35,
            rotate: 8,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setState(null)}
        />
      ) : null}
    </AnimatePresence>
  );
}
