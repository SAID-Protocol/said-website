import type { Metadata } from 'next';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import BlogIndex, { type IndexPost } from '@/components/blog/BlogIndex';
import { getAllPosts } from '@/lib/blog';

const TITLE = 'Blog — SAID Protocol';
const DESCRIPTION =
  'Milestones, integrations, and engineering from SAID Protocol — the on-chain identity and reputation layer for AI agents on Solana.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.saidprotocol.com/blog' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.saidprotocol.com/blog',
    siteName: 'SAID Protocol',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function BlogIndexPage() {
  // Trim to what the index renders — the MDX bodies stay on the server.
  const posts: IndexPost[] = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    category: p.category,
    cover: p.cover,
    coverPosition: p.coverPosition,
  }));

  return (
    <div className="said-page said-blog">
      <SaidNav />

      <div className="hero">
        <div className="kick">NOTES FROM THE REGISTRY</div>
        <h1>Blog</h1>
        <p className="lede">Protocol updates, grants, and what agents are building.</p>
      </div>

      {posts.length === 0 ? (
        <p style={{ maxWidth: 1180, margin: '0 auto', padding: '40px clamp(20px,4vw,48px)', color: 'var(--faint)' }}>
          No posts yet. Check back soon.
        </p>
      ) : (
        <BlogIndex posts={posts} />
      )}

      <SaidFooter />
    </div>
  );
}
