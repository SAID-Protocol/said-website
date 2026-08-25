import type { Metadata } from 'next';
import Link from 'next/link';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
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

function fmtDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z')
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
    .toUpperCase();
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="said-page said-blog">
      <SaidNav />

      <div className="hero">
        <div className="kick">NOTES FROM THE REGISTRY</div>
        <h1>Blog</h1>
        <p className="lede">Protocol updates, grants, and what agents are building.</p>
      </div>

      <DotSeam style={{ marginTop: 'clamp(28px,4vh,44px)' }} />

      <div className="posts">
        {posts.length === 0 ? (
          <p style={{ color: 'var(--faint)' }}>No posts yet. Check back soon.</p>
        ) : (
          posts.map((post) => (
            <div className="post rv" key={post.slug}>
              <span className="date mono">{fmtDate(post.date)}</span>
              <div>
                <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <span className="tag">{post.category.toUpperCase()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <SaidFooter />

      <style>{`
        .said-blog .posts{max-width:900px;margin:0 auto;padding:clamp(28px,4vh,44px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
        .said-blog .post{display:grid;grid-template-columns:150px 1fr;gap:clamp(20px,3vw,44px);padding:clamp(26px,4vh,38px) 0;border-top:1px solid var(--line)}
        .said-blog .post .date{font-size:12px;letter-spacing:.1em;color:var(--faint);padding-top:5px}
        .said-blog .post h3{font-size:clamp(19px,2.2vw,26px);font-weight:500;letter-spacing:-.02em;line-height:1.25}
        .said-blog .post h3 a:hover{color:var(--dim)}
        .said-blog .post p{margin-top:8px;font-size:14px;line-height:1.65;color:var(--dim);max-width:56ch}
        .said-blog .post .tag{display:inline-block;margin-top:12px;font-size:11px;letter-spacing:.14em;color:var(--faint)}
        @media (max-width:700px){.said-blog .post{grid-template-columns:1fr;gap:8px}}
      `}</style>
    </div>
  );
}
