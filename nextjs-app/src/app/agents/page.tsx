'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';

interface Agent {
  wallet: string;
  name: string;
  description: string;
  isVerified: boolean;
  registeredAt: string;
  skills?: string[];
  reputationScore?: number;
  feedbackCount?: number;
  lastActivity?: string;
  registrationSource?: string | null;
}

const PAGE_SIZE = 50;

function AgentsContent() {
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'reputation' | 'newest' | 'active'>('reputation');
  const [totalAgents, setTotalAgents] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Initialize search from URL params
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    // Fetch stats for accurate counts
    fetch('https://api.saidprotocol.com/api/stats')
      .then(r => r.json())
      .then(data => {
        if (data.totalAgents) setTotalAgents(data.totalAgents);
        if (data.verifiedAgents) setVerifiedCount(data.verifiedAgents);
      })
      .catch(() => {});
    // Fetch first batch of agents
    fetchAgents(0, true);
    // Poll stats every 30s
    const interval = setInterval(() => {
      fetch('https://api.saidprotocol.com/api/stats')
        .then(r => r.json())
        .then(data => {
          if (data.totalAgents) setTotalAgents(data.totalAgents);
          if (data.verifiedAgents) setVerifiedCount(data.verifiedAgents);
        })
        .catch(() => {});
    }, 30000);
    // SSE: real-time updates when agents register
    let es: EventSource | null = null;
    try {
      es = new EventSource('https://api.saidprotocol.com/api/events');
      es.onmessage = () => {
        fetchAgents(0, true);
        fetch('https://api.saidprotocol.com/api/stats')
          .then(r => r.json())
          .then(data => {
            if (data.totalAgents) setTotalAgents(data.totalAgents);
            if (data.verifiedAgents) setVerifiedCount(data.verifiedAgents);
          })
          .catch(() => {});
      };
      es.onerror = () => { es?.close(); es = null; };
    } catch {}
    return () => { clearInterval(interval); es?.close(); };
  }, [searchParams]);

  const fetchAgents = async (fetchOffset: number, reset: boolean = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);
      
      const res = await fetch(`https://api.saidprotocol.com/api/agents?limit=${PAGE_SIZE}&offset=${fetchOffset}`);
      if (res.ok) {
        const data = await res.json();
        const newAgents = data.agents || [];
        if (reset) {
          setAgents(newAgents);
        } else {
          setAgents(prev => [...prev, ...newAgents]);
        }
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

  const loadMore = () => {
    fetchAgents(offset, false);
  };

  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.toLowerCase();
    return (
      agent.name?.toLowerCase().includes(query) ||
      agent.description?.toLowerCase().includes(query) ||
      agent.wallet.toLowerCase().includes(query) ||
      agent.skills?.some(skill => skill.toLowerCase().includes(query))
    );
  });

  // Sort agents based on selected option
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === 'reputation') {
      return (b.reputationScore || 0) - (a.reputationScore || 0);
    } else if (sortBy === 'newest') {
      return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
    } else if (sortBy === 'active') {
      const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
      const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
      return bTime - aTime;
    }
    return 0;
  });

  const verifiedAgents = sortedAgents.filter(a => a.isVerified);
  const unverifiedAgents = sortedAgents.filter(a => !a.isVerified);

  return (
    <div className="min-h-screen flex flex-col relative">
      <AsciiBackground agentThemed />
      <div className="relative z-10">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">Agent Directory</h1>
          <p className="text-xl text-zinc-400 mb-8">Discover verified AI agents on Solana</p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search agents by name, description, or wallet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:border-zinc-500 transition backdrop-blur-sm text-white placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Sort toggles */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setSortBy('reputation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${sortBy === 'reputation' ? 'bg-white text-black' : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-700/50 backdrop-blur-sm'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
              Top Reputation
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${sortBy === 'newest' ? 'bg-white text-black' : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-700/50 backdrop-blur-sm'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Newest
            </button>
            <button
              onClick={() => setSortBy('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${sortBy === 'active' ? 'bg-white text-black' : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-700/50 backdrop-blur-sm'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Most Active
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading agents...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalAgents.toLocaleString()}</div>
                <div className="text-zinc-400">Total Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{verifiedCount.toLocaleString()}</div>
                <div className="text-zinc-400">Verified</div>
              </div>
            </div>

            {/* Verified Agents */}
            {verifiedAgents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="m9 11 3 3L22 4"/>
                  </svg>
                  Verified Agents
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {verifiedAgents.map(agent => (
                    <AgentCard key={agent.wallet} agent={agent} />
                  ))}
                </div>
              </section>
            )}

            {/* All Agents */}
            {unverifiedAgents.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">All Agents</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unverifiedAgents.map(agent => (
                    <AgentCard key={agent.wallet} agent={agent} />
                  ))}
                </div>
              </section>
            )}

            {/* Load More */}
            {hasMore && !searchQuery && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:border-zinc-500 transition backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></span>
                      Loading...
                    </span>
                  ) : (
                    `Load More · ${agents.length.toLocaleString()} of ${totalAgents.toLocaleString()} shown`
                  )}
                </button>
              </div>
            )}

            {filteredAgents.length === 0 && (
              <div className="text-center py-20">
                <svg className="mx-auto mb-4 text-zinc-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <p className="text-zinc-400">No agents found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      </div>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col relative">
        <AsciiBackground agentThemed />
        <div className="relative z-10">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading agents...</p>
          </div>
        </main>
        <Footer />
        </div>
      </div>
    }>
      <AgentsContent />
    </Suspense>
  );
}

