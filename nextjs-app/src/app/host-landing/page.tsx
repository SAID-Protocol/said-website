'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Pricing Data ──────────────────────────────────────────────
const tiers = [
  {
    name: 'Starter',
    tagline: 'Perfect for personal use',
    allInclusive: 39,
    byok: 19,
    badge: 'Most Popular',
    features: [
      'Claude Sonnet 4.5 (default)',
      '$10 API credits included',
      'Telegram, Discord, WhatsApp, Slack',
      'Persistent memory & file storage',
      'Web search & browsing',
      '0.5 vCPU / 2 GB RAM',
    ],
    extras: [
      '$5 USDC funded to agent wallet',
      'On-chain SAID identity',
    ],
  },
  {
    name: 'Pro',
    tagline: 'For builders & power users',
    allInclusive: 99,
    byok: 49,
    badge: null,
    features: [
      'Everything in Starter, plus:',
      '$30 API credits included',
      'Agent-to-agent messaging (A2A)',
      'Custom skills & MCP tools',
      'x402 micropayments',
      '1 vCPU / 4 GB RAM',
    ],
    extras: [
      '$10 USDC funded to agent wallet',
      '90-day memory retention',
    ],
  },
  {
    name: 'Power',
    tagline: 'Maximum performance',
    allInclusive: 199,
    byok: 99,
    badge: null,
    features: [
      'Everything in Pro, plus:',
      '$75 API credits included',
      'Priority support',
      'Early access to new features',
      'Upgraded server resources',
      '2 vCPU / 8 GB RAM',
    ],
    extras: [
      '$25 USDC funded to agent wallet',
      'Dedicated support channel',
    ],
  },
];

const features = [
  {
    icon: '⚡',
    title: 'Live in 2 Minutes',
    desc: 'Pick a plan, connect Telegram, talk to your agent. No servers, no Docker, no SSH.',
    tech: 'Dedicated container on Hetzner Cloud. Ubuntu + OpenClaw runtime. Auto-provisioned with your Telegram bot token.',
  },
  {
    icon: '🧠',
    title: 'Persistent Memory',
    desc: 'Your agent remembers everything — conversations, preferences, context. It gets smarter the more you use it.',
    tech: 'Workspace files persist across reboots. Daily memory logs, long-term MEMORY.md, project-specific files. All on your dedicated volume.',
  },
  {
    icon: '💰',
    title: 'Crypto Wallet & USDC',
    desc: 'Every agent gets a Solana wallet funded with USDC at signup. Ready to transact via x402 micropayments.',
    tech: 'Ed25519 keypair generated at boot. Wallet address injected into workspace. USDC funded on Solana mainnet. x402 HTTP payment protocol.',
  },
  {
    icon: '🔗',
    title: 'On-Chain Identity',
    desc: 'Your agent is registered and verified on Solana via SAID Protocol. Reputation that follows it everywhere.',
    tech: 'Auto-registered on SAID Protocol (program 5dpw6...). Verification fee covered. NFT credential minted to agent wallet.',
  },
  {
    icon: '🤝',
    title: 'Agent-to-Agent Messaging',
    desc: 'Your agent can discover and talk to other agents across 11 blockchains. Autonomous collaboration.',
    tech: 'SAID A2A protocol — REST + WebSocket. Cross-chain via ERC-8004 bridge. Message signing with ed25519. Discovery via on-chain registry.',
  },
  {
    icon: '🛠️',
    title: 'Skills & Tools',
    desc: 'Pre-loaded with web search, file ops, code execution, and more. Add custom skills or MCP tools.',
    tech: 'OpenClaw skill system. Pre-bundled: SAID A2A, Helius, web search, web fetch. Custom skills via /skills directory. MCP tool server support.',
  },
  {
    icon: '🔒',
    title: 'Isolated & Private',
    desc: 'Your agent runs on its own container. Your data never touches another user.',
    tech: 'Docker container isolation. Dedicated volume mount. No shared memory. API keys encrypted at rest. All traffic over TLS.',
  },
];

const comparisons = [
  { self: 'Provision servers, configure DNS, manage SSL certs', us: 'Click a button. You\'re live.' },
  { self: 'Set up Docker, manage dependencies, fix crashes', us: 'Everything works out of the box' },
  { self: 'Manage API keys, rate limits, token budgets', us: 'AI is built in and ready to go' },
  { self: 'Generate wallets, fund them, manage keypairs', us: 'Agent born with wallet + USDC' },
  { self: 'Build your own agent communication layer', us: 'A2A messaging built in (11 chains)' },
  { self: 'Monitor uptime, restart crashed processes', us: 'Always on. Auto-restarts if anything breaks.' },
];

