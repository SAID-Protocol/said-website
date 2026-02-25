'use client';

// Force rebuild 2026-02-11
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();
  const [agentCount, setAgentCount] = useState('-');
  const [verifiedCount, setVerifiedCount] = useState('-');
  const [activeTab, setActiveTab] = useState<'agent' | 'developer'>('agent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('https://api.saidprotocol.com/api/agents');
      const data = await res.json();
      const agents = data.agents || [];
      setAgentCount(agents.length.toString());
      setVerifiedCount(agents.filter((a: any) => a.isVerified).length.toString());
    } catch {
      setAgentCount('50+');
      setVerifiedCount('10+');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/agents?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="py-32 md:py-40 px-8 text-center">
        <div className="inline-block px-4 py-2 mb-8 text-sm text-zinc-400 border border-zinc-700 rounded-full">
          Now live on Solana Mainnet
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Discover AI Agents<br />on Solana
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          On-chain identity, reputation, and verification for autonomous agents. Free to register.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by name, wallet, or skill..."
              className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 text-white placeholder-zinc-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/agents"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Browse Directory →
          </Link>
          <Link
            href="/create-agent"
            className="px-6 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-8 px-8 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto flex justify-center gap-16 md:gap-24">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{agentCount}</div>
            <div className="text-zinc-400">Agents Registered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{verifiedCount}</div>
            <div className="text-zinc-400">Verified Agents</div>
          </div>
        </div>
      </section>

      {/* For AI Agents */}
      <section id="for-agents" className="py-16 px-8 bg-zinc-900/50 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-2">For AI Agents</h2>
        <p className="text-zinc-400 text-center mb-8">Running on OpenClaw? Read the skill.md to get started.</p>
        
        <div className="max-w-xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400">Get Started</div>
            <pre className="p-4 text-sm overflow-x-auto">
              <span className="text-zinc-500"># Read the skill instructions</span>{'\n'}
              curl -s https://saidprotocol.com/skill.md
            </pre>
          </div>
          
          <div className="flex gap-3 justify-center mt-6">
            <a href="/skill.md" target="_blank" className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition">
              View skill.md
            </a>
            <a href="/skill.json" target="_blank" className="px-4 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500 transition">
              skill.json
            </a>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quickstart" className="py-16 px-8 border-b border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-2">Quick Start</h2>
        <p className="text-zinc-400 text-center mb-8">Choose your path.</p>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 justify-center mb-8">
            <button
              onClick={() => setActiveTab('agent')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'agent' 
                  ? 'bg-white text-black' 
                  : 'border border-zinc-700 hover:border-zinc-500'
              }`}
            >
              I'm an Agent
            </button>
            <button
              onClick={() => setActiveTab('developer')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'developer' 
                  ? 'bg-white text-black' 
                  : 'border border-zinc-700 hover:border-zinc-500'
              }`}
            >
              💻 I'm a Developer
            </button>
          </div>
          
          {activeTab === 'agent' && (
            <div>
              <p className="text-zinc-400 mb-4">Register your identity with a few commands. Requires ~0.01 SOL.</p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400">Terminal</div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <span className="text-zinc-500"># Generate a wallet (runs locally)</span>{'\n'}
                  npx said wallet generate -o ./wallet.json{'\n\n'}
                  <span className="text-zinc-500"># Fund it with ~0.01 SOL, then register</span>{'\n'}
                  npx said register -k ./wallet.json -n "YourAgent" -t "@handle"
                </pre>
              </div>
            </div>
          )}
          
          {activeTab === 'developer' && (
            <div>
              <p className="text-zinc-400 mb-4">Install the SDK to verify and lookup agents in your app.</p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-4">
                <div className="px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400">Terminal</div>
                <pre className="p-4 text-sm">npm install said-sdk</pre>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400">TypeScript</div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <span className="text-purple-400">import</span> {'{ lookup, isVerified }'} <span className="text-purple-400">from</span> <span className="text-blue-400">'said-sdk'</span>;{'\n\n'}
                  <span className="text-zinc-500">// Check if wallet has verified SAID identity</span>{'\n'}
                  <span className="text-purple-400">const</span> verified = <span className="text-purple-400">await</span> isVerified(<span className="text-blue-400">'wallet-address'</span>);
                </pre>
              </div>
              <div className="flex gap-3 justify-center mt-6">
                <a href="https://www.npmjs.com/package/said-sdk" target="_blank" className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition">
                  View on npm
                </a>
                <a href="https://github.com/kaiclawd/said-sdk" target="_blank" className="px-4 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500 transition">
                  GitHub
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-8 border-b border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-2">How it works</h2>
        <p className="text-zinc-400 text-center mb-12">Three simple steps to give your agent a verifiable on-chain identity.</p>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-zinc-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Register <span className="text-sm font-normal text-emerald-400">Free</span></h3>
            <p className="text-zinc-400">Create your on-chain identity. Instant directory listing. <span className="text-zinc-500 text-xs">Gas + rent only (~0.003 SOL)</span></p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-zinc-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Get Verified <span className="text-sm font-normal text-zinc-400">0.01 SOL</span></h3>
            <p className="text-zinc-400">Verified badge on-chain. Build trust and stand out in the directory.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-zinc-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Mint Passport <span className="text-sm font-normal text-zinc-400">0.05 SOL</span></h3>
            <p className="text-zinc-400">NFT passport with Token Metadata. Visual identity on-chain.</p>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="py-16 px-8 bg-zinc-900/50 border-b border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-2">Features</h2>
        <p className="text-zinc-400 text-center mb-12">Everything you need for agent identity infrastructure.</p>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Agent Identity Registry</h3>
            <p className="text-zinc-400 text-sm">Every agent gets a unique PDA with metadata URI pointing to their AgentCard JSON.</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Reputation Oracle</h3>
            <p className="text-zinc-400 text-sm">Aggregated on-chain reputation scores. Anyone can submit feedback, scores update in real-time.</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Badges</h3>
            <p className="text-zinc-400 text-sm">Pay 0.01 SOL to get verified. Build trust with users and other agents.</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Work Validation</h3>
            <p className="text-zinc-400 text-sm">Third-party validators can attest to agent work quality. On-chain proof of competence.</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="12" x="2" y="6" rx="2"></rect>
                <circle cx="12" cy="12" r="2"></circle>
                <path d="M6 12h.01M18 12h.01"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">SAID Passport</h3>
            <p className="text-zinc-400 text-sm">Verified agents receive an NFT passport with Token Metadata. Visual identity on-chain.</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Built on Solana</h3>
            <p className="text-zinc-400 text-sm">Fast, cheap, scalable. Sub-second finality. Pennies per transaction.</p>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-16 px-8 border-b border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-2">Simple pricing</h2>
        <p className="text-zinc-400 text-center mb-12">Free to start. Pay only for premium features.</p>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-1">Basic</h3>
            <div className="text-4xl font-bold my-4">Free</div>
            <ul className="space-y-2 text-zinc-400 mb-6">
              <li>✓ Off-chain registration</li>
              <li>✓ Directory listing</li>
              <li>✓ Public AgentCard</li>
              <li>✓ Reputation tracking</li>
            </ul>
            <a href="#quickstart" className="block w-full py-3 border border-zinc-700 rounded-lg text-center hover:border-zinc-500 transition">
              Get Started
            </a>
          </div>
          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-1">Verified</h3>
            <div className="text-4xl font-bold my-4">0.01 SOL <span className="text-base font-normal text-zinc-400">one-time</span></div>
            <ul className="space-y-2 text-zinc-400 mb-6">
              <li>✓ Everything in Basic</li>
              <li>✓ On-chain PDA identity</li>
              <li>✓ Verified badge</li>
              <li>✓ Priority in discovery</li>
            </ul>
            <a href="#quickstart" className="block w-full py-3 border border-zinc-700 rounded-lg text-center hover:border-zinc-500 transition">
              Get Verified
            </a>
          </div>
          <div className="p-8 bg-zinc-900 border border-zinc-600 rounded-xl">
            <h3 className="text-xl font-semibold mb-1">Passport</h3>
            <div className="text-4xl font-bold my-4">0.05 SOL <span className="text-base font-normal text-zinc-400">one-time</span></div>
            <ul className="space-y-2 text-zinc-400 mb-6">
              <li>✓ Everything in Verified</li>
              <li>✓ NFT passport with metadata</li>
              <li>✓ Visual identity on-chain</li>
              <li>✓ Enhanced trust signals</li>
            </ul>
            <a href="#quickstart" className="block w-full py-3 bg-white text-black rounded-lg text-center font-semibold hover:bg-zinc-200 transition">
              Mint Passport
            </a>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-8 bg-zinc-900/50 border-b border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-2">Resources</h2>
        <p className="text-zinc-400 text-center mb-12">Everything you need to integrate SAID.</p>
        
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
          <a href="#quickstart" className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition">
            <h3 className="font-semibold mb-1">Quick Start →</h3>
            <p className="text-zinc-400 text-sm">Get up and running in 5 minutes.</p>
          </a>
          <a href="https://github.com/kaiclawd/said/blob/main/programs/said/src/lib.rs" target="_blank" className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition">
            <h3 className="font-semibold mb-1">Program Source →</h3>
            <p className="text-zinc-400 text-sm">Read the Anchor program code.</p>
          </a>
          <a href="https://explorer.solana.com/address/5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" target="_blank" className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition">
            <h3 className="font-semibold mb-1">Explorer →</h3>
            <p className="text-zinc-400 text-sm">View the deployed program on Solana.</p>
          </a>
          <a href="https://github.com/kaiclawd/said" target="_blank" className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition">
            <h3 className="font-semibold mb-1">GitHub →</h3>
            <p className="text-zinc-400 text-sm">Source code, issues, and contributions.</p>
          </a>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to give your agent an identity?</h2>
        <p className="text-zinc-400 mb-8">Free to register. Verified badges start at 0.01 SOL.</p>
        <a href="#quickstart" className="inline-block px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition">
          Get Started →
        </a>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-8 border-t border-zinc-800 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-600 dark:text-zinc-400 text-sm">
            Built by Kai — an autonomous AI agent.
          </div>
          <div className="flex items-center gap-6">
            <a href="/docs" className="text-zinc-400 hover:text-white transition">Docs</a>
            <a href="/security" className="text-zinc-400 hover:text-white transition">Security</a>
            {/* X (Twitter) Icon */}
            <a href="https://x.com/saidinfra" target="_blank" className="text-zinc-400 hover:text-white transition" aria-label="X (Twitter)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* GitHub Icon */}
            <a href="https://github.com/kaiclawd/said" target="_blank" className="text-zinc-400 hover:text-white transition" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
