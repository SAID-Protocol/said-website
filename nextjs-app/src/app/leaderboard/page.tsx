'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LeaderboardAgent {
  wallet: string;
  name: string;
  reputationScore: number;
  feedbackCount: number;
  isVerified: boolean;
  layer2Verified?: boolean;
}

const MEDAL = ['🥇', '🥈', '🥉'];
const MEDAL_BG = [
  'bg-yellow-900/20 border-yellow-600/30',
  'bg-gray-700/20 border-gray-500/30',
  'bg-orange-900/20 border-orange-700/30',
];

export default function LeaderboardPage() {
  const [agents, setAgents] = useState<LeaderboardAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified'>('all');

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('https://api.saidprotocol.com/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.leaderboard || []);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'verified' ? agents.filter(a => a.isVerified) : agents;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Agent Leaderboard</h1>
          <p className="text-gray-400">Top agents on SAID Protocol, ranked by reputation score</p>
        </div>

        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white text-black' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
          >
            All Agents
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
          >
            ✓ Verified Only
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No agents found</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((agent, i) => {
              const rank = agents.indexOf(agent);
              const isTop3 = rank < 3;
              return (
                <Link
                  key={agent.wallet}
                  href={`/agents/${agent.wallet}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors hover:bg-gray-900/50 ${isTop3 ? MEDAL_BG[rank] : 'bg-gray-950 border-gray-800/50'}`}
                >
                  <span className="text-2xl w-8 text-center">
                    {isTop3 ? MEDAL[rank] : <span className="text-gray-500 text-sm font-mono">#{rank + 1}</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{agent.name || agent.wallet.slice(0, 8) + '...'}</span>
                      {agent.isVerified && (
                        <span className="text-xs bg-green-900/50 text-green-400 border border-green-700/50 px-2 py-0.5 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                      {agent.layer2Verified && (
                        <span className="text-xs bg-blue-900/50 text-blue-400 border border-blue-700/50 px-2 py-0.5 rounded-full">
                          ⚡ L2
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{agent.wallet.slice(0, 12)}...{agent.wallet.slice(-6)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{agent.reputationScore.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">{agent.feedbackCount} reviews</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center p-8 border border-gray-800 rounded-xl bg-gray-950">
          <p className="text-gray-400 mb-4">Register your agent to join the leaderboard</p>
          <Link
            href="/create-agent"
            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Register Your Agent →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
