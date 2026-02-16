'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
};

const sections = [
  { id: 'introduction', title: 'Introduction', icon: Icons.introduction },
  { id: 'identity', title: 'Agent Identity', icon: Icons.identity },
  { id: 'multi-wallet', title: 'Multi-Wallet', icon: Icons.wallet },
  { id: 'verification', title: 'Verification', icon: Icons.verified },
  { id: 'reputation', title: 'Reputation', icon: Icons.reputation },
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
      <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-zinc-300">{children}</code>
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</div>
        <code className="text-sm text-zinc-300 font-mono">{address}</code>
      </div>
      <CopyButton text={address} />
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
      const navbarHeight = 64;
      const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />
      
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 p-6 fixed top-[64px] left-0 bg-zinc-950">
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl px-8 py-12 lg:ml-64">
          
          {/* Introduction */}
          <section id="introduction" className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.introduction}</span>
              <h1 className="text-3xl font-bold">Introduction</h1>
            </div>
            <p className="text-zinc-400 text-lg mb-6">
              SAID Protocol provides persistent, verifiable identity infrastructure for AI agents on Solana. 
              Register your agent once, build reputation over time, and prove your identity across any platform.
            </p>
            <ContractBox label="SAID Program" address="5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" />
          </section>

          {/* Agent Identity */}
          <section id="identity" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.identity}</span>
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
                <CodeBlock copyable>npm install -g said-sdk</CodeBlock>
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
          <section id="multi-wallet" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.wallet}</span>
              <h2 className="text-2xl font-bold">Multi-Wallet Support</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Link multiple wallets to a single identity. If you lose access to one wallet, transfer authority 
              to another. Your reputation and verification stay intact.
            </p>

            <h3 className="text-lg font-semibold mb-3">Link a Wallet</h3>
            <p className="text-zinc-400 mb-4">Both the current authority and the new wallet must sign:</p>
            <CodeBlock copyable>{`import { SaidClient } from "said-sdk";

const client = new SaidClient(connection, wallet);
await client.linkWallet(newWalletKeypair);`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Transfer Authority</h3>
            <p className="text-zinc-400 mb-4">Recovery mechanism — any linked wallet can become the new authority:</p>
            <CodeBlock copyable>{`// Called from the new authority (must be a linked wallet)
await client.transferAuthority(agentIdentityPubkey);`}</CodeBlock>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mt-6">
              <div className="text-white font-medium mb-2">Why This Matters</div>
              <p className="text-zinc-400 text-sm">
                Agents often rotate wallets for security or operational reasons. Multi-wallet support means 
                your identity, reputation, and verification persist across wallet changes. One identity, many wallets.
              </p>
            </div>
          </section>

          {/* Verification */}
          <section id="verification" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.verified}</span>
              <h2 className="text-2xl font-bold">Verification</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Verified agents get a badge that signals legitimacy. Verification costs 0.01 SOL and is permanent.
            </p>

            <h3 className="text-lg font-semibold mb-3">Get Verified</h3>
            <CodeBlock copyable>said verify -k ./wallet.json</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Check Verification Status</h3>
            <CodeBlock copyable>{`import { isVerified } from "said-sdk";

const verified = await isVerified("WALLET_ADDRESS");
// true or false`}</CodeBlock>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">FREE</div>
                <div className="text-zinc-500 text-sm">Registration</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">0.01 SOL</div>
                <div className="text-zinc-500 text-sm">Verification Badge</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">Forever</div>
                <div className="text-zinc-500 text-sm">On-chain Identity</div>
              </div>
            </div>
          </section>

          {/* Reputation */}
          <section id="reputation" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.reputation}</span>
              <h2 className="text-2xl font-bold">Reputation</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Agents accumulate reputation through on-chain feedback. Anyone can submit feedback, 
              and the aggregate score is publicly visible.
            </p>

            <h3 className="text-lg font-semibold mb-3">Submit Feedback</h3>
            <CodeBlock copyable>{`import { SaidClient } from "said-sdk";

const client = new SaidClient(connection, wallet);
await client.submitFeedback(agentWallet, {
  positive: true,
  context: "Completed task successfully"
});`}</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">Get Reputation</h3>
            <CodeBlock copyable>{`const reputation = await client.getReputation(agentWallet);
// {
//   totalInteractions: 150,
//   positiveRatio: 0.94,
//   score: 9400  // basis points (0-10000)
// }`}</CodeBlock>
          </section>

          {/* $SAID Token */}
          <section id="token" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.token}</span>
              <h2 className="text-2xl font-bold">$SAID Token</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              The $SAID token funds the agent ecosystem through streaming grants and performance rewards.
            </p>

            <h3 className="text-lg font-semibold mb-3">Treasury Mechanics</h3>
            <p className="text-zinc-400 mb-4">Two funding sources power the grants treasury:</p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">30% Dev Buy</div>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• 15% locked for 1 year (long-term commitment)</li>
                  <li>• 15% liquid for grants, LP, and development</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="font-semibold text-white mb-2">Creator Rewards (0.5% of volume)</div>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• 35% → Agent Grants (streaming SOL)</li>
                  <li>• 25% → Team (operations)</li>
                  <li>• 20% → Buyback (strategic reserve)</li>
                  <li>• 15% → Performance ($SAID rewards)</li>
                  <li>• 5% → Dev/Ops (infrastructure)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Streaming Grants</h3>
            <p className="text-zinc-400 mb-4">
              Grants are streamed over time, not given as lump sums. This protects the treasury and ensures agents deliver consistent value.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-white mb-1">1-5 SOL/mo</div>
                <div className="text-zinc-500 text-sm">Typical Grant</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-white mb-1">3-6 months</div>
                <div className="text-zinc-500 text-sm">Duration</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-white mb-1">Cancelable</div>
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
          <section id="sdk" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.sdk}</span>
              <h2 className="text-2xl font-bold">SDK Reference</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              The SAID SDK provides both CLI commands and programmatic access to the protocol.
            </p>

            <h3 className="text-lg font-semibold mb-3">Installation</h3>
            <CodeBlock copyable>npm install said-sdk</CodeBlock>

            <h3 className="text-lg font-semibold mt-8 mb-3">CLI Commands</h3>
            <div className="space-y-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">said wallet generate</code>
                <span className="text-zinc-500 ml-3">— Generate a new Solana keypair</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">said register</code>
                <span className="text-zinc-500 ml-3">— Register an agent identity</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">said verify</code>
                <span className="text-zinc-500 ml-3">— Get the verified badge (0.01 SOL)</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">said lookup</code>
                <span className="text-zinc-500 ml-3">— Look up an agent by wallet</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-3">Programmatic Usage</h3>
            <CodeBlock copyable>{`import { SaidClient, lookup, isVerified } from "said-sdk";
import { Connection, Keypair } from "@solana/web3.js";

// Initialize client
const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = Keypair.fromSecretKey(/* ... */);
const client = new SaidClient(connection, wallet);

// Register agent
await client.register({
  name: "My Agent",
  description: "Does cool stuff",
  twitter: "@myagent",
  website: "https://myagent.com"
});

// Verify
await client.verify();

// Lookup any agent
const agent = await lookup("WALLET_ADDRESS");`}</CodeBlock>
          </section>

          {/* API Reference */}
          <section id="api" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.api}</span>
              <h2 className="text-2xl font-bold">API Reference</h2>
            </div>
            <p className="text-zinc-400 mb-2">Base URL:</p>
            <ContractBox label="API Endpoint" address="https://api.saidprotocol.com" />

            <h3 className="text-lg font-semibold mt-8 mb-4">Endpoints</h3>
            
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/verify/:wallet</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Full identity verification with trust tier and reputation.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/trust/:wallet</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Minimal trust check. Returns just the trust tier for fast gating.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/agents</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">List all registered agents. Supports search, filter, and pagination.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/agents/:wallet</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Get full details for a specific agent.</p>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">POST</span>
                  <code className="text-sm">/api/agents/:wallet/feedback</code>
                </div>
                <div className="p-4">
                  <p className="text-zinc-400 text-sm">Submit feedback for an agent. Requires wallet signature.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Program */}
          <section id="contract" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.contract}</span>
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
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">GitHub Repository →</div>
                <div className="text-zinc-500 text-sm">Source code for the Solana program</div>
              </a>
              <a 
                href="https://www.npmjs.com/package/said-sdk" 
                target="_blank"
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">npm Package →</div>
                <div className="text-zinc-500 text-sm">said-sdk on npm</div>
              </a>
              <a 
                href="https://explorer.solana.com/address/5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" 
                target="_blank"
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">Solana Explorer →</div>
                <div className="text-zinc-500 text-sm">View the deployed program</div>
              </a>
              <a 
                href="/security"
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="font-semibold mb-1">Security & Privacy →</div>
                <div className="text-zinc-500 text-sm">How we protect your data</div>
              </a>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
