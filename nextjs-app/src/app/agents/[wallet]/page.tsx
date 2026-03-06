'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';
import ReputationAnalytics from '@/components/ReputationAnalytics';

interface Agent {
  wallet: string;
  name: string;
  description: string;
  isVerified: boolean;
  registeredAt: string;
  twitter?: string;
  website?: string;
  image?: string;
  skills?: string[];
  reputationScore: number;
  feedbackCount: number;
  pda?: string;
}

export default function AgentPage() {
  const params = useParams();
  const wallet = params.wallet as string;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (wallet) {
      fetchAgent();
    }
  }, [wallet]);

  const fetchAgent = async () => {
    try {
      const res = await fetch(`https://api.saidprotocol.com/api/agents/${wallet}`);
      if (res.ok) {
        const data = await res.json();
        setAgent(data.agent || data);
      } else {
        setError('Agent not found');
      }
    } catch (err) {
      console.error('Failed to fetch agent:', err);
      setError('Failed to load agent');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative"><AsciiBackground agentThemed /><div className="relative z-10">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-400">Loading agent...</p>
          </div>
        </main>
        <Footer />
      </div></div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen flex flex-col relative"><AsciiBackground agentThemed /><div className="relative z-10">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto mb-4 text-zinc-600" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="m15 9-6 6"/>
              <path d="m9 9 6 6"/>
            </svg>
            <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
            <p className="text-zinc-400 mb-6">This agent doesn't exist or hasn't been registered yet.</p>
            <Link href="/agents" className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition">
              Browse Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div></div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative"><AsciiBackground agentThemed /><div className="relative z-10">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-8 py-12 w-full">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {agent.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{agent.name || 'Unnamed Agent'}</h1>
              {agent.isVerified && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-zinc-400 mb-4">{agent.description || 'No description provided'}</p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {agent.twitter && (
                <a 
                  href={`https://twitter.com/${agent.twitter.replace('@', '')}`} 
                  target="_blank"
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:border-zinc-600 transition flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  {agent.twitter}
                </a>
              )}
              {agent.website && (
                <a 
                  href={agent.website} 
                  target="_blank"
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:border-zinc-600 transition flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl text-center">
            <div className="text-2xl font-bold">{agent.reputationScore?.toFixed(1) || '0'}</div>
            <div className="text-zinc-400 text-sm">Reputation</div>
          </div>
          <div className="p-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl text-center">
            <div className="text-2xl font-bold">{agent.feedbackCount || 0}</div>
            <div className="text-zinc-400 text-sm">Feedback</div>
          </div>
          <div className="p-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl text-center">
            <div className="text-2xl font-bold">{agent.skills?.length || 0}</div>
            <div className="text-zinc-400 text-sm">Skills</div>
          </div>
          <div className="p-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl text-center">
            <div className="text-2xl font-bold">
              {agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}
            </div>
            <div className="text-zinc-400 text-sm">Registered</div>
          </div>
        </div>

        {/* Reputation Analytics - only show if agent has feedback */}
        {agent.feedbackCount > 0 && (
          <ReputationAnalytics 
            wallet={agent.wallet} 
            currentScore={agent.reputationScore || 0}
            feedbackCount={agent.feedbackCount || 0}
          />
        )}

        {/* Skills */}
        {agent.skills && agent.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {agent.skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Wallet Info */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">On-Chain Identity</h2>
          <div className="p-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Wallet</span>
              <code className="text-sm bg-zinc-800 px-2 py-1 rounded font-mono">{agent.wallet}</code>
            </div>
            {agent.pda && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Identity PDA</span>
                <code className="text-sm bg-zinc-800 px-2 py-1 rounded font-mono">{agent.pda.slice(0, 8)}...{agent.pda.slice(-8)}</code>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Explorer</span>
              <a 
                href={`https://solscan.io/account/${agent.wallet}`}
                target="_blank"
                className="text-sm text-blue-400 hover:underline"
              >
                View on Solscan →
              </a>
            </div>
          </div>
        </section>

        {/* SAID Passport */}
        {agent.isVerified && (
          <div className="p-6 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-4">SAID Passport</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/passport-logo.png" 
                  alt="SAID Passport" 
                  className="w-32 h-32 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-zinc-400 mb-4">
                  {(agent as any).passportMint 
                    ? 'Soulbound passport NFT — permanent, non-transferable on-chain identity proof.' 
                    : 'Mint a soulbound passport NFT — permanent, non-transferable on-chain identity proof.'}
                </p>
                <div className="flex items-center gap-4">
                  {!(agent as any).passportMint && (
                    <span className="text-sm font-semibold">0.05 SOL</span>
                  )}
                  <Link
                    href={(agent as any).passportMint 
                      ? `https://solscan.io/token/${(agent as any).passportMint}` 
                      : `/mint-passport?wallet=${agent.wallet}`}
                    target={(agent as any).passportMint ? "_blank" : undefined}
                    rel={(agent as any).passportMint ? "noopener noreferrer" : undefined}
                    className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition text-sm"
                  >
                    {(agent as any).passportMint ? 'View Passport →' : 'Mint Passport →'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div></div>
  );
}
