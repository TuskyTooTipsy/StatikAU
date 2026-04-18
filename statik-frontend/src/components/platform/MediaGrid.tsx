import type { MediaAsset } from '../../types/network';

export default function MediaGrid({ media, compact = false }: { media: MediaAsset[]; compact?: boolean }) {
  if (!media.length) return null;

  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
      {media.map((asset) => (
        <div key={asset.id} className="overflow-hidden border border-white/10 bg-black/40" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
          {asset.kind === 'video' ? (
            <video src={asset.url} controls className="h-56 w-full bg-black object-cover" />
          ) : (
            <img src={asset.url} alt={asset.fileName} className="h-56 w-full object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}
