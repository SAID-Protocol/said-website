'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import CtaDots from '@/components/said/CtaDots';
import ShimmerDots from '@/components/said/ShimmerDots';
import AgentAvatar from '@/components/said/AgentAvatar';
import Link from 'next/link';

const PAGE_SIZE = 50;

interface Agent {
  wallet: string;
  name?: string;
  description?: string;
  image?: string;
  isVerified?: boolean;
  registeredAt?: string;
  activityCount?: number;
  feedbackCount?: number;
  skills?: string[];
  reputationScore?: number;
  trustScore?: { score?: number; tier?: string };
}

type SortBy = 'reputation' | 'newest' | 'active';

const score = (a: Agent) => a.trustScore?.score ?? a.reputationScore ?? 0;

// Champion-card footer stat: prefer actions, fall back to on-chain feedback
// signals, show nothing when both are zero ("0 ACTIONS" undercuts the card).
const champStat = (a: Agent): string | null => {
  const n = (v: number, word: string) =>
    `${v.toLocaleString('en-US')} ${word}${v === 1 ? '' : 'S'}`;
  if (a.activityCount) return n(a.activityCount, 'ACTION');
  if (a.feedbackCount) return n(a.feedbackCount, 'SIGNAL');
  return null;
};
const tier = (a: Agent) => (a.trustScore?.tier || 'unranked').toUpperCase();
const initials = (a: Agent) =>
  (a.name || a.wallet).split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
const shortWallet = (w: string) => `${w.slice(0, 4)}…${w.slice(-4)}`;

function DirectoryInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';
  const initialSortRaw = searchParams.get('sort');
  const initialSort: SortBy =
    initialSortRaw === 'newest' || initialSortRaw === 'active' ? initialSortRaw : 'reputation';

  const [agents, setAgents] = useState<Agent[]>([]);
  const [top3, setTop3] = useState<Agent[]>([]);
  const [stats, setStats] = useState<{ total: number; verified: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortBy>(initialSort);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Keep the URL in sync so refresh / share-link preserves the view
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'reputation') params.set('sort', sortBy);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchQuery, sortBy, router, pathname]);

  // stats band + top-3 spotlight
  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => d?.totalAgents && setStats({ total: d.totalAgents, verified: d.verifiedAgents }))
      .catch(() => {});
    fetch('/api/agents/top?by=reputation&limit=3')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.agents?.length && setTop3(d.agents.slice(0, 3)))
      .catch(() => {});
  }, []);

  // Re-fetch from offset 0 when sort or search changes — API does both
  // server-side. Debounced so we don't fire on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      fetchAgents(0, true, sortBy, searchQuery);
    }, searchQuery ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchQuery]);

  const fetchAgents = async (
    fetchOffset: number,
    reset = false,
    sortOverride?: SortBy,
    searchOverride?: string,
  ) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const effectiveSort = sortOverride ?? sortBy;
      const effectiveSearch = (searchOverride ?? searchQuery).trim();

      // "Top reputation" (no search) → the v0.8-ranked leaderboard endpoint,
      // falling back to the directory endpoint on any failure.
      if (effectiveSort === 'reputation' && !effectiveSearch) {
        try {
          const topRes = await fetch('/api/agents/top?by=reputation&limit=100');
          if (topRes.ok) {
            const topData = await topRes.json();
            const topAgents = topData.agents || [];
            if (topAgents.length > 0) {
              setAgents(topAgents);
              setOffset(topAgents.length);
              setHasMore(false);
              return;
            }
          }
        } catch (e) {
          console.error('Top agents fetch failed, falling back to directory:', e);
        }
      }

      const params = new URLSearchParams();
      params.set('limit', String(PAGE_SIZE));
      params.set('offset', String(fetchOffset));
      if (effectiveSort === 'newest') params.set('sort', 'newest');
      if (effectiveSort === 'active') params.set('sort', 'active');
      if (effectiveSearch) params.set('search', effectiveSearch);

      const res = await fetch(`/api/agents?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const newAgents = data.agents || [];
        setAgents((prev) => (reset ? newAgents : [...prev, ...newAgents]));
        setOffset(fetchOffset + newAgents.length);
        setHasMore(newAgents.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const q = searchQuery.toLowerCase();
  const shown = agents.filter(
    (a) =>
      a.name?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.wallet.toLowerCase().includes(q) ||
      a.skills?.some((s) => s.toLowerCase().includes(q)),
  );

  const MEDALS = ['01', '02', '03'];

  return (
    <div className="said-page said-dir">

      <div className="hero">
        <div className="kick">THE REGISTRY · LIVE ON SOLANA</div>
        <h1>Agent Directory</h1>
        <p className="lede">
          Every registered agent, its verification status, and its reputation. Earned
          on-chain, visible to anyone.
        </p>
      </div>

      <div className="dstats">
        <div className="stat"><div className="n">{stats ? stats.total.toLocaleString('en-US') : '—'}</div><div className="l">AGENTS</div></div>
        <div className="stat"><div className="n">{stats ? stats.verified.toLocaleString('en-US') : '—'}</div><div className="l">VERIFIED</div></div>
        <div className="stat"><div className="n">10</div><div className="l">CHAINS</div></div>
        <div className="stat"><div className="n">0.001<span style={{ color: 'var(--faint)' }}> USDC</span></div><div className="l">PER TRUST SCREEN</div></div>
      </div>

      <DotSeam style={{ marginTop: 'clamp(24px,3vh,36px)' }} />

      {top3.length === 3 && (
        <>
          <div className="sect" style={{ paddingBottom: 0, paddingTop: 0 }}>
            <div className="no mono rv">MOST TRUSTED · EARNED ON-CHAIN</div>
          </div>
          <div className="top3">
            {top3.map((a, i) => (
              <div key={a.wallet} className={`champ rv t-${tier(a).toLowerCase()}${i === 0 ? ' first' : ''}`}>
                {i === 0 && (<><ShimmerDots inverted /><span className="crown">+</span></>)}
                <span className="medal mono">{MEDALS[i]} · {tier(a)}</span>
                <h4>{a.name || shortWallet(a.wallet)}{a.isVerified && <span className="vbadge">✓</span>}</h4>
                <p className="desc">{a.description || 'Registered agent on the SAID registry.'}</p>
                <div className="foot">
                  <span className="sc"><span className="scn">{score(a).toFixed(1)}</span><i>/ 100</i></span>
                  {champStat(a) && <span className="tierl mono">{champStat(a)}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="tools">
        <div className="search">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="6.5" cy="6.5" r="5" /><line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or wallet"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="tabs">
          {(
            [['reputation', 'Top reputation'], ['newest', 'Newest'], ['active', 'Most active']] as Array<[SortBy, string]>
          ).map(([key, label]) => (
            <button key={key} className={`tab${sortBy === key ? ' on' : ''}`} onClick={() => setSortBy(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="list">
        <div className="thead">
          <span>#</span><span></span><span>AGENT</span><span>DESCRIPTION</span><span>WALLET</span><span>TRUST</span><span>TIER</span><span style={{ textAlign: 'right' }}>ACTIONS</span>
        </div>
        <div>
          {loading ? (
            <div className="empty mono">LOADING THE REGISTRY…</div>
          ) : shown.length === 0 ? (
            <div className="empty mono">NO AGENTS MATCH THAT SEARCH.</div>
          ) : (
            shown.map((a, i) => (
              <Link href={`/agents/${a.wallet}`} key={a.wallet} className="row">
                <span className="rank mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="av">
                  <AgentAvatar wallet={a.wallet} image={a.image} name={a.name} />
                </span>
                <span className="name"><span>{a.name || shortWallet(a.wallet)}</span>{a.isVerified && <span className="vbadge">✓</span>}</span>
                <span className="desc">{a.description || ''}</span>
                <span className="wallet">{shortWallet(a.wallet)}</span>
                <span className="meterrow">
                  <span className="meter"><i style={{ width: `${Math.min(100, score(a))}%` }} /></span>
                  <span className="score">{score(a).toFixed(1)}</span>
                </span>
                <span className="tierchip">{tier(a)}</span>
                <span className="acts mono">{(a.activityCount ?? 0).toLocaleString('en-US')}</span>
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="count">
        {!loading && `${shown.length.toLocaleString('en-US')} AGENTS SHOWN`}
      </div>
      {hasMore && !loading && (
        <div style={{ maxWidth: 1280, margin: '26px auto 0', padding: '0 clamp(20px,4vw,48px)' }}>
          <button className="btn" onClick={() => fetchAgents(offset, false)} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      <div className="ctawrap">
        <div className="ctaCard">
          <CtaDots />
          <span className="plus tl">+</span><span className="plus tr">+</span>
          <span className="plus bl">+</span><span className="plus br">+</span>
          <h2>Get listed.</h2>
          <p>Registration is free and takes one command. Verification is 0.01 SOL, once.</p>
          <div className="ctas">
            <Link className="btn fill" href="/create-agent">Register an agent</Link>
            <Link className="btn" href="/docs">Read the docs</Link>
          </div>
        </div>
      </div>

      <SaidFooter />

      <style>{`
        .said-dir .tools{max-width:1280px;margin:clamp(28px,4vh,40px) auto 0;padding:0 clamp(20px,4vw,48px);display:flex;gap:12px;flex-wrap:wrap;align-items:center}
        .said-dir .search{flex:1;min-width:220px;position:relative}
        .said-dir .search input{padding-left:42px;border-radius:99px}
        .said-dir .search svg{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--faint)}
        .said-dir .tabs{display:flex;gap:8px}
        .said-dir .tab{padding:10px 18px;border-radius:99px;border:1px solid var(--line);background:none;color:var(--dim);font-size:13px;font-family:inherit;cursor:pointer}
        .said-dir .tab:hover{border-color:var(--ink);color:var(--ink)}
        .said-dir .tab.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
        .said-dir .list{max-width:1280px;margin:clamp(20px,3vh,32px) auto 0;padding:0 clamp(20px,4vw,48px)}
        .said-dir .dstats{max-width:1280px;margin:clamp(28px,4vh,40px) auto 0;padding:0 clamp(20px,4vw,48px);display:grid;grid-template-columns:repeat(4,1fr)}
        .said-dir .dstats .stat{padding:0 26px;border-left:1px solid var(--line)}
        .said-dir .dstats .stat:first-child{border-left:0;padding-left:0}
        .said-dir .dstats .n{font-size:clamp(24px,2.8vw,38px);font-weight:500;letter-spacing:-.03em}
        .said-dir .dstats .l{margin-top:6px;font-size:11px;letter-spacing:.16em;color:var(--faint)}
        .said-dir .top3{max-width:1280px;margin:clamp(24px,3vh,36px) auto 0;padding:0 clamp(20px,4vw,48px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .said-dir .champ{position:relative;border-radius:24px;padding:30px 28px 26px;overflow:hidden;border:1px solid var(--line);background:var(--card);display:flex;flex-direction:column}
        .said-dir .champ.first{background:var(--ink);color:var(--bg);border-color:var(--ink)}
        .said-dir .champ canvas{position:absolute;inset:0;width:100%;height:100%}
        .said-dir .champ>*:not(canvas){position:relative}
        .said-dir .champ .medal{font-size:11px;letter-spacing:.18em;color:var(--faint)}
        .said-dir .champ.first .medal{color:inherit;opacity:.55}
        .said-dir .champ .crown{position:absolute;top:24px;right:26px;font-size:20px;font-weight:300;opacity:.4;font-family:Helvetica,sans-serif}
        .said-dir .champ h4{margin-top:16px;font-size:clamp(18px,1.8vw,22px);font-weight:600;letter-spacing:-.01em;display:flex;align-items:center;gap:9px}
        .said-dir .champ.first .vbadge{background:var(--bg);color:var(--ink)}
        .said-dir .champ .desc{margin-top:8px;margin-bottom:22px;font-size:13px;line-height:1.6;color:var(--dim);min-height:42px;max-width:34ch}
        .said-dir .champ.first .desc{color:inherit;opacity:.6}
        .said-dir .champ .foot{margin-top:auto;padding-top:16px;border-top:1px solid var(--line);display:flex;align-items:baseline;justify-content:space-between}
        .said-dir .champ.first .foot{border-top-color:rgba(128,128,128,.35)}
        /* tier aura — glow color per tier, resolved against the card's
           effective background (first card inverts, themes flip both) */
        .said-dir .champ{--glow:var(--glow-l)}
        html[data-theme="dark"] .said-dir .champ{--glow:var(--glow-d)}
        .said-dir .champ.first{--glow:var(--glow-d)}
        html[data-theme="dark"] .said-dir .champ.first{--glow:var(--glow-l)}
        .said-dir .champ.t-platinum{--glow-l:hsla(252,78%,54%,.46);--glow-d:hsla(252,85%,72%,.42)}
        .said-dir .champ.t-gold{--glow-l:hsla(42,85%,45%,.38);--glow-d:hsla(45,90%,62%,.42)}
        .said-dir .champ.t-silver{--glow-l:hsla(214,32%,48%,.3);--glow-d:hsla(214,45%,76%,.36)}
        .said-dir .champ.t-bronze{--glow-l:hsla(24,75%,42%,.32);--glow-d:hsla(26,80%,60%,.4)}
        .said-dir .champ.t-unranked{--glow-l:transparent;--glow-d:transparent}
        .said-dir .champ .sc{font-size:clamp(24px,2.4vw,32px);font-weight:500;letter-spacing:-.03em}
        .said-dir .champ .scn{position:relative;z-index:0;display:inline-block}
        .said-dir .champ .scn::before{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:150px;height:92px;border-radius:50%;background:radial-gradient(closest-side,var(--glow),transparent 72%);filter:blur(12px);pointer-events:none;z-index:-1;animation:auraPulse 3.6s ease-in-out infinite}
        @keyframes auraPulse{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.14)}}
        .said-dir .champ .sc i{font-style:normal;font-size:12px;font-weight:400;color:var(--faint);margin-left:4px;letter-spacing:0}
        .said-dir .champ.first .sc i{color:inherit;opacity:.5}
        .said-dir .champ .tierl{font-size:11px;letter-spacing:.16em;color:var(--faint)}
        .said-dir .champ.first .tierl{color:inherit;opacity:.55}
        .said-dir .thead,.said-dir .row{display:grid;grid-template-columns:44px 44px 1.7fr 1.2fr 1fr .8fr .8fr .7fr;gap:14px;align-items:center;padding:14px 18px}
        .said-dir .thead{font-size:10.5px;letter-spacing:.16em;color:var(--faint);border-bottom:1px solid var(--line)}
        .said-dir .row{border-bottom:1px solid var(--line);font-size:14px}
        .said-dir .row:hover{background:var(--card)}
        .said-dir .row .av{width:34px;height:34px;border-radius:50%;background:var(--card);border:1px solid var(--line);color:var(--ink);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;overflow:hidden}
        .said-dir .row .desc{font-size:12.5px;color:var(--dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .said-dir .row .meterrow{display:flex;align-items:center;gap:8px}
        .said-dir .row .meter{flex:1;max-width:64px;height:3px;background:var(--line);border-radius:2px;overflow:hidden}
        .said-dir .row .meter i{display:block;height:100%;background:var(--ink);border-radius:2px}
        .said-dir .row .rank{font-size:12px;color:var(--faint)}
        .said-dir .row .name{font-weight:600;display:flex;align-items:center;gap:8px;min-width:0}
        .said-dir .row .name span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .said-dir .vbadge{flex:none;width:15px;height:15px;border-radius:50%;background:var(--ink);color:var(--bg);display:inline-flex;align-items:center;justify-content:center;font-size:9px}
        .said-dir .row .wallet{font-size:12px;color:var(--faint);font-family:ui-monospace,"SF Mono",Menlo,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .said-dir .row .score{font-weight:500}
        .said-dir .tierchip{font-size:11px;letter-spacing:.1em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:4px 12px;text-align:center;white-space:nowrap;justify-self:start}
        .said-dir .row .acts{font-size:12.5px;color:var(--dim);text-align:right}
        .said-dir .count{max-width:1280px;margin:14px auto 0;padding:0 clamp(20px,4vw,48px);font-size:12px;color:var(--faint);letter-spacing:.06em}
        .said-dir .empty{padding:40px 18px;font-size:12px;letter-spacing:.1em;color:var(--faint)}
        @media (max-width:860px){
          .said-dir .thead{display:none}
          .said-dir .row{grid-template-columns:44px 1fr auto;gap:10px}
          .said-dir .row .rank,.said-dir .row .wallet,.said-dir .row .acts,.said-dir .row .desc,.said-dir .row .meterrow{display:none}
          .said-dir .top3{grid-template-columns:1fr}
          .said-dir .dstats{grid-template-columns:1fr 1fr;gap:18px 0}
          .said-dir .dstats .stat{padding:0 18px}
          .said-dir .dstats .stat:nth-child(odd){border-left:0;padding-left:0}
        }
      `}</style>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={null}>
      <DirectoryInner />
    </Suspense>
  );
}
