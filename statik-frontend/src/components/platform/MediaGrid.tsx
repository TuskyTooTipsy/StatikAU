import type { MediaAsset } from '../../types/network';

export default function MediaGrid({ media, compact = false }: { media: MediaAsset[]; compact?: boolean }) {
  if (!media.length) return null;

  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
      {media.map((asset, index) => {
        const label = asset.altText || asset.displayTitle || asset.caption || `STATIK media ${index + 1}`;
        return (
          <figure key={asset.id} className="overflow-hidden border border-white/10 bg-black/40" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
            {asset.kind === 'video' ? (
              <video src={asset.url} controls className="h-56 w-full bg-black object-cover" aria-label={label} />
            ) : (
              <img src={asset.url} alt={label} className="h-56 w-full object-cover" />
            )}
            {(asset.displayTitle || asset.caption) ? (
              <figcaption className="border-t border-white/10 bg-black/65 p-3">
                {asset.displayTitle ? <p className="text-xs uppercase tracking-[0.2em] text-bone">{asset.displayTitle}</p> : null}
                {asset.caption ? <p className="mt-1 text-xs leading-5 text-silver/65">{asset.caption}</p> : null}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
