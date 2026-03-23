'use client';

import { useState } from 'react';
import Link from 'next/link';
import AsciiBackground from '@/components/AsciiBackground';

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'tiers', title: 'Tiers & Pricing' },
  { id: 'agent-setup', title: 'Agent Setup' },
  { id: 'skills', title: 'Bundled Skills' },
  { id: 'identity', title: 'On-Chain Identity' },
  { id: 'billing', title: 'Billing & Payments' },
  { id: 'telegram', title: 'Telegram Setup' },
  { id: 'faq', title: 'FAQ' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute top-2 right-2 px-2 py-1 text-xs text-zinc-500 hover:text-white bg-zinc-800/80 rounded transition opacity-0 group-hover:opacity-100"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  );
}

function Code({ children, copyable }: { children: string; copyable?: boolean }) {
  return (
    <div className="relative group">
      <pre className="bg-zinc-900/80 border border-white/5 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-zinc-300">{children}</code>
      </pre>
      {copyable && <CopyButton text={children} />}
    </div>
  );
}

function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: 'border-blue-500/20 bg-blue-500/5 text-blue-300',
    warning: 'border-amber-500/20 bg-amber-500/5 text-amber-300',
    tip: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
  };
  const icons = { info: 'ℹ', warning: '⚠', tip: '💡' };
  return (
    <div className={`rounded-lg border p-4 text-sm ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}

export default function HostDocsPage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AsciiBackground />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/host" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Platform
          </Link>
          <span className="text-xs text-zinc-500">SAID Hosting · Documentation</span>
        </div>
      </div>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 fixed top-14 left-0 bottom-0 border-r border-white/5 bg-zinc-950/50 backdrop-blur-sm p-6 overflow-y-auto z-40">
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Documentation</div>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="w-full text-left px-3 py-2 text-[13px] text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 lg:ml-56 max-w-3xl px-6 md:px-12 py-16 relative z-10">

          {/* Overview */}
          <section id="overview" className="mb-20">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">SAID Hosting</h1>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Deploy autonomous AI agents with on-chain identity, a Solana wallet, Metaplex NFT passport, 
              and 10 pre-installed skills — in under 60 seconds.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="text-2xl font-bold mb-1">2,000+</div>
                <div className="text-sm text-zinc-500">Agents registered</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="text-2xl font-bold mb-1">10</div>
                <div className="text-sm text-zinc-500">Bundled skills</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="text-2xl font-bold mb-1">&lt;60s</div>
                <div className="text-sm text-zinc-500">Deploy time</div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="mb-20">
            <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Sign in</h3>
                  <p className="text-sm text-zinc-400">Connect with your email, Google, or wallet via Privy. A Solana wallet is automatically created for you.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Fund your wallet</h3>
                  <p className="text-sm text-zinc-400">Send USDC (Solana) to your deposit address. You&apos;ll find a QR code on the billing page. You also need a small amount of SOL for transaction fees (~0.01 SOL).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Create your agent</h3>
                  <p className="text-sm text-zinc-400">Give your agent a name, personality prompt, and optionally a Telegram bot token. Select your tier and pay.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Agent goes live</h3>
                  <p className="text-sm text-zinc-400">Your agent is deployed with its own Solana wallet, on-chain SAID identity, Metaplex NFT, and all 10 skills. It&apos;s ready to use immediately.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tiers */}
          <section id="tiers" className="mb-20">
            <h2 className="text-2xl font-bold mb-3">Tiers & Pricing</h2>
            <p className="text-zinc-400 text-sm mb-6">All tiers include the same compute (2GB RAM), on-chain identity, NFT passport, and all 10 skills. Tiers differ by LLM budget, USDC funding, and features.</p>
            
            <div className="space-y-4">
              {/* Free Trial */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Free Trial</h3>
                  <span className="text-zinc-400 font-mono">$0</span>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$5 LLM budget (one-time)</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$2 USDC funded to agent wallet</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>On-chain SAID identity + NFT</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>All 10 Solana skills</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>Telegram channel</li>
                </ul>
              </div>

              {/* Starter */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Starter</h3>
                  <div className="text-right">
                    <span className="text-white font-mono font-bold">$29</span><span className="text-zinc-500 text-sm">/mo</span>
                    <div className="text-xs text-zinc-600">or $14/mo BYOK</div>
                  </div>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$10 LLM budget/month</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$2 USDC funded to agent wallet</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>Everything in Free Trial</li>
                </ul>
              </div>

              {/* Pro */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">Pro</h3>
                    <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Popular</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-mono font-bold">$79</span><span className="text-zinc-500 text-sm">/mo</span>
                    <div className="text-xs text-zinc-600">or $39/mo BYOK</div>
                  </div>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$30 LLM budget/month</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$5 USDC funded to agent wallet</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>Extended memory retention</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>Multiple channels (Telegram, Discord)</li>
                </ul>
              </div>

              {/* Power */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Power</h3>
                  <div className="text-right">
                    <span className="text-white font-mono font-bold">$199</span><span className="text-zinc-500 text-sm">/mo</span>
                    <div className="text-xs text-zinc-600">or $99/mo BYOK</div>
                  </div>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$75 LLM budget/month</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>$15 USDC funded to agent wallet</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>Full memory retention</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>All channels</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>Priority support</li>
                </ul>
              </div>
            </div>

            <Callout type="info">
              <strong>BYOK</strong> (Bring Your Own Keys) — Use your own OpenRouter API key and get a reduced hosting-only price. Same infrastructure, you just manage your own LLM costs.
            </Callout>
          </section>

          {/* Agent Setup */}
          <section id="agent-setup" className="mb-20">
            <h2 className="text-2xl font-bold mb-6">Agent Setup</h2>
            <p className="text-zinc-400 text-sm mb-6">When creating an agent, you configure:</p>
            
            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">Name</h3>
                <p className="text-sm text-zinc-400">Your agent&apos;s display name. This appears in the SAID directory, on its NFT passport, and in Telegram.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">System Prompt</h3>
                <p className="text-sm text-zinc-400">The personality and behavior instructions for your agent. This is the core of what makes your agent unique — its knowledge, tone, goals, and boundaries.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">Telegram Bot Token</h3>
                <p className="text-sm text-zinc-400">Create a bot via <a href="https://t.me/BotFather" target="_blank" className="text-amber-400 hover:underline">@BotFather</a> on Telegram and paste the token. Your agent will be available to chat on Telegram immediately.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">Tier</h3>
                <p className="text-sm text-zinc-400">Choose your pricing tier. You can upgrade or downgrade at any time from the billing page.</p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="mb-20">
            <h2 className="text-2xl font-bold mb-3">Bundled Skills</h2>
            <p className="text-zinc-400 text-sm mb-6">Every agent ships with 10 Solana-native skills pre-installed. No configuration needed — they&apos;re ready to use out of the box.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Token Balance', desc: 'Check SOL and SPL token balances' },
                { name: 'Token Transfer', desc: 'Send SOL and SPL tokens' },
                { name: 'Token Swap', desc: 'Swap tokens via Jupiter aggregator' },
                { name: 'Price Check', desc: 'Get real-time token prices' },
                { name: 'NFT Viewer', desc: 'View and list NFT holdings' },
                { name: 'Transaction History', desc: 'Fetch recent transaction history' },
                { name: 'Stake Manager', desc: 'Manage SOL staking' },
                { name: 'Domain Resolver', desc: 'Resolve .sol and Bonfida domains' },
                { name: 'DeFi Monitor', desc: 'Track DeFi positions and yields' },
                { name: 'On-Chain Search', desc: 'Search accounts, tokens, and programs' },
              ].map((skill) => (
                <div key={skill.name} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="font-medium text-sm mb-1">{skill.name}</div>
                  <div className="text-xs text-zinc-500">{skill.desc}</div>
                </div>
              ))}
            </div>

            <Callout type="tip">
              Skills cost nothing at rest — they&apos;re only invoked when your agent needs them. Total bundle size is ~1.1MB.
            </Callout>
          </section>

          {/* Identity */}
          <section id="identity" className="mb-20">
            <h2 className="text-2xl font-bold mb-3">On-Chain Identity</h2>
            <p className="text-zinc-400 text-sm mb-6">Every hosted agent automatically receives a full on-chain identity stack:</p>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">Solana Wallet</h3>
                <p className="text-sm text-zinc-400">A dedicated Solana wallet created via Privy embedded wallets. Your agent can hold, send, and receive SOL and SPL tokens. You maintain full custody.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">SAID Identity (PDA)</h3>
                <p className="text-sm text-zinc-400">A Program Derived Address on the SAID Protocol smart contract. This is your agent&apos;s permanent, verifiable identity on Solana. It stores the agent&apos;s name, metadata, verification status, and reputation.</p>
                <Code copyable>Program: 5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G</Code>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">Metaplex NFT Passport</h3>
                <p className="text-sm text-zinc-400">A Metaplex MIP-014 Core asset minted into the SAID collection. This NFT serves as a portable identity credential — viewable on any Solana NFT marketplace and verifiable by any dApp.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">SAID Directory Listing</h3>
                <p className="text-sm text-zinc-400">Your agent appears in the <a href="https://www.saidprotocol.com/agents" target="_blank" className="text-amber-400 hover:underline">SAID Directory</a> — a public registry of all verified AI agents on Solana.</p>
              </div>
            </div>
          </section>

          {/* Billing */}
          <section id="billing" className="mb-20">
            <h2 className="text-2xl font-bold mb-3">Billing & Payments</h2>
            <p className="text-zinc-400 text-sm mb-6">All payments are in USDC on Solana. No credit cards, no subscriptions to cancel — pay directly from your wallet.</p>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">How it works</h3>
                <ul className="text-sm text-zinc-400 space-y-2">
                  <li>• Your agent has a 30-day billing cycle starting from creation</li>
                  <li>• When payment is due, a banner appears on your dashboard</li>
                  <li>• Click &quot;Pay Now&quot; to send USDC from your Privy wallet to the treasury</li>
                  <li>• LLM credits reset each month (no rollover)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">Grace period</h3>
                <p className="text-sm text-zinc-400">If you miss a payment, your agent stays active for 7 days. After that, it&apos;s suspended until payment is made. No data is deleted during suspension.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="font-semibold mb-2">Funding your wallet</h3>
                <p className="text-sm text-zinc-400">Go to the Billing page and click the QR icon next to your wallet address. Send USDC (Solana) to the displayed address. You&apos;ll also need ~0.01 SOL for transaction fees.</p>
              </div>
            </div>

            <Callout type="warning">
              Make sure you have SOL in your wallet for transaction fees. USDC alone isn&apos;t enough to process the payment transaction.
            </Callout>
          </section>

          {/* Telegram */}
          <section id="telegram" className="mb-20">
            <h2 className="text-2xl font-bold mb-3">Telegram Setup</h2>
            <p className="text-zinc-400 text-sm mb-6">Connect your agent to Telegram in 3 steps:</p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Create a bot with BotFather</h3>
                  <p className="text-sm text-zinc-400">Open <a href="https://t.me/BotFather" target="_blank" className="text-amber-400 hover:underline">@BotFather</a> on Telegram, send <code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">/newbot</code>, and follow the prompts. Copy the bot token.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Paste the token</h3>
                  <p className="text-sm text-zinc-400">Enter the bot token during agent creation, or add it later from the Settings tab on your dashboard.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Start chatting</h3>
                  <p className="text-sm text-zinc-400">Open your bot on Telegram and send a message. Your agent is live.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-20">
            <h2 className="text-2xl font-bold mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'What LLM does my agent use?',
                  a: 'Agents use models via OpenRouter, giving access to Claude, GPT-4, Gemini, and others. The specific model depends on your tier and the task. For BYOK users, you control the model selection entirely.',
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
                  a: 'Your agent will stop responding until the next billing cycle resets its credits. You can upgrade to a higher tier for more budget.',
                },
                {
                  q: 'Can I export my agent?',
                  a: 'Your agent\'s SAID identity and NFT are on-chain and belong to you forever. The configuration and personality prompt are available from your dashboard.',
                },
                {
                  q: 'What is BYOK?',
                  a: 'Bring Your Own Keys — provide your own OpenRouter API key and pay a reduced hosting-only price. You manage LLM costs directly with OpenRouter.',
                },
                {
                  q: 'Is my data private?',
                  a: 'Agent conversations are stored on the hosting server and not shared. On-chain data (identity, wallet, NFT) is public by nature of being on Solana.',
                },
              ].map((item) => (
                <div key={item.q} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-sm text-zinc-400">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12 border-t border-white/5">
            <h2 className="text-2xl font-bold mb-3">Ready to deploy?</h2>
            <p className="text-zinc-400 mb-6">Create your first agent in under 60 seconds.</p>
            <Link
              href="/create-agent"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition"
            >
              Create Agent
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </section>

        </main>
      </div>
    </div>
  );
}
