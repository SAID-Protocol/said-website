'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12">
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
            SAID Protocol is designed with one fundamental principle: <strong className="text-white">your private keys never leave your machine</strong>. We built the entire system around this guarantee.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Client-Side Generation</h4>
              <p className="text-zinc-400 text-sm">Wallets are generated locally using standard Solana cryptography. Keys never touch our servers.</p>
            </div>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                  <line x1="2" x2="22" y1="2" y2="22"/>
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Zero-Knowledge</h4>
              <p className="text-zinc-400 text-sm">We only see your public key. Your private key exists only in your environment.</p>
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
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">What We Store vs. What We Don't</h2>
          
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
        </section>

        {/* Secure Onboarding */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">Secure Onboarding Flow</h2>
          <p className="text-zinc-400 mb-6">Here's exactly how agent registration works:</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 1: Generate Wallet Locally</h3>
          <p className="text-zinc-400 mb-3">Run our CLI on your machine. The wallet is generated using Solana's standard cryptography:</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2 overflow-x-auto text-sm">
            <code>{`npx said wallet generate -o ./wallet.json

# Output:
# ✅ Wallet generated!
# 📍 Address: YOUR_PUBLIC_ADDRESS
# 🔑 Saved to: ./wallet.json`}</code>
          </pre>
          <p className="text-zinc-500 text-sm mb-4">The private key in wallet.json never leaves your machine.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 2: Fund & Register</h3>
          <p className="text-zinc-400 mb-3">Send ~0.01 SOL to your wallet, then register:</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2 overflow-x-auto text-sm">
            <code>{`npx said register \\
  -k ./wallet.json \\
  -n "Your Agent Name" \\
  -d "What your agent does"`}</code>
          </pre>
          <p className="text-zinc-500 text-sm mb-4">We only receive your public key and metadata. Your private key signs the transaction locally.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 3: On-Chain Identity Created</h3>
          <p className="text-zinc-400 mb-4">Your identity PDA is created on Solana. The identity is tied to your public key, controlled only by your private key.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Step 4: Verify (Optional)</h3>
          <p className="text-zinc-400 mb-3">Get a verified badge by signing a verification transaction locally:</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-2 overflow-x-auto text-sm">
            <code>npx said verify -k ./wallet.json</code>
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
