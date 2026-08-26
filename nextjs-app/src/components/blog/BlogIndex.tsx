'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DotSeam from '@/components/said/DotSeam';

export interface IndexPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  cover?: string;
  coverPosition?: 'top' | 'center';
}

function fmt(iso: string): string {
  return new Date(iso + 'T00:00:00Z')
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
    .toUpperCase();
}

export default function BlogIndex({ posts }: { posts: IndexPost[] }) {
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];
  const [active, setActive] = useState('All');

  const shown = active === 'All' ? posts : posts.filter((p) => p.category === active);
  // The newest post leads, but only in the unfiltered view — otherwise the
  // "featured" slot would jump around as you filter.
  const lead = active === 'All' ? shown[0] : null;
  const rest = lead ? shown.slice(1) : shown;

  return (
    <>
      <div className="tools">
        <div className="tabs">
          {categories.map((c) => (
            <button key={c} className={`tab${active === c ? ' on' : ''}`} onClick={() => setActive(c)}>
              {c}
            </button>
          ))}
        </div>
        <span className="count mono">
          {shown.length} {shown.length === 1 ? 'POST' : 'POSTS'}
        </span>
      </div>

      <DotSeam style={{ marginTop: 'clamp(20px,3vh,28px)' }} />

      <div className="posts">
        {lead && (
          <Link href={`/blog/${lead.slug}`} className="lead">
            {lead.cover && (
              <span className="leadcover">
                <Image
                  src={lead.cover}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 900px"
                  priority
                  style={{ objectFit: 'cover', objectPosition: lead.coverPosition === 'top' ? 'top' : 'center' }}
                />
              </span>
            )}
            <span className="leadbody">
              <span className="meta mono">
                <span className="cat">{lead.category.toUpperCase()}</span>
                <span>{fmt(lead.date)}</span>
              </span>
              <h2>{lead.title}</h2>
              <p>{lead.excerpt}</p>
              <span className="more mono">READ →</span>
            </span>
          </Link>
        )}

        <div className="grid">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="pcard">
              {p.cover && (
                <span className="pcover">
                  <Image
                    src={p.cover}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 420px"
                    style={{ objectFit: 'cover', objectPosition: p.coverPosition === 'top' ? 'top' : 'center' }}
                  />
                </span>
              )}
              <span className="meta mono">
                <span className="cat">{p.category.toUpperCase()}</span>
                <span>{fmt(p.date)}</span>
              </span>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`.said-blog .tools {
          max-width: 1180px; margin: clamp(24px,4vh,36px) auto 0;
          padding: 0 clamp(20px,4vw,48px);
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }.said-blog .tabs { display: flex; gap: 8px; flex-wrap: wrap; }.said-blog .tab {
          padding: 9px 17px; border-radius: 99px; border: 1px solid var(--line);
          background: none; color: var(--dim); font-size: 12.5px;
          font-family: inherit; cursor: pointer; transition: .2s;
        }.said-blog .tab:hover { border-color: var(--ink); color: var(--ink); }.said-blog .tab.on { background: var(--ink); color: var(--bg); border-color: var(--ink); }.said-blog .count { font-size: 11px; letter-spacing: .14em; color: var(--faint); }.said-blog .posts {
          max-width: 1180px; margin: 0 auto;
          padding: clamp(24px,4vh,36px) clamp(20px,4vw,48px) clamp(56px,9vh,90px);
        }.said-blog .lead {
          display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(24px,4vw,48px);
          align-items: center; padding-bottom: clamp(28px,4vh,44px);
          margin-bottom: clamp(28px,4vh,44px); border-bottom: 1px solid var(--line);
        }.said-blog .leadcover {
          position: relative; display: block; aspect-ratio: 16/10;
          border-radius: 20px; overflow: hidden; border: 1px solid var(--line);
          background: var(--card);
        }.said-blog .lead h2 {
          margin-top: 14px; font-size: clamp(24px,3vw,38px); font-weight: 500;
          letter-spacing: -.03em; line-height: 1.14;
        }.said-blog .lead p {
          margin-top: 14px; font-size: 15px; line-height: 1.7;
          color: var(--dim); max-width: 46ch;
        }.said-blog .more {
          display: inline-block; margin-top: 20px; font-size: 11px;
          letter-spacing: .14em; color: var(--faint);
        }.said-blog .lead:hover .more { color: var(--ink); }.said-blog .grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(24px,3vw,36px) clamp(20px,2.5vw,30px);
        }.said-blog .pcard { display: block; }.said-blog .pcover {
          position: relative; display: block; aspect-ratio: 16/10;
          border-radius: 16px; overflow: hidden; border: 1px solid var(--line);
          background: var(--card); margin-bottom: 14px;
        }.said-blog .pcard:hover .pcover { border-color: var(--ink); }.said-blog .pcard h3 {
          margin-top: 10px; font-size: 17px; font-weight: 500;
          letter-spacing: -.02em; line-height: 1.3;
        }.said-blog .pcard p {
          margin-top: 8px; font-size: 13.5px; line-height: 1.65;
          color: var(--dim);
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
          overflow: hidden;
        }.said-blog .meta { display: flex; align-items: center; gap: 10px; font-size: 10.5px; letter-spacing: .12em; color: var(--faint); }.said-blog .cat { color: var(--dim); border: 1px solid var(--line); border-radius: 99px; padding: 4px 10px; }

        @media (max-width: 900px) {.said-blog .lead { grid-template-columns: 1fr; }.said-blog .grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 620px) {.said-blog .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
