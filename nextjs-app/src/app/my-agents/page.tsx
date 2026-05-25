'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AsciiBackground from '@/components/AsciiBackground';
import { useAuth } from '@/hooks/useAuth';

type AgentSource = 'hosted' | 'protocol';

interface Agent {
  id: string;
  wallet: string;
  name: string;
  description?: string;
  isVerified: boolean;
  twitter?: string;
  gatewayToken?: string;
  source: AgentSource;
  hasApiKey?: boolean;
}

export default function MyAgentsPage() {
  const { authenticated, login } = usePrivy();
  const { sessionToken, privyAccessToken, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [showKeyForId, setShowKeyForId] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const fetchApiKey = async (agentId: string) => {
    if (apiKeys[agentId] || !sessionToken) return;
    try {
      const res = await fetch(`https://app.saidprotocol.com/api/agents/${agentId}/api-key`, {
        headers: { 'x-api-key': sessionToken },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.gatewayToken) {
          setApiKeys(prev => ({ ...prev, [agentId]: data.gatewayToken }));
        }
      }
    } catch (err) {
      console.error('[fetchApiKey] Error', err);
    }
  };

  const generateWallet = async (agentId: string) => {
    if (!privyAccessToken) return;
    try {
      const privyToken = await privyAccessToken();
      const res = await fetch(`https://app.saidprotocol.com/api/wallet/agents/${agentId}/provision-wallet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${privyToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.apiKey) {
          setApiKeys(prev => ({ ...prev, [agentId]: data.apiKey }));
          setShowKeyForId(agentId);
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to generate wallet');
      }
    } catch (err) {
      console.error('[generateWallet] Error', err);
      alert('Failed to generate wallet');
    }
  };

  const rotateKey = async (agentId: string) => {
    if (!sessionToken) return;
    if (!confirm('This will invalidate the old API key. Any integrations using it will stop working. Continue?')) return;
    setRotatingId(agentId);
    try {
      const res = await fetch(`https://api.saidprotocol.com/api/agents/${agentId}/rotate-key`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setApiKeys(prev => ({ ...prev, [agentId]: data.gatewayToken }));
      }
    } catch {}
    setRotatingId(null);
  };

  const copyKey = (agentId: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(agentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (sessionToken) {
      fetchMyAgents();
    } else {
      setLoading(false);
    }
  }, [sessionToken]);

  const fetchMyAgents = async () => {
    if (!sessionToken) return;

    const hostedAgents: Agent[] = [];
    const protocolAgents: Agent[] = [];

    // Fetch hosted agents (app.saidprotocol.com — hosting API)
    try {
      const hostingRes = await fetch('https://app.saidprotocol.com/api/agents', {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
      if (hostingRes.ok) {
        const hostingData = await hostingRes.json();
        const list = Array.isArray(hostingData) ? hostingData : [];
        for (const a of list) {
          hostedAgents.push({
            id: a.id,
            wallet: a.walletAddress || a.wallet || '',
            name: a.name || 'Unnamed',
            description: a.description,
            isVerified: a.isVerified ?? false,
            twitter: a.twitter,
            gatewayToken: a.gatewayToken,
            source: 'hosted',
            hasApiKey: true,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch hosted agents:', err);
    }

    // Fetch protocol agents (api.saidprotocol.com — on-chain registry)
    try {
      const protocolRes = await fetch('https://api.saidprotocol.com/api/agents?mine=true', {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
      if (protocolRes.ok) {
        const protocolData = await protocolRes.json();
        const list = Array.isArray(protocolData) ? protocolData : (protocolData.agents || []);
        const hostedIds = new Set(hostedAgents.map(a => a.id));
        const hostedWallets = new Set(hostedAgents.map(a => a.wallet));
        for (const a of list) {
          const wallet = a.wallet || a.walletAddress || '';
          // Skip if already in hosted list (deduplicate)
          if (hostedIds.has(a.id) || hostedWallets.has(wallet)) continue;
          protocolAgents.push({
            id: a.id,
            wallet,
            name: a.name || 'Unnamed',
            description: a.description,
            isVerified: a.isVerified ?? false,
            twitter: a.twitter,
            source: 'protocol',
            hasApiKey: false,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch protocol agents:', err);
    }

    // Hosted first, then protocol-only
    setAgents([...hostedAgents, ...protocolAgents]);
    setLoading(false);
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
                className={`p-6 bg-zinc-900 border rounded-xl ${
                  agent.source === 'hosted'
                    ? 'border-indigo-500/30'
                    : 'border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                      agent.source === 'hosted'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        : 'bg-gradient-to-br from-zinc-600 to-zinc-700'
                    }`}>
                      {(agent.name || '?')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{agent.name}</h3>
                        {agent.isVerified && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                            ✓ Verified
                          </span>
                        )}
                      {(agent.source === 'hosted' || apiKeys[agent.id]) ? (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                            ⚡ Wallet Active
                          </span>
                        ) : null}
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

                {agent.source === 'hosted' ? (
                  /* Full API Key section for hosted agents */
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">API Key</span>
                      <div className="flex gap-2">
                        {apiKeys[agent.id] && (
                          <>
                            <button
                              onClick={() => copyKey(agent.id, apiKeys[agent.id])}
                              className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded hover:border-zinc-500 transition"
                            >
                              {copiedId === agent.id ? '✓ Copied' : 'Copy'}
                            </button>
                            <button
                              onClick={() => rotateKey(agent.id)}
                              disabled={rotatingId === agent.id}
                              className="px-3 py-1 text-xs bg-zinc-800 border border-red-900/50 text-red-400 rounded hover:border-red-500/50 transition disabled:opacity-50"
                            >
                              {rotatingId === agent.id ? 'Rotating...' : 'Rotate'}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (showKeyForId === agent.id) {
                              setShowKeyForId(null);
                            } else {
                              fetchApiKey(agent.id);
                              setShowKeyForId(agent.id);
                            }
                          }}
                          className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded hover:border-zinc-500 transition"
                        >
                          {showKeyForId === agent.id ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                    {showKeyForId === agent.id && (
                      <div className="mt-2 font-mono text-xs bg-zinc-950 px-3 py-2 rounded border border-zinc-800 break-all">
                        {apiKeys[agent.id] || 'Loading...'}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Generate wallet for any agent */
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Transactions</span>
                      <div className="flex gap-2">
                        {apiKeys[agent.id] ? (
                          <>
                            <button
                              onClick={() => copyKey(agent.id, apiKeys[agent.id])}
                              className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded hover:border-zinc-500 transition"
                            >
                              {copiedId === agent.id ? '✓ Copied' : 'Copy API Key'}
                            </button>
                            <button
                              onClick={() => {
                                if (showKeyForId === agent.id) {
                                  setShowKeyForId(null);
                                } else {
                                  setShowKeyForId(agent.id);
                                }
                              }}
                              className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded hover:border-zinc-500 transition"
                            >
                              {showKeyForId === agent.id ? 'Hide' : 'Show'}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => generateWallet(agent.id)}
                            className="px-4 py-2 text-sm bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
                          >
                            Get API Key
                          </button>
                        )}
                      </div>
                    </div>
                    {showKeyForId === agent.id && apiKeys[agent.id] && (
                      <div className="mt-2 font-mono text-xs bg-zinc-950 px-3 py-2 rounded border border-zinc-800 break-all">
                        {apiKeys[agent.id]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
