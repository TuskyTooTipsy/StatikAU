import { motion } from 'framer-motion';
import type { OfficialPost } from '../../types/platform';

export default function PostCard({ post }: { post: OfficialPost }) {
  return (
    <motion.article layout className="panel overflow-hidden">
      {post.media[0] ? (
        <img src={post.media[0].url} alt={post.title} className="h-64 w-full object-cover" />
      ) : null}
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {post.pinned ? <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bone">Pinned</span> : null}
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-silver/70">{post.category}</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-silver/50">{new Date(post.createdAt).toLocaleDateString()}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-bone">{post.title}</h3>
          <p className="mt-3 text-sm leading-7 text-silver/70">{post.excerpt}</p>
          <p className="mt-4 text-sm leading-7 text-silver/60">{post.body}</p>
        </div>
        <div className="flex items-center gap-5 text-xs uppercase tracking-[0.22em] text-silver/55">
          <span>{post.likes} likes</span>
          <span>{post.comments} comments</span>
          {post.partner ? <span>{post.partner}</span> : null}
        </div>
      </div>
    </motion.article>
  );
}
