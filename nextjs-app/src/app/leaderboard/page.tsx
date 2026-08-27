'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import ShimmerDots from '@/components/said/ShimmerDots';

interface TrustScore {
  score: number;
  tier: string;
  sources?: string[];
}

interface Agent {
  wallet: string;
  name: string;
  description: string;
  isVerified: boolean;
  registeredAt: string;
  skills?: string[];
  reputationScore?: number;
  feedbackCount?: number;
  trustScore?: TrustScore | null;
}

type SortKey = 'trust' | 'reputation' | 'feedback';

const PAGE_SIZE = 100;
const VISIBLE_STEP = 25;

// Tier accents — same values as the directory champion auras and the
// agent-profile gauge, so a tier looks the same everywhere on the site.
const TIER_SOLID: Record<string, string> = {
  platinum: '#a78bfa',
  gold: '#d9a514',
  silver: '#8fa3bb',
  bronze: '#c2703d',
  unverified: '#8a8a8a',
};

const shortWallet = (w: string) => `${w.slice(0, 4)}…${w.slice(-4)}`;

function sortValue(agent: Agent, sortKey: SortKey): string {
  if (sortKey === 'trust') return String(agent.trustScore?.score ?? 0);
  if (sortKey === 'reputation') return agent.reputationScore?.toFixed(1) ?? '0';
  return String(agent.feedbackCount ?? 0);
}

function sortLabel(sortKey: SortKey): string {
  if (sortKey === 'trust') return 'TRUST';
  if (sortKey === 'reputation') return 'REPUTATION';
  return 'FEEDBACK';
}

