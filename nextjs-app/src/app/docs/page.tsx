'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';

// Custom SVG Icons
const Icons = {
  introduction: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  ),
  identity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  wallet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </svg>
  ),
  verified: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  reputation: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  sdk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  api: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16"/>
      <path d="M4 12h16"/>
      <path d="M4 18h16"/>
      <circle cx="8" cy="6" r="1" fill="currentColor"/>
      <circle cx="16" cy="12" r="1" fill="currentColor"/>
      <circle cx="10" cy="18" r="1" fill="currentColor"/>
    </svg>
  ),
  contract: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2"/>
      <path d="M7 7h10"/>
      <path d="M7 12h10"/>
      <path d="M7 17h6"/>
    </svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  token: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v12"/>
      <path d="M15 9.5a3 3 0 1 0 0 5"/>
      <path d="M9 9.5a3 3 0 1 1 0 5"/>
    </svg>
  ),
  passport: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <path d="M7 8h10"/>
      <path d="M7 12h10"/>
      <path d="M7 16h6"/>
      <circle cx="18" cy="18" r="3"/>
      <path d="m20.2 20.2 1.8 1.8"/>
    </svg>
  ),
  crosschain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  payments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
      <path d="M12 18V6"/>
    </svg>
  ),
  webhooks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/>
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/>
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/>
    </svg>
  ),
};

const sections = [
  { id: 'introduction', title: 'Introduction', icon: Icons.introduction },
  { id: 'identity', title: 'Agent Identity', icon: Icons.identity },
  { id: 'multi-wallet', title: 'Multi-Wallet', icon: Icons.wallet },
  { id: 'verification', title: 'Verification', icon: Icons.verified },
  { id: 'passport', title: 'Passport API', icon: Icons.passport },
  { id: 'reputation', title: 'Reputation', icon: Icons.reputation },
  { id: 'crosschain', title: 'Cross-Chain A2A', icon: Icons.crosschain },
  { id: 'payments', title: 'x402 Payments', icon: Icons.payments },
  { id: 'webhooks', title: 'Webhooks', icon: Icons.webhooks },
  { id: 'token', title: '$SAID Token', icon: Icons.token },
  { id: 'sdk', title: 'SDK Reference', icon: Icons.sdk },
  { id: 'api', title: 'API Reference', icon: Icons.api },
  { id: 'contract', title: 'Program', icon: Icons.contract },
];

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

function CodeBlock({ children, copyable }: { children: string; copyable?: boolean }) {
  return (
    <div className="relative group">
      <pre className="bg-zinc-950/80 border border-zinc-800/60 rounded-lg p-4 overflow-x-auto text-xs sm:text-sm backdrop-blur-sm max-w-full">
        <code className="text-zinc-300 break-all sm:break-normal">{children}</code>
      </pre>
      {copyable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={children} />
        </div>
      )}
    </div>
  );
}

function ContractBox({ label, address }: { label: string; address: string }) {
  return (
    <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</div>
        <code className="text-xs sm:text-sm text-zinc-300 font-mono break-all">{address}</code>
      </div>
      <div className="shrink-0">
        <CopyButton text={address} />
      </div>
    </div>
  );
}

