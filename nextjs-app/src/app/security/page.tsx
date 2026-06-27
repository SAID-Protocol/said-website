'use client';

import Navbar from '@/components/Navbar';
import AsciiBackground from '@/components/AsciiBackground';
import Footer from '@/components/Footer';

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AsciiBackground />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h1 className="text-4xl font-bold">Security & Privacy</h1>
        </div>
        <p className="text-xl text-zinc-400 mb-12">How SAID Protocol protects your private keys and identity.</p>

        {/* Core Promise */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">The Core Promise</h2>
          <p className="text-zinc-300 mb-6">
            One principle underpins everything: <strong className="text-white">SAID never holds your keys.</strong> Whichever way you create your agent, the private key is never stored on — or even seen by — SAID&apos;s servers. You choose how it&apos;s held:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Self-custody (CLI)</h4>
              <p className="text-zinc-400 text-sm">Generate the wallet yourself with our CLI. The private key is a file on your own machine — it never leaves your environment, and we only ever see your public key.</p>
            </div>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Managed (no CLI)</h4>
              <p className="text-zinc-400 text-sm">Create an agent on the website and its wallet is an embedded wallet secured by <a href="https://privy.io" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2">Privy</a>, a dedicated key-management provider. The key lives in Privy&apos;s infrastructure — never in a SAID database. More convenient; you delegate custody to Privy, not to us.</p>
            </div>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M7 7h.01"/>
                  <path d="M17 7h.01"/>
                  <path d="M7 17h.01"/>
                  <path d="M17 17h.01"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2">On-Chain Verification</h4>
              <p className="text-zinc-400 text-sm">Identity lives on Solana. No centralized database storing sensitive credentials.</p>
            </div>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Signature-Based Auth</h4>
              <p className="text-zinc-400 text-sm">All actions require wallet signatures. Proof of ownership, not passwords.</p>
            </div>
          </div>
        </section>

        {/* What We Store */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">What We Store vs. What We Don&apos;t</h2>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5 mb-4">
            <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>
              What We Store (Public Data)
            </h4>
            <ul className="text-zinc-300 text-sm space-y-1 list-disc list-inside">
              <li>Public wallet address</li>
              <li>Agent metadata (name, description, links)</li>
              <li>Verification status</li>
              <li>Reputation scores and feedback</li>
              <li>On-chain transaction signatures</li>
            </ul>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5">
            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
              What We NEVER Store
            </h4>
            <ul className="text-zinc-300 text-sm space-y-1 list-disc list-inside">
              <li>Private keys</li>
              <li>Seed phrases</li>
              <li>Passwords</li>
              <li>Encrypted key material</li>
              <li>Any data that could compromise your wallet</li>
            </ul>
          </div>

          <p className="text-zinc-500 text-sm mt-4">
            Managed (no-CLI) wallets are created and secured by <a href="https://privy.io" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2">Privy</a> — the key lives in Privy&apos;s infrastructure, never in a SAID database. SAID stores none of the above either way.
          </p>
        </section>

        {/* Secure Onboarding */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">Secure Onboarding Flow (Self-Custody)</h2>
          <p className="text-zinc-400 mb-6">Here&apos;s exactly how self-custody registration works via the CLI. Prefer no CLI? The website&apos;s managed flow runs these same on-chain steps for you with a Privy-secured wallet.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 1: Generate a wallet locally</h3>
          <p className="text-zinc-400 mb-3">Generate a Solana keypair on your own machine (or reuse your existing one at <code className="bg-zinc-800 px-1 rounded">~/.config/solana/id.json</code>):</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2 overflow-x-auto text-sm">
            <code>{`solana-keygen new -o ./wallet.json

# ✅ Wrote new keypair to ./wallet.json
# pubkey: YOUR_PUBLIC_ADDRESS`}</code>
          </pre>
          <p className="text-zinc-500 text-sm mb-4">The private key in wallet.json never leaves your machine.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 2: Fund &amp; register</h3>
          <p className="text-zinc-400 mb-3">Send a little SOL to your wallet (registration is free — only ~0.002 SOL rent), then register with the CLI, pointing at your hosted AgentCard:</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2 overflow-x-auto text-sm">
            <code>{`git clone https://github.com/kaiclawd/said-skill
cd said-skill && npm install

./run.sh register --metadata "https://yoursite.com/agent.json"`}</code>
          </pre>
          <p className="text-zinc-500 text-sm mb-4">We only receive your public key and the metadata URL. Your private key signs the transaction locally — it never leaves your machine.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 3: On-chain identity created</h3>
          <p className="text-zinc-400 mb-4">Your identity PDA is created on Solana. The identity is tied to your public key, controlled only by your private key.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 4: Verify (optional)</h3>
          <p className="text-zinc-400 mb-3">Get a verified badge by signing a verification transaction locally:</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2 overflow-x-auto text-sm">
            <code>./run.sh verify</code>
          </pre>
          <p className="text-zinc-500 text-sm">Costs 0.01 SOL. The transaction is signed locally and broadcast to Solana.</p>
        </section>

        {/* Technical Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">Technical Security Details</h2>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Cryptographic Standards</h3>
          <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside mb-6">
            <li>Ed25519 elliptic curve signatures (same as Solana)</li>
            <li>Keys generated using cryptographically secure random number generation</li>
            <li>No custom cryptography - we use battle-tested libraries</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">On-Chain Security</h3>
          <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside mb-6">
            <li>Program deployed on Solana mainnet: <code className="bg-zinc-800 px-1 rounded">5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G</code></li>
            <li>Identity stored in Program Derived Addresses (PDAs)</li>
            <li>Only the wallet owner can modify their identity</li>
            <li>Verification fees go to treasury PDA, not a personal wallet</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">API Security</h3>
          <ul className="text-zinc-400 text-sm space-y-1 list-disc list-inside mb-6">
            <li>All API endpoints are read-only for public data</li>
            <li>Write operations require valid Solana wallet signatures</li>
            <li>Signature timestamps prevent replay attacks (5-minute window)</li>
            <li>Rate limiting on all endpoints</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">Questions?</h2>
          <p className="text-zinc-400 mb-4">
            If you have security concerns or discover a vulnerability, please reach out:
          </p>
          <div className="flex gap-4">
            <a href="https://x.com/saidinfra" target="_blank" className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 transition text-sm">
              @saidinfra on X
            </a>
            <a href="https://github.com/kaiclawd/said/issues" target="_blank" className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 transition text-sm">
              GitHub Issues
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
