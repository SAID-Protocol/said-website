'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PreviewAgent {
  wallet: string;
  name: string;
  isVerified: boolean;
  trustScore: number;
  tier: string;
  rank: number;
}

const TIER_CLASSES: Record<string, string> = {
  platinum: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  gold: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  silver: 'bg-zinc-400/10 text-zinc-200 border-zinc-400/30',
  bronze: 'bg-orange-600/10 text-orange-300 border-orange-600/30',
  unranked: 'bg-zinc-700/10 text-zinc-500 border-zinc-700/30',
  unverified: 'bg-zinc-700/10 text-zinc-500 border-zinc-700/30',
};

function tierLabel(tier: string): string {
  if (!tier) return 'Unranked';
  if (tier === 'unverified') return 'Unranked';
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function shortWallet(wallet: string): string {
  if (wallet.length <= 10) return wallet;
  return `${wallet.slice(0, 4)}…${wallet.slice(-4)}`;
}

export default function LeaderboardPreview() {
  const [agents, setAgents] = useState<PreviewAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/leaderboard-preview');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setAgents(data.leaderboard || []);
      } catch {
        // leave empty — section will quietly degrade
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && agents.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Most Trusted Agents</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Reputation is earned on-chain. Here&apos;s who&apos;s leading right now.
          </p>
        </div>

        <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl overflow-hidden">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 ${i < 4 ? 'border-b border-zinc-800/60' : ''}`}
                >
                  <div className="w-6 h-6 rounded bg-zinc-800/60 animate-pulse" />
                  <div className="flex-1 h-4 rounded bg-zinc-800/60 animate-pulse" />
                  <div className="w-16 h-5 rounded-full bg-zinc-800/60 animate-pulse" />
                </div>
              ))
            : agents.map((agent, idx) => {
                const tierClasses = TIER_CLASSES[agent.tier] ?? TIER_CLASSES.unranked;
                return (
                  <Link
                    key={agent.wallet}
                    href={`/agent/${agent.wallet}`}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-zinc-900/40 transition ${
                      idx < agents.length - 1 ? 'border-b border-zinc-800/60' : ''
                    }`}
                  >
                    <div className="w-6 text-sm font-mono text-zinc-500">#{agent.rank}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{agent.name || shortWallet(agent.wallet)}</span>
                        {agent.isVerified && (
                          <span className="text-emerald-400 text-xs" title="Verified">✓</span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{shortWallet(agent.wallet)}</div>
                    </div>
                    <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${tierClasses}`}>
                      {tierLabel(agent.tier)}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white tabular-nums">
                        {agent.trustScore.toFixed(0)}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Trust</div>
                    </div>
                  </Link>
                );
              })}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/leaderboard"
            className="inline-block px-5 py-2.5 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition"
          >
            View full leaderboard →
          </Link>
        </div>
      </div>
    </section>
  );
}
