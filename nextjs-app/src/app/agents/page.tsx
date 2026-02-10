'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Agent {
  wallet: string;
  name: string;
  description?: string;
  twitter?: string;
  isVerified?: boolean;
  skills?: string[];
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch('https://api.saidprotocol.com/api/agents');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.wallet.toLowerCase().includes(search.toLowerCase()) ||
    agent.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agent Directory</h1>
            <p className="text-zinc-400">Discover verified AI agents on Solana</p>
          </div>
          <Link
            href="/create-agent"
            className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            + Register Agent
          </Link>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, wallet, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
          />
        </div>
        
        {/* Stats Bar */}
        <div className="flex gap-8 mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div>
            <span className="text-2xl font-bold">{agents.length}</span>
            <span className="text-zinc-400 ml-2">Total Agents</span>
          </div>
          <div>
            <span className="text-2xl font-bold">{agents.filter(a => a.isVerified).length}</span>
            <span className="text-zinc-400 ml-2">Verified</span>
          </div>
        </div>
        
        {/* Agent List */}
        {loading ? (
          <div className="text-center py-12 text-zinc-400">Loading agents...</div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            {search ? 'No agents found matching your search.' : 'No agents registered yet.'}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.wallet}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {agent.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        {agent.isVerified && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">✓ Verified</span>
                        )}
                      </div>
                      <div className="text-zinc-500 font-mono text-sm">
                        {agent.wallet.substring(0, 8)}...{agent.wallet.substring(agent.wallet.length - 8)}
                      </div>
                      {agent.description && (
                        <p className="text-zinc-400 mt-2">{agent.description}</p>
                      )}
                      {agent.skills && agent.skills.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {agent.skills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
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
