'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Icons
const Icons = {
  token: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v12"/>
      <path d="M15 9.5a3 3 0 1 0 0 5"/>
      <path d="M9 9.5a3 3 0 1 1 0 5"/>
    </svg>
  ),
  treasury: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  grants: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  stream: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4"/>
      <path d="M10 12h4"/>
      <path d="M18 12h4"/>
      <circle cx="6" cy="12" r="2"/>
      <circle cx="18" cy="12" r="2"/>
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
    >
      {copied ? Icons.check : Icons.copy}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function StatCard({ value, label, description }: { value: string; label: string; description: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-lg font-semibold text-zinc-300 mb-2">{label}</div>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  );
}

export default function TokenPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="text-center py-16 px-4 border-b border-zinc-800">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-white">{Icons.token}</span>
            <h1 className="text-4xl md:text-5xl font-bold">$SAID Token</h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Funding the best AI agents on Solana through streaming grants and performance rewards.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 inline-flex items-center gap-4">
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Token Address</div>
              <code className="text-zinc-300 font-mono">Launching Soon</code>
            </div>
          </div>
        </section>

        {/* Treasury Mechanics */}
        <section className="py-16 px-4 border-b border-zinc-800">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-white">{Icons.treasury}</span>
              <h2 className="text-3xl font-bold">Treasury Mechanics</h2>
            </div>
            <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
              Two funding sources power the grants treasury: the initial dev buy and ongoing creator rewards.
            </p>

            {/* Dev Buy Allocation */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 text-center">30% Dev Buy Allocation</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <StatCard
                  value="15%"
                  label="Locked (1 Year)"
                  description="Long-term commitment. Cannot be sold or moved for 12 months."
                />
                <StatCard
                  value="15%"
                  label="Liquid Treasury"
                  description="Immediate deployment for grants, LP provision, and development."
                />
              </div>
              <p className="text-center text-zinc-500 mt-6 text-sm">
                50% of the dev buy is locked for 1 year — maximum bullish signal.
              </p>
            </div>

            {/* Creator Rewards Allocation */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Creator Rewards Allocation</h3>
              <p className="text-center text-zinc-400 mb-8">
                0.5% of all trading volume flows to the treasury and is split as follows:
              </p>
              <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">35%</div>
                  <div className="text-sm font-medium text-zinc-300">Agent Grants</div>
                  <p className="text-xs text-zinc-500 mt-1">Streaming SOL to verified agents</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">25%</div>
                  <div className="text-sm font-medium text-zinc-300">Team</div>
                  <p className="text-xs text-zinc-500 mt-1">Operations & development</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">20%</div>
                  <div className="text-sm font-medium text-zinc-300">Buyback</div>
                  <p className="text-xs text-zinc-500 mt-1">Buy $SAID → strategic reserve</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400 mb-1">15%</div>
                  <div className="text-sm font-medium text-zinc-300">Performance</div>
                  <p className="text-xs text-zinc-500 mt-1">$SAID rewards for top agents</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-zinc-400 mb-1">5%</div>
                  <div className="text-sm font-medium text-zinc-300">Dev/Ops</div>
                  <p className="text-xs text-zinc-500 mt-1">Infrastructure costs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grants Program */}
        <section className="py-16 px-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-white">{Icons.grants}</span>
              <h2 className="text-3xl font-bold">Grants Program</h2>
            </div>
            <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
              Operational funding for verified AI agents. Streamed, not lump sum.
            </p>

            {/* How Streaming Works */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white">{Icons.stream}</span>
                <h3 className="text-xl font-semibold">Streaming Payments</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                Grants are streamed over time, not given as a lump sum. This protects the treasury 
                and ensures agents deliver consistent value.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-white mb-1">Typical Grant</div>
                  <div className="text-zinc-400">1-5 SOL/month</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-white mb-1">Duration</div>
                  <div className="text-zinc-400">3-6 months</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-white mb-1">Cancelable</div>
                  <div className="text-zinc-400">Anytime if agent stops delivering</div>
                </div>
              </div>
            </div>

            {/* Grant Process */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-white">Get Verified</h4>
                  <p className="text-zinc-400">Register your agent on SAID Protocol and get the verified badge (0.01 SOL).</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-white">Apply</h4>
                  <p className="text-zinc-400">Submit your application describing your agent, what it does, and your funding needs.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-white">Review</h4>
                  <p className="text-zinc-400">Team reviews applications. Selection based on quality, impact, and feasibility.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-white">Stream Activated</h4>
                  <p className="text-zinc-400">Approved agents receive streaming SOL. Funds vest continuously over the grant period.</p>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="text-center mt-12">
              <a 
                href="/grants/apply" 
                className="inline-block px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
              >
                Apply for a Grant
              </a>
              <p className="text-zinc-500 text-sm mt-3">Applications open when $SAID launches</p>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why This Matters</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2">Lower Barriers</h3>
                <p className="text-zinc-400 text-sm">
                  Operational funding removes financial friction. Build great agents without worrying about gas fees and RPC costs.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-3xl mb-4">🔄</div>
                <h3 className="text-lg font-semibold mb-2">Self-Sustaining</h3>
                <p className="text-zinc-400 text-sm">
                  More trading → bigger treasury → fund more agents → more adoption → more trading. The flywheel effect.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold mb-2">Merit-Based</h3>
                <p className="text-zinc-400 text-sm">
                  No pay-to-win. Applications are free. Selection based on quality, impact, and what you're building.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
