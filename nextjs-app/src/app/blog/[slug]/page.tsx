import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
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
    <div className="said-page said-post">
      <SaidNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="postwrap">
        <Link href="/blog" className="backlink mono">← ALL POSTS</Link>

        <article>
          <div className="meta">
            <span className="cat mono">{post.category.toUpperCase()}</span>
            <time dateTime={post.date} className="mono">{formatDate(post.date).toUpperCase()}</time>
          </div>

          <h1>{post.title}</h1>
          {post.excerpt && <p className="standfirst">{post.excerpt}</p>}

          {post.cover && (
            <div className="cover">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                style={{ objectFit: 'cover', objectPosition: post.coverPosition === 'top' ? 'top' : 'center' }}
              />
            </div>
          )}

          <div className="postprose">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <div className="postfoot">
          <p>
            Building an agent? <Link href="/create-agent">Get started</Link> or follow{' '}
            <a href="https://x.com/saidinfra" target="_blank" rel="noreferrer">@saidinfra</a>.
          </p>
        </div>
      </main>

      <SaidFooter />

      <style>{`
        .said-post .postwrap{max-width:760px;margin:0 auto;padding:clamp(36px,6vh,64px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
        .said-post .backlink{display:inline-block;font-size:11px;letter-spacing:.14em;color:var(--faint);margin-bottom:34px}
        .said-post .backlink:hover{color:var(--ink)}
        .said-post .meta{display:flex;align-items:center;gap:14px;margin-bottom:18px}
        .said-post .meta .cat{font-size:10.5px;letter-spacing:.14em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:5px 12px}
        .said-post .meta time{font-size:11px;letter-spacing:.12em;color:var(--faint)}
        .said-post article h1{font-size:clamp(28px,3.8vw,44px);font-weight:500;letter-spacing:-.03em;line-height:1.12}
        .said-post .standfirst{margin-top:16px;font-size:16.5px;line-height:1.65;color:var(--dim)}
        .said-post .cover{position:relative;aspect-ratio:16/9;width:100%;margin-top:28px;border-radius:20px;overflow:hidden;border:1px solid var(--line)}
        .said-post .postprose{margin-top:34px;padding-top:34px;border-top:1px solid var(--line)}
        .said-post .postprose h2{font-size:22px;font-weight:600;letter-spacing:-.01em;margin-top:38px}
        .said-post .postprose h3{font-size:16px;font-weight:600;margin-top:28px}
        .said-post .postprose p{margin-top:14px;font-size:15px;line-height:1.75;color:var(--dim)}
        .said-post .postprose strong,.said-post .postprose b{color:var(--ink);font-weight:500}
        .said-post .postprose a{color:var(--ink);border-bottom:1px solid var(--line)}
        .said-post .postprose a:hover{border-color:var(--ink)}
        .said-post .postprose ul,.said-post .postprose ol{margin-top:14px;padding-left:22px}
        .said-post .postprose li{margin-top:8px;font-size:15px;line-height:1.7;color:var(--dim)}
        .said-post .postprose blockquote{margin-top:18px;border-left:2px solid var(--ink);padding-left:18px;color:var(--dim);font-style:italic}
        .said-post .postprose code{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:.9em;background:var(--card);border:1px solid var(--line);border-radius:6px;padding:2px 6px}
        .said-post .postprose pre{margin-top:16px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px;overflow-x:auto}
        .said-post .postprose pre code{background:none;border:0;padding:0;font-size:12.5px;line-height:1.65}
        .said-post .postprose img{max-width:100%;border-radius:14px;border:1px solid var(--line);margin-top:18px}
        .said-post .postprose hr{border:0;border-top:1px solid var(--line);margin:32px 0}
        .said-post .postfoot{margin-top:52px;border-top:1px solid var(--line);padding-top:26px}
        .said-post .postfoot p{font-size:13.5px;color:var(--faint);line-height:1.7}
        .said-post .postfoot a{color:var(--dim);border-bottom:1px solid var(--line)}
        .said-post .postfoot a:hover{color:var(--ink);border-color:var(--ink)}
      `}</style>
    </div>
  );
}
