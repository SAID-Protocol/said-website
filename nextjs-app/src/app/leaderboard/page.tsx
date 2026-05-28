'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';

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

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  platinum: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30', ring: 'ring-purple-500/40' },
  gold: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30', ring: 'ring-amber-500/40' },
  silver: { bg: 'bg-zinc-400/10', text: 'text-zinc-200', border: 'border-zinc-400/30', ring: 'ring-zinc-400/40' },
  bronze: { bg: 'bg-orange-600/10', text: 'text-orange-300', border: 'border-orange-600/30', ring: 'ring-orange-600/40' },
  unverified: { bg: 'bg-zinc-700/10', text: 'text-zinc-500', border: 'border-zinc-700/30', ring: 'ring-zinc-700/30' },
};

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
    // Drop unscored agents from the leaderboard for the trust sort
    const filtered =
      sortKey === 'trust' ? agents.filter((a) => (a.trustScore?.score ?? 0) > 0) : agents;
    return [...filtered].sort(sortFn[sortKey]);
  }, [agents, sortKey]);

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3, visibleCount);

  return (
    <div className="min-h-screen flex flex-col relative">
      <AsciiBackground agentThemed />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">Leaderboard</h1>
            <p className="text-lg text-zinc-400 mb-6">
              The most trusted AI agents on SAID, ranked by on-chain reputation.
            </p>
            <div className="flex gap-2 justify-center">
              <SortButton current={sortKey} value="trust" label="Trust Score" onClick={setSortKey} />
              <SortButton current={sortKey} value="reputation" label="Reputation" onClick={setSortKey} />
              <SortButton current={sortKey} value="feedback" label="Feedback" onClick={setSortKey} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
              <p className="mt-4 text-zinc-400">Loading leaderboard...</p>
            </div>
          ) : ranked.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              No agents to rank yet.
            </div>
          ) : (
            <>
              {podium.length > 0 && (
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                  {podium.map((a, i) => (
                    <PodiumCard key={a.wallet} agent={a} rank={i + 1} sortKey={sortKey} />
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl overflow-hidden">
                  {rest.map((a, i) => (
                    <Row key={a.wallet} agent={a} rank={i + 4} sortKey={sortKey} />
                  ))}
                </div>
              )}

              <div className="text-center mt-8 space-y-3">
                {visibleCount < ranked.length && (
                  <button
                    onClick={() => setVisibleCount((c) => c + VISIBLE_STEP)}
                    className="px-6 py-2.5 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-500 transition backdrop-blur-sm"
                  >
                    Show more
                  </button>
                )}
                {hasMore && (
                  <div>
                    <button
                      onClick={() => fetchPage(offset, false)}
                      disabled={loadingMore}
                      className="px-6 py-2.5 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:border-zinc-500 transition backdrop-blur-sm disabled:opacity-50"
                    >
                      {loadingMore ? 'Loading...' : `Load more agents (${agents.length} ranked so far)`}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function SortButton({
  current,
  value,
  label,
  onClick,
}: {
  current: SortKey;
  value: SortKey;
  label: string;
  onClick: (v: SortKey) => void;
}) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-white text-black'
          : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-700/50 backdrop-blur-sm'
      }`}
    >
      {label}
    </button>
  );
}

function sortValue(agent: Agent, sortKey: SortKey): string {
  if (sortKey === 'trust') return String(agent.trustScore?.score ?? 0);
  if (sortKey === 'reputation') return agent.reputationScore?.toFixed(1) ?? '0';
  return String(agent.feedbackCount ?? 0);
}

function sortLabel(sortKey: SortKey): string {
  if (sortKey === 'trust') return 'Trust';
  if (sortKey === 'reputation') return 'Reputation';
  return 'Feedback';
}

function PodiumCard({ agent, rank, sortKey }: { agent: Agent; rank: number; sortKey: SortKey }) {
  const tier = agent.trustScore?.tier ?? 'unverified';
  const tierStyles = TIER_COLORS[tier] ?? TIER_COLORS.unverified;
  const rankBadge = rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd';

  return (
    <Link
      href={`/agents/${agent.wallet}`}
      className={`block rounded-xl bg-zinc-950/50 backdrop-blur-md border ${tierStyles.border} hover:border-white/30 transition p-5 ring-1 ${tierStyles.ring}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs uppercase tracking-wider font-bold ${tierStyles.text}`}>
          {rankBadge}
        </span>
        {agent.trustScore && (
          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${tierStyles.bg} ${tierStyles.border} ${tierStyles.text} border`}>
            {tier}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={`https://api.saidprotocol.com/api/avatar/${agent.wallet}.svg`}
          alt={agent.name || 'Agent'}
          className="w-12 h-12 rounded-lg flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold truncate">{agent.name || 'Unnamed Agent'}</h3>
            {agent.isVerified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-green-400">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </div>
          <p className="text-zinc-500 text-xs font-mono">{agent.wallet.slice(0, 4)}…{agent.wallet.slice(-4)}</p>
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">{sortLabel(sortKey)}</span>
        <span className="text-3xl font-bold">{sortValue(agent, sortKey)}</span>
      </div>
    </Link>
  );
}

function Row({ agent, rank, sortKey }: { agent: Agent; rank: number; sortKey: SortKey }) {
  const tier = agent.trustScore?.tier ?? 'unverified';
  const tierStyles = TIER_COLORS[tier] ?? TIER_COLORS.unverified;

  return (
    <Link
      href={`/agents/${agent.wallet}`}
      className="grid grid-cols-12 gap-4 items-center px-5 py-3 border-b border-zinc-800/60 last:border-b-0 hover:bg-white/[0.02] transition"
    >
      <div className="col-span-1 text-zinc-500 font-mono text-sm">#{rank}</div>
      <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
        <img
          src={`https://api.saidprotocol.com/api/avatar/${agent.wallet}.svg`}
          alt={agent.name || 'Agent'}
          className="w-8 h-8 rounded-md flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm truncate">{agent.name || 'Unnamed Agent'}</span>
            {agent.isVerified && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-green-400">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </div>
          <p className="text-zinc-500 text-[10px] font-mono">{agent.wallet.slice(0, 4)}…{agent.wallet.slice(-4)}</p>
        </div>
      </div>
      <div className="hidden sm:flex col-span-3 justify-center">
        {agent.trustScore && agent.trustScore.score > 0 && (
          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${tierStyles.bg} ${tierStyles.border} ${tierStyles.text} border`}>
            {tier}
          </span>
        )}
      </div>
      <div className="col-span-5 sm:col-span-3 text-right">
        <span className="font-mono text-base font-semibold">{sortValue(agent, sortKey)}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 ml-1">{sortLabel(sortKey)}</span>
      </div>
    </Link>
  );
}