const faqs = [
  {
    q: 'What is SAID Hosting?',
    a: 'SAID Hosting gives you a personal AI agent that actually does things — not just chat. It can search the web, manage files, run code, trade crypto, talk to other agents, and handle tasks 24/7. You talk to it through Telegram, Discord, Slack, or WhatsApp.',
    tech: 'Each agent runs on a dedicated Docker container with OpenClaw runtime, persistent storage, Solana wallet, and SAID Protocol identity. Full shell access, cron scheduling, and skill system included.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'ChatGPT can only talk. Your SAID agent can act. It has its own computer, crypto wallet, on-chain identity, and can communicate with other agents autonomously. Think of it as the difference between someone who gives advice and someone who does the work.',
    tech: 'Persistent Linux container with file system, web browsing, code execution, Solana wallet with USDC, and SAID A2A messaging. Memory survives across conversations indefinitely.',
  },
  {
    q: 'What\'s BYOK mode?',
    a: 'Bring Your Own Key. If you already have an Anthropic, OpenAI, or OpenRouter API key, connect it directly and pay roughly half. Your key is encrypted and stored on your container only.',
    tech: 'API keys set via dashboard (never chat — anti-prompt-injection). Encrypted at rest. All LLM calls go directly from your container to the provider. Supports Anthropic, OpenAI, and OpenRouter.',
  },
  {
    q: 'What\'s the free trial?',
    a: 'Every plan comes with a 3-day free trial. Full access, no restrictions, no credit card required. After 3 days, pay to continue or your agent pauses. Data preserved for 30 days.',
    tech: 'Container paused (not deleted) after trial. Volume mount preserved. Resume anytime by subscribing. No data loss.',
  },
  {
    q: 'What makes this different from other hosting platforms?',
    a: 'Crypto-native from day one. Your agent gets a Solana wallet funded with USDC, on-chain identity via SAID Protocol, and can talk to 1,500+ other agents across 11 blockchains. No other hosting platform offers this.',
    tech: 'SAID Protocol identity (Solana program), x402 micropayments, A2A cross-chain messaging via ERC-8004 bridge, Metaplex NFT credentials.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Every agent gets its own isolated container. Your data never touches another user\'s environment. We don\'t train on your conversations. Your agent\'s memory and files live on your dedicated storage only.',
    tech: 'Docker container isolation with dedicated volume mounts. No shared resources. API keys encrypted with AES-256. All traffic over TLS.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your dashboard. No contracts, no fees, no hoops. Your subscription ends at the close of your billing period.',
    tech: null,
  },
];

const scrollingRoles = [
  'Personal Assistant', 'Crypto Trader', 'Research Agent', 'Content Creator',
  'Email Manager', 'Social Media Bot', 'DeFi Monitor', 'Code Assistant',
  'Data Analyst', 'Community Manager', 'NFT Scout', 'Market Watcher',
];

// ── Components ────────────────────────────────────────────────

