'use client';

import { useState } from 'react';
import Link from 'next/link';
import HostNavbar from '@/components/HostNavbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';

// Icons
const Icons = {
  overview: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  ),
  start: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
    </svg>
  ),
  tiers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>
    </svg>
  ),
  agent: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  skills: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  identity: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  billing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </svg>
  ),
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  ),
  faq: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
    </svg>
  ),
  copy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

const sections = [
  { id: 'overview', title: 'Overview', icon: Icons.overview },
  { id: 'getting-started', title: 'Getting Started', icon: Icons.start },
  { id: 'tiers', title: 'Tiers & Pricing', icon: Icons.tiers },
  { id: 'agent-setup', title: 'Agent Setup', icon: Icons.agent },
  { id: 'skills', title: 'Bundled Skills', icon: Icons.skills },
  { id: 'identity', title: 'On-Chain Identity', icon: Icons.identity },
  { id: 'billing', title: 'Billing & Payments', icon: Icons.billing },
  { id: 'telegram', title: 'Telegram Setup', icon: Icons.telegram },
  { id: 'faq', title: 'FAQ', icon: Icons.faq },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
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

export default function HostDocsPage() {
  const scrollToSection = (id: string) => {
    if (id === 'overview') {
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
      <AsciiBackground />
      <HostNavbar />

      <div className="flex flex-1 relative z-10 pt-20">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 p-6 fixed top-[80px] left-0 bottom-0 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Hosting Docs</div>
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

          {/* Overview */}
          <section id="overview" className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.overview}</span>
              <h1 className="text-3xl font-bold">SAID Hosting</h1>
            </div>
            <p className="text-zinc-400 text-lg mb-6">
              Deploy autonomous AI agents with on-chain identity, a Solana wallet, Metaplex NFT passport, 
              and 10 pre-installed skills — in under 60 seconds.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">2,000+</div>
                <div className="text-zinc-500 text-sm">Agents registered</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">10</div>
                <div className="text-zinc-500 text-sm">Bundled skills</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">&lt;60s</div>
                <div className="text-zinc-500 text-sm">Deploy time</div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.start}</span>
              <h2 className="text-2xl font-bold">Getting Started</h2>
            </div>
            <p className="text-zinc-400 mb-6">Get your first agent running in four steps.</p>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-zinc-500 mb-2">1. Sign in</div>
                <p className="text-zinc-400 text-sm">Connect with your email, Google, or wallet via Privy. A Solana wallet is automatically created for you.</p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">2. Fund your wallet</div>
                <p className="text-zinc-400 text-sm">Send USDC (Solana) to your deposit address — find the QR code on your billing page. You&apos;ll also need ~0.01 SOL for transaction fees.</p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">3. Create your agent</div>
                <p className="text-zinc-400 text-sm">Give it a name, personality prompt, and optionally a Telegram bot token. Select your tier and pay.</p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">4. Agent goes live</div>
                <p className="text-zinc-400 text-sm">Your agent deploys with its own wallet, on-chain SAID identity, Metaplex NFT, and all 10 skills. Ready to use immediately.</p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mt-6">
              <div className="text-white font-medium mb-2">Free Trial</div>
              <p className="text-zinc-400 text-sm">
                Your first agent is free — no payment required. You get $5 in LLM credits and $2 USDC funded to your agent&apos;s wallet.
              </p>
            </div>
          </section>

          {/* Tiers & Pricing */}
          <section id="tiers" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.tiers}</span>
              <h2 className="text-2xl font-bold">Tiers & Pricing</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              All tiers include the same compute (2GB RAM), on-chain identity, NFT passport, and all 10 skills. 
              Tiers differ by LLM budget, USDC funding, and features.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-zinc-500 font-medium">Tier</th>
                    <th className="text-left py-3 px-4 text-zinc-500 font-medium">All-Inclusive</th>
                    <th className="text-left py-3 px-4 text-zinc-500 font-medium">BYOK</th>
                    <th className="text-left py-3 px-4 text-zinc-500 font-medium">LLM Budget</th>
                    <th className="text-left py-3 px-4 text-zinc-500 font-medium">Agent USDC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-3 px-4 font-medium">Free Trial</td>
                    <td className="py-3 px-4 text-zinc-400">$0</td>
                    <td className="py-3 px-4 text-zinc-400">—</td>
                    <td className="py-3 px-4 text-zinc-400">$5 (once)</td>
                    <td className="py-3 px-4 text-zinc-400">$2</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-3 px-4 font-medium">Starter</td>
                    <td className="py-3 px-4 text-zinc-400">$29/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$14/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$10/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$2</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 bg-amber-500/[0.03]">
                    <td className="py-3 px-4 font-medium">Pro <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-2">Popular</span></td>
                    <td className="py-3 px-4 text-zinc-400">$79/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$39/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$30/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$5</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Power</td>
                    <td className="py-3 px-4 text-zinc-400">$199/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$99/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$75/mo</td>
                    <td className="py-3 px-4 text-zinc-400">$15</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mt-6">
              <div className="text-white font-medium mb-2">What is BYOK?</div>
              <p className="text-zinc-400 text-sm">
                <strong>Bring Your Own Keys</strong> — provide your own OpenRouter API key and pay a reduced hosting-only price. 
                Same infrastructure, same skills, same identity. You just manage your own LLM costs directly with OpenRouter.
              </p>
            </div>
          </section>

          {/* Agent Setup */}
          <section id="agent-setup" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.agent}</span>
              <h2 className="text-2xl font-bold">Agent Setup</h2>
            </div>
            <p className="text-zinc-400 mb-6">When creating an agent, you configure:</p>

            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">Name</code>
                <span className="text-zinc-500 ml-3">— Display name in the SAID directory, on the NFT, and in Telegram</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">System Prompt</code>
                <span className="text-zinc-500 ml-3">— Personality, knowledge, goals, and boundaries for your agent</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">Telegram Bot Token</code>
                <span className="text-zinc-500 ml-3">— From <a href="https://t.me/BotFather" target="_blank" className="text-amber-400 hover:underline">@BotFather</a>. Optional — add later from Settings</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <code className="text-amber-400">Tier</code>
                <span className="text-zinc-500 ml-3">— Choose pricing tier. Upgrade or downgrade anytime from billing</span>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.skills}</span>
              <h2 className="text-2xl font-bold">Bundled Skills</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Every agent ships with 10 Solana-native skills pre-installed. No configuration needed — ready to use out of the box. 
              Skills cost nothing at rest and are only invoked when your agent needs them.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Token Balance', desc: 'Check SOL and SPL token balances for any wallet' },
                { name: 'Token Transfer', desc: 'Send SOL and SPL tokens to any address' },
                { name: 'Token Swap', desc: 'Swap tokens via Jupiter aggregator with best routing' },
                { name: 'Price Check', desc: 'Get real-time token prices from multiple sources' },
                { name: 'NFT Viewer', desc: 'View and list NFT holdings for any wallet' },
                { name: 'Transaction History', desc: 'Fetch and parse recent transaction history' },
                { name: 'Stake Manager', desc: 'Manage SOL staking and validator selection' },
                { name: 'Domain Resolver', desc: 'Resolve .sol and Bonfida domains to addresses' },
                { name: 'DeFi Monitor', desc: 'Track DeFi positions, yields, and LP balances' },
                { name: 'On-Chain Search', desc: 'Search accounts, tokens, and programs on Solana' },
              ].map((skill) => (
                <div key={skill.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <code className="text-amber-400">{skill.name}</code>
                  <span className="text-zinc-500 ml-3">— {skill.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* On-Chain Identity */}
          <section id="identity" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.identity}</span>
              <h2 className="text-2xl font-bold">On-Chain Identity</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              Every hosted agent automatically receives a full on-chain identity stack. This is what makes SAID agents different 
              from any other hosted agent — they exist on-chain, forever.
            </p>

            <h3 className="text-lg font-semibold mb-3">Solana Wallet</h3>
            <p className="text-zinc-400 mb-4 text-sm">
              A dedicated Solana wallet created via Privy embedded wallets. Your agent can hold, send, and receive 
              SOL and SPL tokens. You sign all transactions — we never have access to private keys.
            </p>

            <h3 className="text-lg font-semibold mt-8 mb-3">SAID Identity (PDA)</h3>
            <p className="text-zinc-400 mb-4 text-sm">
              A Program Derived Address on the SAID Protocol smart contract. This is your agent&apos;s permanent, 
              verifiable identity on Solana — storing name, metadata, verification status, and reputation score.
            </p>
            <ContractBox label="SAID Program" address="5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" />

            <h3 className="text-lg font-semibold mt-8 mb-3">Metaplex NFT Passport</h3>
            <p className="text-zinc-400 mb-4 text-sm">
              A Metaplex MIP-014 Core asset minted into the SAID collection. This NFT serves as a portable 
              identity credential — viewable on any Solana NFT marketplace and verifiable by any dApp.
            </p>
            <ContractBox label="Collection" address="2aJH9BhmiJ42V2kzs9CurTc7vPP9p9jeAVSt2GH1RVn8" />

            <h3 className="text-lg font-semibold mt-8 mb-3">Directory Listing</h3>
            <p className="text-zinc-400 text-sm">
              Your agent appears in the{' '}
              <a href="https://www.saidprotocol.com/agents" target="_blank" className="text-amber-400 hover:underline">SAID Directory</a>
              {' '}— a public registry of all verified AI agents on Solana.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">FREE</div>
                <div className="text-zinc-500 text-sm">Registration</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">Automatic</div>
                <div className="text-zinc-500 text-sm">NFT Mint</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">Forever</div>
                <div className="text-zinc-500 text-sm">On-chain Identity</div>
              </div>
            </div>
          </section>

          {/* Billing */}
          <section id="billing" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.billing}</span>
              <h2 className="text-2xl font-bold">Billing & Payments</h2>
            </div>
            <p className="text-zinc-400 mb-6">
              All payments are in USDC on Solana. No credit cards, no subscriptions to cancel — pay directly from your wallet.
            </p>

            <h3 className="text-lg font-semibold mb-3">How It Works</h3>
            <div className="space-y-4 mb-8">
              <div>
                <div className="text-sm text-zinc-500 mb-2">1. Billing cycle</div>
                <p className="text-zinc-400 text-sm">Each agent has a 30-day billing cycle starting from creation.</p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">2. Payment notification</div>
                <p className="text-zinc-400 text-sm">When payment is due, a banner appears on your dashboard with a &quot;Pay Now&quot; button.</p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">3. USDC transfer</div>
                <p className="text-zinc-400 text-sm">Click Pay Now to send USDC from your Privy wallet to the treasury. Transaction is user-signed.</p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">4. Credits reset</div>
                <p className="text-zinc-400 text-sm">LLM credits reset each billing cycle. No rollover.</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Grace Period</h3>
            <p className="text-zinc-400 mb-4 text-sm">
              If you miss a payment, your agent stays active for 7 days. After that, it&apos;s suspended until payment 
              is made. No data is deleted during suspension.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mt-6">
              <div className="text-white font-medium mb-2">⚠️ SOL Required for Fees</div>
              <p className="text-zinc-400 text-sm">
                USDC payments require a small amount of SOL (~0.01) in your wallet for Solana transaction fees. 
                USDC alone isn&apos;t enough to process the payment.
              </p>
            </div>

            <ContractBox label="Hosting Treasury" address="HUpEuDs3FC4T3xMZ3n8EGe16QLJFSnjbd1Kzh6C22YyP" />
          </section>

          {/* Telegram Setup */}
          <section id="telegram" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.telegram}</span>
              <h2 className="text-2xl font-bold">Telegram Setup</h2>
            </div>
            <p className="text-zinc-400 mb-6">Connect your agent to Telegram in three steps.</p>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-zinc-500 mb-2">1. Create a bot with BotFather</div>
                <p className="text-zinc-400 text-sm">
                  Open <a href="https://t.me/BotFather" target="_blank" className="text-amber-400 hover:underline">@BotFather</a> on Telegram, 
                  send <code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">/newbot</code>, follow the prompts, and copy the token.
                </p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">2. Add the token</div>
                <p className="text-zinc-400 text-sm">Enter the bot token during agent creation, or add it later from the Settings tab on your dashboard.</p>
              </div>
              <div>
                <div className="text-sm text-zinc-500 mb-2">3. Start chatting</div>
                <p className="text-zinc-400 text-sm">Open your bot on Telegram and send a message. Your agent is live.</p>
              </div>
            </div>

            <CodeBlock copyable>{`# BotFather conversation:
/newbot
> What name for your bot?
My SAID Agent
> Choose a username (must end in 'bot'):
my_said_agent_bot
> Done! Your token is: 123456789:ABCdefGHIjklMNOpqrSTUvwxyz`}</CodeBlock>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white">{Icons.faq}</span>
              <h2 className="text-2xl font-bold">FAQ</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: 'What LLM does my agent use?',
                  a: 'Agents use models via OpenRouter — Claude, GPT-4, Gemini, and others. The specific model depends on your tier and the task. BYOK users control model selection entirely.',
                },
                {
                  q: 'Can I run multiple agents?',
                  a: 'Yes. Each agent has its own billing cycle, wallet, and identity. Create as many as you need from the dashboard.',
                },
                {
                  q: 'Do I own my agent\'s wallet?',
                  a: 'Yes. Wallets are created via Privy embedded wallets. You sign all transactions — we never have access to your private keys.',
                },
                {
                  q: 'What happens if my agent runs out of LLM credits?',
                  a: 'Your agent stops responding until the next billing cycle resets its credits. Upgrade to a higher tier for more budget.',
                },
                {
                  q: 'Can I export my agent?',
                  a: 'Your agent\'s SAID identity and NFT are on-chain and belong to you forever. Configuration and personality prompt are available from your dashboard.',
                },
                {
                  q: 'Is my data private?',
                  a: 'Agent conversations are stored on the hosting server and not shared. On-chain data (identity, wallet, NFT) is public by nature of Solana.',
                },
                {
                  q: 'What chains are supported?',
                  a: 'SAID identities are on Solana mainnet. Agent wallets hold SOL and SPL tokens. All 10 bundled skills are Solana-native.',
                },
              ].map((item) => (
                <div key={item.q}>
                  <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                  <p className="text-zinc-400 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="mb-16 pt-8 border-t border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="https://www.saidprotocol.com/docs" target="_blank" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                <div className="font-semibold mb-1">Protocol Documentation →</div>
                <div className="text-zinc-500 text-sm">SDK, API reference, and program details</div>
              </a>
              <a href="https://www.saidprotocol.com/agents" target="_blank" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                <div className="font-semibold mb-1">Agent Directory →</div>
                <div className="text-zinc-500 text-sm">Browse all registered SAID agents</div>
              </a>
              <a href="https://github.com/kaiclawd/said" target="_blank" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                <div className="font-semibold mb-1">GitHub →</div>
                <div className="text-zinc-500 text-sm">Open source Solana program</div>
              </a>
              <a href="https://discord.gg/saidprotocol" target="_blank" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                <div className="font-semibold mb-1">Discord →</div>
                <div className="text-zinc-500 text-sm">Community and support</div>
              </a>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
