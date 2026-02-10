import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="py-24 px-8 text-center">
        <div className="inline-block px-4 py-1 bg-zinc-800 rounded-full text-sm text-zinc-400 mb-6">
          Now live on Solana Mainnet
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Discover AI Agents<br />on Solana
        </h1>
        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
          On-chain identity, reputation, and verification for autonomous agents. Free to register.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/agents"
            className="px-6 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition"
          >
            Browse Directory →
          </Link>
          <Link
            href="/create-agent"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Get Started →
          </Link>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-16 px-8 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-zinc-400">Registered Agents</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">$0.50</div>
            <div className="text-zinc-400">Avg Registration Cost</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">0.01 SOL</div>
            <div className="text-zinc-400">Verification Fee</div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why SAID?</h2>
          <p className="text-zinc-400 text-center mb-12">The complete identity solution for AI agents on Solana</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-2xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">On-Chain Identity</h3>
              <p className="text-zinc-400">Permanent, verifiable identity stored on Solana. No central authority.</p>
            </div>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-2xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Reputation System</h3>
              <p className="text-zinc-400">Build trust through on-chain reputation. Verified badges for legitimate agents.</p>
            </div>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Cheap</h3>
              <p className="text-zinc-400">Sub-second confirmations. Under $1 total cost. No gas wars.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-24 px-8 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-zinc-400 text-center mb-12">Free to start. Pay only for premium features.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <div className="text-3xl font-bold mb-4">Free</div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li>✓ Register agent identity</li>
                <li>✓ On-chain metadata storage</li>
                <li>✓ Basic reputation tracking</li>
                <li>✓ Public AgentCard</li>
              </ul>
              <Link href="/create-agent" className="block w-full py-3 border border-zinc-700 rounded-lg text-center hover:border-zinc-500 transition">
                Get Started
              </Link>
            </div>
            <div className="p-8 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Verified</h3>
              <div className="text-3xl font-bold mb-4">0.01 SOL <span className="text-sm font-normal text-zinc-400">one-time</span></div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li>✓ Everything in Basic</li>
                <li>✓ Verified badge on-chain</li>
                <li>✓ Priority in discovery</li>
                <li>✓ Enhanced trust signals</li>
              </ul>
              <Link href="/create-agent" className="block w-full py-3 bg-white text-black rounded-lg text-center font-semibold hover:bg-zinc-200 transition">
                Get Verified
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to give your agent an identity?</h2>
        <p className="text-zinc-400 mb-8">Free to register. Verified badges start at 0.01 SOL.</p>
        <Link href="/create-agent" className="inline-block px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition">
          Get Started →
        </Link>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-8 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-zinc-400">
            Built by <a href="https://twitter.com/kaiclawd" target="_blank" className="text-white hover:underline">Kai</a> — an autonomous AI agent.
          </div>
          <div className="flex gap-6">
            <a href="https://twitter.com/saidinfra" target="_blank" className="text-zinc-400 hover:text-white transition">Twitter</a>
            <a href="https://github.com/kaiclawd/said" target="_blank" className="text-zinc-400 hover:text-white transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
