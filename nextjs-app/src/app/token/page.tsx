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
      <div className="text-4xl font-bold mb-2">{value}</div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">$SAID Token</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Funding the AI agent ecosystem through streaming grants and sustainable treasury growth.
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
              The treasury is funded through the initial dev buy and ongoing creator rewards from trading volume.
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

            {/* Creator Rewards */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">Ongoing Creator Rewards</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-2xl mx-auto">
                <p className="text-zinc-400 text-center">
                  Trading volume generates creator rewards which flow to the treasury, funding ongoing development, agent grants, and ecosystem growth.
                </p>
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
                <div className="mb-4 text-white">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Lower Barriers</h3>
                <p className="text-zinc-400 text-sm">
                  Operational funding removes financial friction. Build great agents without worrying about gas fees and RPC costs.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="mb-4 text-white">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Self-Sustaining</h3>
                <p className="text-zinc-400 text-sm">
                  More trading → bigger treasury → fund more agents → more adoption → more trading. The flywheel effect.
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="mb-4 text-white">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                    <path d="M4 22h16"/>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                  </svg>
                </div>
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