export default function LeaderboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('trust');
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP);

  useEffect(() => {
    fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPage(fetchOffset: number, reset: boolean) {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);
      const res = await fetch(`/api/agents?limit=${PAGE_SIZE}&offset=${fetchOffset}`);
      if (!res.ok) return;
      const data = await res.json();
      const list: Agent[] = data.agents || [];
      setAgents((prev) => (reset ? list : [...prev, ...list]));
      setOffset(fetchOffset + list.length);
      setHasMore(list.length === PAGE_SIZE);
    } catch (err) {
      console.error('[leaderboard] fetch failed:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const ranked = useMemo(() => {
    const sortFn: Record<SortKey, (a: Agent, b: Agent) => number> = {
      trust: (a, b) => (b.trustScore?.score ?? 0) - (a.trustScore?.score ?? 0),
      reputation: (a, b) => (b.reputationScore ?? 0) - (a.reputationScore ?? 0),
      feedback: (a, b) => (b.feedbackCount ?? 0) - (a.feedbackCount ?? 0),
    };
    // Unscored agents aren't ranked on the trust sort
    const filtered =
      sortKey === 'trust' ? agents.filter((a) => (a.trustScore?.score ?? 0) > 0) : agents;
    return [...filtered].sort(sortFn[sortKey]);
  }, [agents, sortKey]);

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3, visibleCount);

  return (
    <div className="said-page said-lb">
      <div className="hero">
        <div className="kick">RANKED BY ON-CHAIN REPUTATION</div>
        <h1>Leaderboard</h1>
        <p className="lede">The most trusted AI agents on SAID, ranked by what they&apos;ve actually done.</p>
      </div>

      <div className="tools">
        <div className="tabs">
          {([['trust', 'Trust score'], ['reputation', 'Reputation'], ['feedback', 'Feedback']] as Array<[SortKey, string]>).map(
            ([key, label]) => (
              <button key={key} className={`tab${sortKey === key ? ' on' : ''}`} onClick={() => setSortKey(key)}>
                {label}
              </button>
            )
          )}
        </div>
        {!loading && ranked.length > 0 && (
          <span className="count mono">{ranked.length.toLocaleString('en-US')} RANKED</span>
        )}
      </div>

      <DotSeam style={{ marginTop: 'clamp(20px,3vh,30px)' }} />

      <div className="lbwrap">
        {loading ? (
          <p className="empty mono">LOADING THE LEADERBOARD…</p>
        ) : ranked.length === 0 ? (
          <p className="empty mono">NO AGENTS TO RANK YET.</p>
        ) : (
          <>
            {podium.length > 0 && (
              <div className="podium">
                {podium.map((a, i) => {
                  const tier = a.trustScore?.tier ?? 'unverified';
                  const color = TIER_SOLID[tier] ?? TIER_SOLID.unverified;
                  return (
                    <Link
                      key={a.wallet}
                      href={`/agents/${a.wallet}`}
                      className={`pcard${i === 0 ? ' first' : ''}`}
                      style={{ ['--tier' as string]: color }}
                    >
                      {i === 0 && <ShimmerDots inverted />}
                      <span className="prank mono">{String(i + 1).padStart(2, '0')} · {tier.toUpperCase()}</span>
                      <span className="pname">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://api.saidprotocol.com/api/avatar/${a.wallet}.svg`} alt="" />
                        <span className="pnametext">
                          <b>{a.name || 'Unnamed Agent'}</b>
                          <i className="mono">{shortWallet(a.wallet)}</i>
                        </span>
                        {a.isVerified && <span className="vbadge">✓</span>}
                      </span>
                      <span className="pfoot">
                        <span className="pscore">{sortValue(a, sortKey)}</span>
                        <span className="plabel mono">{sortLabel(sortKey)}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {rest.length > 0 && (
              <div className="rows">
                {rest.map((a, i) => {
                  const tier = a.trustScore?.tier ?? 'unverified';
                  const scored = (a.trustScore?.score ?? 0) > 0;
                  return (
                    <Link key={a.wallet} href={`/agents/${a.wallet}`} className="row">
                      <span className="rank mono">{String(i + 4).padStart(2, '0')}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="av" src={`https://api.saidprotocol.com/api/avatar/${a.wallet}.svg`} alt="" />
                      <span className="name">
                        <span>{a.name || 'Unnamed Agent'}</span>
                        {a.isVerified && <span className="vbadge">✓</span>}
                      </span>
                      <span className="wallet mono">{shortWallet(a.wallet)}</span>
                      <span className="tierchip" style={{ ['--tier' as string]: TIER_SOLID[tier] }}>
                        {scored ? tier.toUpperCase() : '—'}
                      </span>
                      <span className="val">
                        <b>{sortValue(a, sortKey)}</b>
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="more">
              {visibleCount < ranked.length && (
                <button className="btn" onClick={() => setVisibleCount((c) => c + VISIBLE_STEP)}>Show more</button>
              )}
              {hasMore && (
                <button className="btn" onClick={() => fetchPage(offset, false)} disabled={loadingMore}>
                  {loadingMore ? 'Loading…' : `Load more (${agents.length} loaded)`}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <SaidFooter />

      <style>{`
        .said-lb .tools{max-width:1000px;margin:clamp(24px,4vh,36px) auto 0;padding:0 clamp(20px,4vw,48px);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .said-lb .tabs{display:flex;gap:8px;flex-wrap:wrap}
        .said-lb .tab{padding:10px 18px;border-radius:99px;border:1px solid var(--line);background:none;color:var(--dim);font-size:13px;font-family:inherit;cursor:pointer}
        .said-lb .tab:hover{border-color:var(--ink);color:var(--ink)}
        .said-lb .tab.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
        .said-lb .count{font-size:11px;letter-spacing:.14em;color:var(--faint)}
        .said-lb .lbwrap{max-width:1000px;margin:0 auto;padding:clamp(20px,3vh,30px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
        .said-lb .empty{padding:60px 0;text-align:center;font-size:12px;letter-spacing:.12em;color:var(--faint)}

        .said-lb .podium{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:clamp(20px,3vh,30px)}
        .said-lb .pcard{position:relative;overflow:hidden;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:20px;padding:22px 22px 20px;background:var(--card);transition:border-color .3s}
        .said-lb .pcard>*:not(canvas){position:relative}
        .said-lb .pcard:hover{border-color:var(--ink)}
        .said-lb .pcard.first{background:var(--ink);color:var(--bg);border-color:var(--ink)}
        .said-lb .prank{font-size:10px;letter-spacing:.16em;color:var(--tier)}
        .said-lb .pname{display:flex;align-items:center;gap:11px;margin-top:16px}
        .said-lb .pname img{width:38px;height:38px;border-radius:11px;flex:none;background:var(--bg)}
        .said-lb .pnametext{display:flex;flex-direction:column;min-width:0}
        .said-lb .pnametext b{font-size:15px;font-weight:600;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .said-lb .pnametext i{font-style:normal;font-size:11px;color:var(--faint);margin-top:2px}
        .said-lb .pcard.first .pnametext i{color:inherit;opacity:.55}
        .said-lb .pfoot{display:flex;align-items:baseline;justify-content:space-between;margin-top:20px;padding-top:16px;border-top:1px solid var(--line)}
        .said-lb .pcard.first .pfoot{border-top-color:rgba(128,128,128,.35)}
        .said-lb .pscore{font-size:clamp(24px,2.6vw,32px);font-weight:500;letter-spacing:-.03em}
        .said-lb .plabel{font-size:9.5px;letter-spacing:.14em;color:var(--faint)}
        .said-lb .pcard.first .plabel{color:inherit;opacity:.55}
        .said-lb .vbadge{flex:none;width:15px;height:15px;border-radius:50%;background:var(--ink);color:var(--bg);display:inline-flex;align-items:center;justify-content:center;font-size:9px}
        .said-lb .pcard.first .vbadge{background:var(--bg);color:var(--ink)}

        .said-lb .rows{border:1px solid var(--line);border-radius:16px;overflow:hidden}
        .said-lb .row{display:grid;grid-template-columns:44px 34px 1.6fr 1fr .8fr .6fr;gap:14px;align-items:center;padding:12px 18px;border-top:1px solid var(--line);font-size:14px}
        .said-lb .row:first-child{border-top:0}
        .said-lb .row:hover{background:var(--card)}
        .said-lb .row .rank{font-size:12px;color:var(--faint)}
        .said-lb .row .av{width:30px;height:30px;border-radius:9px;background:var(--card)}
        .said-lb .row .name{display:flex;align-items:center;gap:8px;min-width:0;font-weight:500}
        .said-lb .row .name span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .said-lb .row .wallet{font-size:12px;color:var(--faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .said-lb .tierchip{font-size:9.5px;letter-spacing:.1em;color:var(--tier,var(--dim));border:1px solid var(--line);border-radius:99px;padding:4px 10px;text-align:center;justify-self:start;white-space:nowrap}
        .said-lb .row .val{text-align:right;font-variant-numeric:tabular-nums}
        .said-lb .row .val b{font-size:15px;font-weight:600}
        .said-lb .more{display:flex;gap:10px;justify-content:center;margin-top:26px;flex-wrap:wrap}
        .said-lb .more .btn:disabled{opacity:.5;cursor:default}

        @media (max-width:860px){
          .said-lb .podium{grid-template-columns:1fr}
          .said-lb .row{grid-template-columns:34px 30px 1fr auto;gap:10px}
          .said-lb .row .wallet,.said-lb .row .tierchip{display:none}
        }
      `}</style>
    </div>
  );
}
