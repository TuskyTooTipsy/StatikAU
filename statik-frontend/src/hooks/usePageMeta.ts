import { useEffect } from 'react';

const DEFAULT_TITLE = 'STATIK — Premium Automotive Streetwear';
const DEFAULT_DESCRIPTION =
  'STATIK is premium automotive streetwear and media rooted in car culture, built with luxury discipline and a sharp editorial point of view.';

export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | STATIK` : DEFAULT_TITLE;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', description || DEFAULT_DESCRIPTION);
  }, [title, description]);
}
