'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Agent {
  id: string;
  name: string;
  description: string;
  wallet: string;
  twitter: string | null;
  website: string | null;
  isVerified: boolean;
  layer2Verified: boolean;
  verifiedEndpointUrl: string | null;
  reputationScore: number;
  skills: string[];
  serviceTypes: string[];
  registeredAt: string;
  mcpEndpoint: string | null;
  a2aEndpoint: string | null;
  image: string | null;
  createdAt: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-2 text-zinc-500 hover:text-zinc-300 transition text-xs px-2 py-1 border border-zinc-700 rounded">
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function ReputationRing({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score));
  const color = clamped >= 70 ? '#10b981' : clamped >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#27272a" strokeWidth="8"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - clamped / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(clamped)}</span>
          <span className="text-xs text-zinc-500">/ 100</span>
        </div>
      </div>
      <span className="text-sm text-zinc-400 mt-2">Reputation Score</span>
    </div>
  );
}

// L2 verification is framework-only - no manual UI
// Show read-only badge if already L2 verified
function Layer2Badge({ isL2Verified }: { isL2Verified: boolean }) {
  if (!isL2Verified) return null;
  
  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <div>
        <div className="text-blue-400 font-semibold text-sm">Framework-Verified Agent</div>
        <div className="text-zinc-400 text-xs mt-0.5">This agent was attested by a trusted framework at initialization.</div>
      </div>
    </div>
  );
}

export default function AgentProfilePage() {
  const params = useParams();
  const wallet = params?.wallet as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!wallet) return;
    fetch(`https://api.saidprotocol.com/api/agents/${wallet}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setAgent(data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [wallet]);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-zinc-500">Loading agent...</div>
      </main>
    </div>
  );

  if (notFound || !agent) return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
          <p className="text-zinc-400 mb-6">No agent registered with this wallet address.</p>
          <Link href="/agents" className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition">
            Browse Directory
          </Link>
        </div>
      </main>
    </div>
  );

  const allSkills = [...(agent.skills || []), ...(agent.serviceTypes || [])].filter(Boolean);
  const registeredDate = new Date(agent.registeredAt || agent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const hasEndpoint = agent.mcpEndpoint || agent.a2aEndpoint;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">

        {/* Back */}
        <Link href="/agents" className="text-zinc-500 hover:text-zinc-300 transition text-sm flex items-center gap-1 mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Directory
        </Link>

        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar + Name */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl font-bold">
                  {agent.image ? (
                    <img src={agent.image} alt={agent.name} className="w-full h-full object-cover rounded-xl"/>
                  ) : (
                    agent.name?.charAt(0) || '?'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">{agent.name || 'Unknown Agent'}</h1>
                    {agent.isVerified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-full">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Verified
                      </span>
                    )}
                    {agent.layer2Verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs rounded-full">
                        ⚡ L2 Agent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {agent.twitter && (
                      <a href={`https://x.com/${agent.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        {agent.twitter}
                      </a>
                    )}
                    {agent.website && (
                      <a href={agent.website.startsWith('http') ? agent.website : `https://${agent.website}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {agent.description && (
                <p className="text-zinc-400 leading-relaxed mb-4">{agent.description}</p>
              )}

              {/* Wallet */}
              <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500 flex-shrink-0"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                <code className="text-xs text-zinc-400 font-mono truncate flex-1">{agent.wallet}</code>
                <CopyButton text={agent.wallet} />
              </div>
            </div>

            {/* Reputation Ring */}
            <div className="flex-shrink-0">
              <ReputationRing score={agent.reputationScore || 0} />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Registered</div>
            <div className="text-sm font-medium">{registeredDate}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</div>
            <div className="text-sm font-medium flex items-center gap-1">
              {agent.isVerified ? (
                <><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Verified</>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-zinc-500 inline-block"></span> Unverified</>
              )}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Endpoint</div>
            <div className="text-sm font-medium flex items-center gap-1">
              {hasEndpoint ? (
                <><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Active</>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-zinc-600 inline-block"></span> None</>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        {allSkills.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Skills & Capabilities</h2>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Endpoints */}
        {hasEndpoint && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Endpoints</h2>
            <div className="space-y-3">
              {agent.mcpEndpoint && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">MCP Endpoint</div>
                  <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2">
                    <code className="text-xs text-zinc-400 font-mono truncate flex-1">{agent.mcpEndpoint}</code>
                    <CopyButton text={agent.mcpEndpoint} />
                  </div>
                </div>
              )}
              {agent.a2aEndpoint && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">A2A Endpoint</div>
                  <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2">
                    <code className="text-xs text-zinc-400 font-mono truncate flex-1">{agent.a2aEndpoint}</code>
                    <CopyButton text={agent.a2aEndpoint} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Layer 2 Verification */}
        <Layer2Badge isL2Verified={agent.layer2Verified || false} />

        {/* SAID Passport */}
        {agent.isVerified && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
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

        {/* CTA */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
          <p className="text-zinc-400 text-sm mb-4">Want to register your own agent on SAID Protocol?</p>
          <Link href="/create-agent" className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition text-sm">
            Register Your Agent →
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
