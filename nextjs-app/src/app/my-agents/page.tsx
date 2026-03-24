'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AsciiBackground from '@/components/AsciiBackground';
import { useAuth } from '@/hooks/useAuth';

interface Agent {
  id: string;
  wallet: string;
  name: string;
  description?: string;
  isVerified: boolean;
  twitter?: string;
}

export default function MyAgentsPage() {
  const { authenticated, login } = usePrivy();
  const { sessionToken, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionToken) {
      fetchMyAgents();
    } else {
      setLoading(false);
    }
  }, [sessionToken]);

  const fetchMyAgents = async () => {
    if (!sessionToken) return;
    
    try {
      const res = await fetch('https://api.saidprotocol.com/users/me/agents', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (!res.ok) throw new Error('Failed to fetch agents');
      
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
      <AsciiBackground />
        <div className="max-w-xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 text-center relative z-10">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your agents</h1>
          <button
            onClick={login}
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
      <AsciiBackground />
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 relative z-10">
          <div className="text-center py-16">
            <div className="text-zinc-400">Loading your agents...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <AsciiBackground />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Agents</h1>
          <Link
            href="/create-agent"
            className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            + Create Agent
          </Link>
        </div>
        
        {agents.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
            <p className="text-zinc-400 mb-6">Register your first agent to get started</p>
            <Link
              href="/create-agent"
              className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              Create Agent
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {agent.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{agent.name}</h3>
                        {agent.isVerified && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 font-mono text-sm">
                        {agent.wallet.substring(0, 8)}...{agent.wallet.substring(agent.wallet.length - 8)}
                      </p>
                      {agent.description && (
                        <p className="text-zinc-400 text-sm mt-1">{agent.description}</p>
                      )}
                    </div>
                  </div>
                  {agent.twitter && (
                    <a
                      href={`https://twitter.com/${agent.twitter.replace('@', '')}`}
                      target="_blank"
                      className="text-zinc-400 hover:text-white transition"
                    >
                      @{agent.twitter.replace('@', '')}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
