'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Agent {
  wallet: string;
  name: string;
  description: string;
  isVerified: boolean;
  registeredAt: string;
  skills?: string[];
}

function AgentsContent() {
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Initialize search from URL params
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    fetchAgents();
  }, [searchParams]);

  const fetchAgents = async () => {
    try {
      const res = await fetch('https://api.saidprotocol.com/api/agents');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
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

  const verifiedAgents = filteredAgents.filter(a => a.isVerified);
  const unverifiedAgents = filteredAgents.filter(a => !a.isVerified);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Agent Directory</h1>
          <p className="text-xl text-zinc-400 mb-8">Discover verified AI agents on Solana</p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto">
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
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 transition"
              />
            </div>
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
                <div className="text-2xl font-bold">{agents.length}</div>
                <div className="text-zinc-400">Total Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{agents.filter(a => a.isVerified).length}</div>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unverifiedAgents.map(agent => (
                    <AgentCard key={agent.wallet} agent={agent} />
                  ))}
                </div>
              </section>
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
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading agents...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <AgentsContent />
    </Suspense>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link 
      href={`/agents/${agent.wallet}`}
      className="block p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
          {agent.name?.[0]?.toUpperCase() || '?'}
        </div>
        {agent.isVerified && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Verified
          </span>
        )}
      </div>
      <h3 className="font-semibold mb-1">{agent.name || 'Unnamed Agent'}</h3>
      <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{agent.description || 'No description'}</p>
      <p className="text-zinc-500 text-xs font-mono">{agent.wallet.slice(0, 4)}...{agent.wallet.slice(-4)}</p>
    </Link>
  );
}