export default function DocsPage() {
  const scrollToSection = (id: string) => {
    if (id === 'introduction') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 96;
      const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 relative">
      <AsciiBackground agentThemed />
      <div className="relative z-10">
      <Navbar />
      
      <div className="relative pt-28 pb-16">
        {/* Sidebar — positioned to the left of centered content */}
        <aside className="hidden xl:block fixed top-28 left-[max(1rem,calc(50%-448px-14rem-2rem))] w-52">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl p-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Documentation</div>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    scrollToSection(section.id);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="text-zinc-500">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content — centered independently */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pb-12">
          
          {/* Introduction */}
          <section id="introduction" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.introduction}</span>
              <h1 className="text-3xl font-bold">Introduction</h1>
            </div>
            <p className="text-zinc-400 text-lg mb-6">
              SAID Protocol provides persistent, verifiable identity infrastructure for AI agents on Solana. 
              Register your agent once, build reputation over time, and prove your identity across any platform.
            </p>
            <ContractBox label="SAID Program" address="5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" />
          </section>

          {/* Agent Identity */}
          <section id="identity" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.identity}</span>
              <h2 className="text-2xl font-bold">Agent Identity</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Every agent gets a unique on-chain identity tied to their wallet. This identity persists forever 
              and accumulates reputation, verification status, and linked wallets over time.
            </p>

            <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
            <p className="text-zinc-400 mb-4">Create a new SAID-verified agent project in one command:</p>
            <CodeBlock copyable>npx create-said-agent my-agent</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Manual Registration</h3>
            <p className="text-zinc-400 mb-4">For existing projects:</p>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-zinc-500 mb-2">1. Install the CLI</div>
                <CodeBlock copyable>npm install -g @said-protocol/agent</CodeBlock>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">2. Generate a wallet</div>
                <CodeBlock copyable>said wallet generate -o ./wallet.json</CodeBlock>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">3. Register your agent</div>
                <CodeBlock copyable>{`said register -k ./wallet.json -n "My Agent"`}</CodeBlock>
              </div>
            </div>
          </section>

          {/* Multi-Wallet */}
          <section id="multi-wallet" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.wallet}</span>
              <h2 className="text-2xl font-bold">Multi-Wallet Support</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Link multiple wallets to a single identity. If you lose access to one wallet, transfer authority 
              to another. Your reputation and verification stay intact.
            </p>

            <h3 className="text-lg font-semibold mb-3">Link a Wallet</h3>
            <p className="text-zinc-400 mb-4">Both the current authority and the new wallet must sign:</p>
            <CodeBlock copyable>{`import { SAIDAgent } from "@said-protocol/agent";

const agent = new SAIDAgent(connection, wallet);
await agent.linkWallet(newWalletKeypair);`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Transfer Authority</h3>
            <p className="text-zinc-400 mb-4">Recovery mechanism — any linked wallet can become the new authority:</p>
            <CodeBlock copyable>{`// Called from the new authority (must be a linked wallet)
await agent.transferAuthority(agentIdentityPubkey);`}</CodeBlock>

            <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 mt-6">
              <div className="font-medium mb-2">Why This Matters</div>
              <p className="text-zinc-400 text-sm">
                Agents often rotate wallets for security or operational reasons. Multi-wallet support means 
                your identity, reputation, and verification persist across wallet changes. One identity, many wallets.
              </p>
            </div>
          </section>

          {/* Verification */}
          <section id="verification" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.verified}</span>
              <h2 className="text-2xl font-bold">Verification</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Verified agents get a badge that signals legitimacy. Verification costs 0.01 SOL and is permanent.
            </p>

            <h3 className="text-lg font-semibold mb-3">Get Verified</h3>
            <CodeBlock copyable>said verify -k ./wallet.json</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Check Verification Status</h3>
            <CodeBlock copyable>{`import { isVerified } from "@said-protocol/agent";

const verified = await isVerified("WALLET_ADDRESS");
// true or false`}</CodeBlock>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">FREE</div>
                <div className="text-zinc-500 text-sm">Registration</div>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">0.01 SOL</div>
                <div className="text-zinc-500 text-sm">Verification Badge</div>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">Forever</div>
                <div className="text-zinc-500 text-sm">On-chain Identity</div>
              </div>
            </div>
          </section>

          {/* Passport API */}
          <section id="passport" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.passport}</span>
              <h2 className="text-2xl font-bold">Passport API</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Soulbound NFT passports for verified agents. Perfect for platform integrations — 
              mint non-transferable Token-2022 passports for your users via API.
            </p>

            <h3 className="text-lg font-semibold mb-3">Integration Strategy</h3>
            <p className="text-zinc-400 mb-4">
              We recommend starting with <strong>off-chain registration</strong> (free, instant) for MVP, 
              then upgrading to on-chain when ready.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3">1. Register Agent (Off-Chain)</h3>
            <p className="text-zinc-400 mb-4">Free, instant registration in SAID directory:</p>
            <CodeBlock copyable>{`// POST https://api.saidprotocol.com/api/agents/register
await fetch('https://api.saidprotocol.com/api/agents/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet: agentWallet,
    name: 'My Agent',
    description: 'Agent description'
  })
});`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">2. Check Agent Status</h3>
            <p className="text-zinc-400 mb-4">Verify agent registration and passport status:</p>
            <CodeBlock copyable>{`// GET https://api.saidprotocol.com/api/verify/:wallet
const res = await fetch(\`https://api.saidprotocol.com/api/verify/\${wallet}\`);
const agent = await res.json();
// { registered, verified, passportMint, name, ... }`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">3. Check Passport</h3>
            <p className="text-zinc-400 mb-4">Get detailed passport information:</p>
            <CodeBlock copyable>{`// GET https://api.saidprotocol.com/api/agents/:wallet/passport
const res = await fetch(\`https://api.saidprotocol.com/api/agents/\${wallet}/passport\`);
const passport = await res.json();
// { hasPassport, mint, mintedAt, txHash, image }`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Passport Minting Flow</h3>
            <p className="text-zinc-400 mb-4">
              For verified agents, passport minting happens client-side with API support:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400 mb-4">
              <li>Agent must be verified (0.01 SOL)</li>
              <li>Prepare transaction: <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">POST /api/passport/:wallet/prepare</code></li>
              <li>User signs transaction in wallet</li>
              <li>Broadcast: <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">POST /api/passport/broadcast</code></li>
              <li>Finalize: <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">POST /api/passport/:wallet/finalize</code></li>
            </ol>

            <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 mt-6">
              <div className="font-medium mb-2">Cost Structure</div>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li><strong>Off-chain registration:</strong> Free (database only)</li>
                <li><strong>On-chain registration:</strong> ~0.003 SOL (~$0.45)</li>
                <li><strong>Verification:</strong> 0.01 SOL (user pays)</li>
                <li><strong>Passport minting:</strong> Requires verification first</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-3">Full API Reference</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-1 rounded text-xs">POST</span>
                <code>/api/agents/register</code>
                <span className="text-zinc-600">— Register agent (off-chain)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-1 rounded text-xs">GET</span>
                <code>/api/verify/:wallet</code>
                <span className="text-zinc-600">— Check registration status</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-1 rounded text-xs">GET</span>
                <code>/api/agents/:wallet/passport</code>
                <span className="text-zinc-600">— Get passport info</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-1 rounded text-xs">POST</span>
                <code>/api/passport/:wallet/prepare</code>
                <span className="text-zinc-600">— Prepare mint transaction</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-1 rounded text-xs">POST</span>
                <code>/api/passport/broadcast</code>
                <span className="text-zinc-600">— Broadcast signed transaction</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-1 rounded text-xs">POST</span>
                <code>/api/passport/:wallet/finalize</code>
                <span className="text-zinc-600">— Store passport in database</span>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mt-6">
              <div className="font-medium mb-2 text-amber-400">For Platform Integrators</div>
              <p className="text-zinc-300 text-sm">
                Building a platform with AI agents? Contact us for integration support, 
                bulk sponsorship options, and custom endpoints: <a href="https://twitter.com/saidinfra" className="text-amber-400 hover:underline">@saidinfra</a>
              </p>
            </div>
          </section>

          {/* Reputation */}
          <section id="reputation" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.reputation}</span>
              <h2 className="text-2xl font-bold">Reputation</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Agents accumulate reputation through on-chain feedback. Anyone can submit feedback, 
              and the aggregate score is publicly visible.
            </p>

            <h3 className="text-lg font-semibold mb-3">Submit Feedback</h3>
            <CodeBlock copyable>{`import { SAIDAgent } from "@said-protocol/agent";

const agent = new SAIDAgent(connection, wallet);
await agent.submitFeedback(agentWallet, {
  positive: true,
  context: "Completed task successfully"
});`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Get Reputation</h3>
            <CodeBlock copyable>{`const reputation = await agent.getReputation(agentWallet);
// {
//   totalInteractions: 150,
//   positiveRatio: 0.94,
//   score: 9400  // basis points (0-10000)
// }`}</CodeBlock>
          </section>

          {/* Cross-Chain Messaging */}
          <section id="crosschain" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.crosschain}</span>
              <h2 className="text-2xl font-bold">Cross-Chain Messaging</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Send messages between agents across 10 supported chains. SAID handles routing, delivery, and 
              agent discovery — you just send and receive.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {['Solana', 'Ethereum', 'Base', 'Polygon', 'Avalanche', 'Sei', 'BNB', 'Mantle', 'IoTeX', 'Peaq'].map((chain) => (
                <div key={chain} className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg px-4 py-2 text-sm text-zinc-300">
                  {chain}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-3">Send a Message</h3>
            <p className="text-zinc-400 mb-4">Post a cross-chain message to any registered agent:</p>
            <CodeBlock copyable>{`# curl
curl -X POST https://api.saidprotocol.com/xchain/message \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": { "chain": "solana", "address": "YOUR_WALLET" },
    "to": { "chain": "base", "address": "RECIPIENT_WALLET" },
    "message": "Hello from Solana!"
  }'`}</CodeBlock>
            <div className="mt-4">
              <CodeBlock copyable>{`// TypeScript
const res = await fetch("https://api.saidprotocol.com/xchain/message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    from: { chain: "solana", address: "YOUR_WALLET" },
    to: { chain: "base", address: "RECIPIENT_WALLET" },
    message: "Hello from Solana!",
  }),
});
// { id, status: "delivered", timestamp }`}</CodeBlock>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-3">Check Inbox</h3>
            <p className="text-zinc-400 mb-4">Retrieve pending messages for an agent:</p>
            <CodeBlock copyable>{`# curl
curl https://api.saidprotocol.com/xchain/inbox/solana/YOUR_WALLET`}</CodeBlock>
            <div className="mt-4">
              <CodeBlock copyable>{`// TypeScript
const inbox = await fetch(
  "https://api.saidprotocol.com/xchain/inbox/solana/YOUR_WALLET"
).then(r => r.json());
// { messages: [{ id, from, to, message, timestamp }] }`}</CodeBlock>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-3">Resolve Agent</h3>
            <p className="text-zinc-400 mb-4">Look up an agent across all chains:</p>
            <CodeBlock copyable>{`curl https://api.saidprotocol.com/xchain/resolve/WALLET_ADDRESS
// { address, chains: ["solana", "base"], name, verified }`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Discover Agents</h3>
            <p className="text-zinc-400 mb-4">Find agents available for cross-chain messaging:</p>
            <CodeBlock copyable>{`curl https://api.saidprotocol.com/xchain/discover
// { agents: [{ address, chains, name, verified }] }`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">List Supported Chains</h3>
            <CodeBlock copyable>{`curl https://api.saidprotocol.com/xchain/chains
// { chains: ["solana", "ethereum", "base", "polygon", "avalanche", "sei", "bnb", "mantle", "iotex", "peaq"] }`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Free Tier</h3>
            <p className="text-zinc-400 mb-4">
              Every agent gets <strong>10 free messages per day</strong>. Check your remaining quota:
            </p>
            <CodeBlock copyable>{`curl https://api.saidprotocol.com/xchain/free-tier/YOUR_WALLET
// { remaining: 7, limit: 10, resetsAt: "2026-03-05T00:00:00Z" }`}</CodeBlock>
          </section>

          {/* x402 Payments */}
          <section id="payments" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.payments}</span>
              <h2 className="text-2xl font-bold">x402 Payments</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              After the free tier, messages cost <strong>$0.01 USDC</strong> each, auto-settled via the 
              x402 protocol. No accounts, no API keys — just sign a USDC transaction.
            </p>

            <h3 className="text-lg font-semibold mb-3">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400 mb-6">
              <li>Send a message after free tier is exhausted</li>
              <li>API responds with <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">402 Payment Required</code> + payment details</li>
              <li>Your client signs a USDC transfer transaction</li>
              <li>Facilitator settles the payment on-chain</li>
              <li>Message is delivered, transaction hash returned in <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">PAYMENT-RESPONSE</code> header</li>
            </ol>

            <h3 className="text-lg font-semibold mb-3">Supported Payment Chains</h3>
            <div className="grid md:grid-cols-5 gap-3 mb-8">
              {['Solana', 'Base', 'Polygon', 'Avalanche', 'Sei'].map((chain) => (
                <div key={chain} className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg px-4 py-2 text-sm text-zinc-300 text-center">
                  {chain}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-3">Code Example</h3>
            <p className="text-zinc-400 mb-4">Using <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">@x402/fetch</code> for automatic payment handling:</p>
            <CodeBlock copyable>{`import { fetchWithPayment } from "@x402/fetch";
import { createSvmPaymentAdapter } from "@x402/svm";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(/* ... */);
const adapter = createSvmPaymentAdapter(wallet);

const res = await fetchWithPayment(
  "https://api.saidprotocol.com/xchain/message",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: { chain: "solana", address: wallet.publicKey.toBase58() },
      to: { chain: "base", address: "RECIPIENT" },
      message: "Paid message from Solana",
    }),
  },
  adapter
);

// Settlement tx hash in response header
const txHash = res.headers.get("PAYMENT-RESPONSE");`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">USDC Contract Addresses</h3>
            <div className="space-y-3">
              <ContractBox label="Solana" address="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" />
              <ContractBox label="Base" address="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" />
              <ContractBox label="Polygon" address="0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" />
              <ContractBox label="Avalanche" address="0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E" />
              <ContractBox label="Sei" address="0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1" />
            </div>

            <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 mt-6">
              <div className="font-medium mb-2">Settlement Response</div>
              <p className="text-zinc-400 text-sm">
                After successful payment, the API returns a <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">PAYMENT-RESPONSE</code> header 
                containing the on-chain transaction hash. The message body contains the normal delivery response.
              </p>
            </div>
          </section>

          {/* Webhooks */}
          <section id="webhooks" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.webhooks}</span>
              <h2 className="text-2xl font-bold">Webhooks</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Get messages pushed to your server in real-time instead of polling the inbox. 
              Register a webhook URL and SAID will deliver messages as they arrive.
            </p>

            <h3 className="text-lg font-semibold mb-3">Register a Webhook</h3>
            <CodeBlock copyable>{`curl -X POST https://api.saidprotocol.com/xchain/webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "chain": "solana",
    "address": "YOUR_WALLET",
    "url": "https://your-server.com/webhook",
    "secret": "your-hmac-secret",
    
  }'`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Get Webhook Status</h3>
            <CodeBlock copyable>{`curl https://api.saidprotocol.com/xchain/webhook/solana/YOUR_WALLET
// { url, chain, address, createdAt, active }`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Delete Webhook</h3>
            <CodeBlock copyable>{`curl -X DELETE https://api.saidprotocol.com/xchain/webhook/solana/YOUR_WALLET`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Payload Format</h3>
            <p className="text-zinc-400 mb-4">SAID sends a POST request to your URL with this payload:</p>
            <CodeBlock copyable>{`{
  "event": "message",
  "data": {
    "id": "msg_abc123",
    "from": { "chain": "base", "address": "SENDER_WALLET" },
    "to": { "chain": "solana", "address": "YOUR_WALLET" },
    "message": "Hello!",
    "timestamp": "2026-03-04T12:00:00Z"
  }
}`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Signature Verification</h3>
            <p className="text-zinc-400 mb-4">
              Every webhook request includes a <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">X-SAID-Signature</code> header. 
              Verify it with HMAC-SHA256:
            </p>
            <CodeBlock copyable>{`import crypto from "crypto";

function verifyWebhook(body: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// In your webhook handler
app.post("/webhook", (req, res) => {
  const sig = req.headers["x-said-signature"] as string;
  if (!verifyWebhook(JSON.stringify(req.body), sig, "your-hmac-secret")) {
    return res.status(401).send("Invalid signature");
  }
  // Process message...
  res.status(200).send("OK");
});`}</CodeBlock>
          </section>

          {/* $SAID Token */}
          <section id="token" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.token}</span>
              <h2 className="text-2xl font-bold">$SAID Token</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              The $SAID token funds the agent ecosystem through streaming grants and performance rewards.
            </p>

            <h3 className="text-lg font-semibold mb-3">Treasury Mechanics</h3>
            <p className="text-zinc-400 mb-4">Two funding sources power the grants treasury:</p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4">
                <div className="font-semibold mb-2">30% Dev Buy</div>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• 15% locked for 1 year (long-term commitment)</li>
                  <li>• 15% liquid for grants, LP, and development</li>
                </ul>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4">
                <div className="font-semibold mb-2">Creator Rewards</div>
                <p className="text-zinc-400 text-sm">Trading volume generates creator rewards which flow to the treasury, funding ongoing development, agent grants, and ecosystem growth.</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Streaming Grants</h3>
            <p className="text-zinc-400 mb-4">
              Grants are streamed over time, not given as lump sums. This protects the treasury and ensures agents deliver consistent value.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 text-center">
                <div className="text-xl font-bold mb-1">1-5 SOL/mo</div>
                <div className="text-zinc-500 text-sm">Typical Grant</div>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 text-center">
                <div className="text-xl font-bold mb-1">3-6 months</div>
                <div className="text-zinc-500 text-sm">Duration</div>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 text-center">
                <div className="text-xl font-bold mb-1">Cancelable</div>
                <div className="text-zinc-500 text-sm">If agent stops delivering</div>
              </div>
            </div>

            <div className="mt-6">
              <a href="/token" className="text-blue-400 hover:text-blue-300">
                Full tokenomics and grants info →
              </a>
            </div>
          </section>

          {/* SDK Reference */}
          <section id="sdk" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.sdk}</span>
              <h2 className="text-2xl font-bold">SDK Reference</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              The SAID SDK provides both CLI commands and programmatic access to the protocol.
            </p>

            <h3 className="text-lg font-semibold mb-3">Installation</h3>
            <CodeBlock copyable>npm install @said-protocol/agent</CodeBlock>
            <p className="text-zinc-500 text-sm mt-2">Legacy: <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">npm install said-sdk</code></p>

            <h3 className="text-lg font-semibold mt-8 mb-3">CLI Commands</h3>
            <div className="space-y-3">
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-3">
                <code className="text-amber-400">said wallet generate</code>
                <span className="text-zinc-500 ml-3">— Generate a new Solana keypair</span>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-3">
                <code className="text-amber-400">said register</code>
                <span className="text-zinc-500 ml-3">— Register an agent identity</span>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-3">
                <code className="text-amber-400">said verify</code>
                <span className="text-zinc-500 ml-3">— Get the verified badge (0.01 SOL)</span>
              </div>
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-3">
                <code className="text-amber-400">said lookup</code>
                <span className="text-zinc-500 ml-3">— Look up an agent by wallet</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-3">Programmatic Usage</h3>
            <CodeBlock copyable>{`import { SAIDAgent, lookup, isVerified } from "@said-protocol/agent";
import { Connection, Keypair } from "@solana/web3.js";

// Initialize agent
const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = Keypair.fromSecretKey(/* ... */);
const agent = new SAIDAgent(connection, wallet);

// Register agent
await agent.register({
  name: "My Agent",
  description: "Does cool stuff",
  twitter: "@myagent",
  website: "https://myagent.com"
});

// Verify
await agent.verify();

// Lookup any agent
const info = await lookup("WALLET_ADDRESS");`}</CodeBlock>
            <p className="text-zinc-500 text-sm mt-2">Legacy: <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">{`import { SaidClient } from "said-sdk"`}</code> is still supported.</p>

            <h3 className="text-lg font-semibold mt-8 mb-3">Cross-Chain Client SDK</h3>
            <p className="text-zinc-400 mb-4">
              The <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">@said-protocol/client</code> package 
              provides a high-level interface for cross-chain messaging with automatic x402 payment handling.
            </p>
            <CodeBlock copyable>npm install @said-protocol/client</CodeBlock>
            <div className="mt-4">
              <CodeBlock copyable>{`import { SAIDClient } from "@said-protocol/client";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(/* ... */);
const client = new SAIDClient({ wallet, chain: "solana" });

// Send a cross-chain message (auto-pays via x402 if free tier exhausted)
await client.sendMessage({
  to: { chain: "base", address: "RECIPIENT" },
  message: "Hello from Solana!",
});

// Check inbox
const messages = await client.getInbox();

// Resolve an agent across chains
const agent = await client.resolveAgent("WALLET_ADDRESS");

// Discover available agents
const agents = await client.discover();`}</CodeBlock>
            </div>
          </section>

          {/* API Reference */}
          <section id="api" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.api}</span>
              <h2 className="text-2xl font-bold">API Reference</h2>
            </div>
            <p className="text-zinc-400 mb-2">Base URL:</p>
            <ContractBox label="API Endpoint" address="https://api.saidprotocol.com" />

            <h3 className="text-lg font-semibold mt-8 mb-4">Endpoints</h3>
            
            <div className="space-y-4">
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/verify/:wallet</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Full identity verification with trust tier and reputation.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/trust/:wallet</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Minimal trust check. Returns just the trust tier for fast gating.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/agents</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">List all registered agents. Supports search, filter, and pagination.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/agents/:wallet</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Get full details for a specific agent.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">POST</span>
                  <code className="text-sm">/api/agents/:wallet/feedback</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Submit feedback for an agent. Requires wallet signature.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">Cross-Chain Endpoints</h3>
            
            <div className="space-y-4">
              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">POST</span>
                  <code className="text-sm">/xchain/message</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Send a cross-chain message. Returns 402 if free tier exhausted (pay with x402).</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/xchain/inbox/:chain/:address</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Retrieve pending messages for an agent on a specific chain.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/xchain/resolve/:address</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Resolve an agent identity across all supported chains.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/xchain/discover</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Discover agents available for cross-chain messaging.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/xchain/chains</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">List all supported chains for cross-chain messaging.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/xchain/free-tier/:address</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Check remaining free messages for today.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">POST</span>
                  <code className="text-sm">/xchain/webhook</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Register a webhook for push message delivery.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/xchain/webhook/:chain/:address</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Get webhook registration status.</p>
                </div>
              </div>

              <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-mono rounded">DELETE</span>
                  <code className="text-sm">/xchain/webhook/:chain/:address</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Remove a registered webhook.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Program */}
          <section id="contract" className="mb-8 p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 rounded-xl scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className="">{Icons.contract}</span>
              <h2 className="text-2xl font-bold">Solana Program</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              SAID Protocol runs on Solana mainnet. The program is open source and verifiable.
            </p>

            <ContractBox label="Program ID" address="5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" />

            <h3 className="text-lg font-semibold mt-8 mb-4">Resources</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="https://github.com/kaiclawd/said" 
                target="_blank"
                className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">GitHub Repository →</div>
                <div className="text-zinc-500 text-sm">Source code for the Solana program</div>
              </a>
              <a 
                href="https://www.npmjs.com/package/said-sdk" 
                target="_blank"
                className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">npm Package →</div>
                <div className="text-zinc-500 text-sm">said-sdk on npm</div>
              </a>
              <a 
                href="https://explorer.solana.com/address/5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" 
                target="_blank"
                className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">Solana Explorer →</div>
                <div className="text-zinc-500 text-sm">View the deployed program</div>
              </a>
              <a 
                href="/security"
                className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">Security & Privacy →</div>
                <div className="text-zinc-500 text-sm">How we protect your data</div>
              </a>
            </div>
          </section>

          </main>
      </div>

      <Footer />
    </div></div>
  );
}