function timeAgoShort(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link 
      href={`/agents/${agent.wallet}`}
      className="group block relative overflow-hidden rounded-xl bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 hover:border-zinc-600/80 transition-all duration-300 hover:shadow-lg hover:shadow-white/[0.02] hover:-translate-y-0.5"
    >
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-5">
        {/* Header: Avatar + Name + Verified */}
        <div className="flex items-start gap-3 mb-3">
          <img 
            src={`https://api.saidprotocol.com/api/avatar/${agent.wallet}.svg`}
            alt={agent.name || 'Agent'}
            className="w-10 h-10 rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{agent.name || 'Unnamed Agent'}</h3>
              {agent.isVerified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-green-400">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </div>
            <p className="text-zinc-500 text-xs font-mono">{agent.wallet.slice(0, 4)}…{agent.wallet.slice(-4)}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-2">{agent.description || 'No description provided.'}</p>

        {/* Skills / Tags */}
        {agent.skills && agent.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {agent.skills.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-0.5 text-[10px] font-medium text-zinc-400 bg-white/5 border border-white/10 rounded-full">
                {skill}
              </span>
            ))}
            {agent.skills.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] text-zinc-500">+{agent.skills.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer: Platform + Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            {agent.registrationSource === 'spawnr' && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-full" title="Launched on Spawnr.io">
                <img src="/platforms/spawnr.png" alt="Spawnr" className="w-3.5 h-3.5 rounded-full" />
                <span className="text-zinc-400 text-[10px] font-medium">Spawnr</span>
              </div>
            )}
            {(agent.registrationSource === 'clawpump' || agent.description?.includes('clawpump.tech')) && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-full" title="Launched on Claw Pump">
                <img src="/clawpump-logo.png" alt="Claw Pump" className="w-3.5 h-3.5 rounded-full" />
                <span className="text-zinc-400 text-[10px] font-medium">Claw Pump</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
            {agent.reputationScore != null && agent.reputationScore > 0 && (
              <div className="flex items-center gap-1" title="Reputation Score">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                {agent.reputationScore}
              </div>
            )}
            {agent.registeredAt && (
              <span title={new Date(agent.registeredAt).toLocaleDateString()}>
                {timeAgoShort(agent.registeredAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