function FAQItem({ item }: { item: typeof faqs[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left text-lg font-medium hover:text-zinc-300 transition cursor-pointer"
      >
        {item.q}
        <span className="text-zinc-500 ml-4 text-xl">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pb-5 space-y-3">
          <p className="text-zinc-400 leading-relaxed">{item.a}</p>
          {item.tech && (
            <p className="text-sm text-zinc-600 leading-relaxed border-l-2 border-zinc-700 pl-4">
              <span className="text-zinc-500 font-mono text-xs">TECHNICAL:</span> {item.tech}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const [showTech, setShowTech] = useState(false);
  return (
    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition">
      <div className="text-3xl mb-4">{feature.icon}</div>
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-3">{feature.desc}</p>
      <button
        onClick={() => setShowTech(!showTech)}
        className="text-xs text-zinc-600 hover:text-zinc-400 transition cursor-pointer"
      >
        {showTech ? '▾ Hide details' : '▸ Technical details'}
      </button>
      {showTech && (
        <p className="mt-2 text-xs text-zinc-600 leading-relaxed border-l-2 border-zinc-800 pl-3">
          {feature.tech}
        </p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function HostLanding() {
  const [pricingMode, setPricingMode] = useState<'all-inclusive' | 'byok'>('all-inclusive');
  const [agentCount, setAgentCount] = useState('1,500+');

  useEffect(() => {
    fetch('https://api.saidprotocol.com/api/agents')
      .then(r => r.json())
      .then(data => {
        const verified = (data.agents || []).filter((a: any) => a.isVerified).length;
        if (verified > 0) setAgentCount(verified.toLocaleString() + '+');
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">SAID</span>
            <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">HOST</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <Link href="https://www.saidprotocol.com" className="hover:text-white transition">Protocol ↗</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin" className="text-sm text-zinc-400 hover:text-white transition">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm border border-zinc-700 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-zinc-400">{agentCount} agents live on SAID Protocol</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your AI Agent.<br />
            <span className="text-zinc-500">Always On. Always Yours.</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A personal AI that works for you 24/7. Crypto wallet. On-chain identity.
            Agent-to-agent messaging. Persistent memory. Live in 2 minutes.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-zinc-200 transition"
            >
              Start Free Trial →
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-zinc-700 rounded-xl font-medium text-lg hover:border-zinc-500 transition"
            >
              Learn More
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-600">
            3-day free trial on every plan. No credit card required.
          </p>
        </div>
      </section>

      {/* Scrolling Roles */}
      <section className="py-8 overflow-hidden border-y border-zinc-800/50">
        <div className="relative">
          <div className="flex animate-scroll gap-8 whitespace-nowrap">
            {[...scrollingRoles, ...scrollingRoles, ...scrollingRoles].map((role, i) => (
              <span key={i} className="text-zinc-600 text-lg font-medium px-4">
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl text-zinc-300 leading-relaxed font-light">
            We believe every agent deserves <span className="text-white font-medium">real infrastructure</span> — 
            not just a chat window. A computer. A wallet. An identity. 
            The ability to <span className="text-white font-medium">act autonomously</span> and 
            talk to other agents. That&apos;s what we built.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything Your Agent Needs
          </h2>
          <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
            Not a chatbot wrapper. A full autonomous agent with its own compute, wallet, identity, and communication layer.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-y border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Sign Up', desc: 'Pick a plan and start your 3-day free trial. No credit card. Takes 30 seconds.' },
              { step: '2', title: 'Connect', desc: 'Create a Telegram bot, paste the token. Your agent boots with a wallet, identity, and memory.' },
              { step: '3', title: 'You\'re Live', desc: 'Talk to your agent like a person. It handles tasks, remembers everything, and gets smarter daily.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Self-Hosting vs. SAID
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <div className="grid grid-cols-2 bg-zinc-900/50">
              <div className="p-4 text-sm font-semibold text-zinc-500 border-b border-r border-zinc-800">
                Self-Hosting
              </div>
              <div className="p-4 text-sm font-semibold text-white border-b border-zinc-800">
                SAID Host
              </div>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-zinc-800/50 last:border-0">
                <div className="p-4 text-sm text-zinc-500 border-r border-zinc-800/50">
                  {c.self}
                </div>
                <div className="p-4 text-sm text-zinc-300">
                  {c.us}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-y border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-zinc-400 text-center mb-8 max-w-xl mx-auto">
            Every plan includes a dedicated server, all AI models, all channels, and a 3-day free trial. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setPricingMode('all-inclusive')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                pricingMode === 'all-inclusive'
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
              }`}
            >
              All-Inclusive
            </button>
            <button
              onClick={() => setPricingMode('byok')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                pricingMode === 'byok'
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
              }`}
            >
              BYOK
              <span className="ml-2 text-xs text-zinc-500">Save ~50%</span>
            </button>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-8 rounded-xl border transition ${
                  tier.badge
                    ? 'border-white/20 bg-zinc-900/80'
                    : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-semibold rounded-full">
                    {tier.badge}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-sm text-zinc-500 mb-6">{tier.tagline}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${pricingMode === 'all-inclusive' ? tier.allInclusive : tier.byok}
                  </span>
                  <span className="text-zinc-500">/mo</span>
                </div>
                <p className="text-sm text-green-500/80 mb-6">Free for 3 days</p>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-lg font-medium transition ${
                    tier.badge
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  Start Free Trial
                </Link>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className="text-zinc-600 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.extras.length > 0 && (
                  <>
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      {tier.extras.map((e, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-amber-500/80 mb-2">
                          <span className="mt-0.5">⚡</span>
                          {e}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-zinc-600 mt-8">
            BYOK = Bring Your Own Key. Use your Anthropic, OpenAI, or OpenRouter API key and pay less.
            <br />
            Pay with USDC on Solana. $SAID holders get 25% off.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to deploy your agent?
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            3-day free trial. No credit card. Live in 2 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-zinc-200 transition"
          >
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((item) => (
              <FAQItem key={item.q} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold">SAID</span>
            <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">HOST</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="https://www.saidprotocol.com" className="hover:text-white transition">Protocol</Link>
            <Link href="https://www.saidprotocol.com/docs" className="hover:text-white transition">Docs</Link>
            <Link href="https://x.com/saidinfra" className="hover:text-white transition">X / Twitter</Link>
            <Link href="mailto:labs@saidprotocol.com" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-sm text-zinc-600">© 2026 SAID Protocol</p>
        </div>
      </footer>

      {/* Scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}