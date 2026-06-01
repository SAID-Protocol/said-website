import Link from 'next/link';
import Image from 'next/image';
import type { PostMeta } from '@/lib/blog';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition hover:border-zinc-700 hover:bg-zinc-900"
    >
      {post.cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-zinc-800 bg-zinc-950">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 transition group-hover:opacity-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-0.5 font-medium text-zinc-300">
            {post.category}
          </span>
          <time dateTime={post.date} className="text-zinc-500">
            {formatDate(post.date)}
          </time>
        </div>
        <h2 className="mb-2 text-lg font-semibold leading-snug text-white transition group-hover:text-white">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-[13px] leading-relaxed text-zinc-400">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-zinc-300 transition group-hover:gap-2">
          Read more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
