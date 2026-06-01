import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';
import PostCard from '@/components/blog/PostCard';
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
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AsciiBackground />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-28 sm:px-8 sm:pt-32">
        <header className="mb-12">
          <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-400">
            Milestones, integrations, and the engineering behind verifiable identity for AI agents.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-zinc-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
