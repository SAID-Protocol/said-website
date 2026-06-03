import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';
import { mdxComponents } from '@/components/blog/mdx';
import { getPost } from '@/lib/blog';

const SITE = 'https://www.saidprotocol.com';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Not found — SAID Protocol' };

  const url = `${SITE}/blog/${post.slug}`;
  const image = post.cover ? `${SITE}${post.cover}` : `${SITE}/og-image.jpg`;

  return {
    title: `${post.title} — SAID Protocol`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'SAID Protocol',
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: [{ url: image, width: 1280, height: 640, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE}/blog/${post.slug}`;
  const image = post.cover ? `${SITE}${post.cover}` : `${SITE}/og-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: post.author ?? 'SAID Protocol', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'SAID Protocol',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AsciiBackground />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-28 sm:px-8 sm:pt-32">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All posts
        </Link>

        <article>
          <div className="mb-4 flex items-center gap-2 text-xs">
            <span className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-0.5 font-medium text-zinc-300">
              {post.category}
            </span>
            <time dateTime={post.date} className="text-zinc-500">
              {formatDate(post.date)}
            </time>
          </div>

          <h1 className="mb-3 text-4xl font-bold leading-tight">{post.title}</h1>
          {post.excerpt && <p className="mb-8 text-lg text-zinc-400">{post.excerpt}</p>}

          <div className="prose prose-invert prose-zinc max-w-none border-t border-zinc-800 pt-8 prose-headings:font-semibold prose-a:text-white prose-a:underline-offset-4">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <p className="text-sm text-zinc-500">
            Building an agent?{' '}
            <Link href="/create-agent" className="text-white underline underline-offset-4">
              Get started
            </Link>{' '}
            or follow{' '}
            <a
              href="https://x.com/saidinfra"
              target="_blank"
              rel="noreferrer"
              className="text-white underline underline-offset-4"
            >
              @saidinfra
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
