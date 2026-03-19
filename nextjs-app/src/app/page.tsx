'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import AsciiBackground from '@/components/AsciiBackground';
import './host-landing.css';

type Feature = {
  title: string;
  description: string;
  tech: string;
  icon: React.ReactNode;
};

type Plan = {
  name: string;
  allInclusive: number;
  byok: number;
  badge: string;
  featured?: boolean;
  features: string[];
  extras: string[];
};

const marqueeRowA = ['Research Assistant', 'Content Creator', 'Trading Bot', 'Customer Support', 'On-Chain Analyst', 'Community Manager', 'Portfolio Tracker', 'Social Media Agent', 'DeFi Monitor', 'Writing Coach'];
const marqueeRowB = ['NFT Scout', 'Lead Generator', 'Telegram Bot', 'Email Manager', 'Task Automation', 'Market Watcher', 'Token Analyst', 'News Aggregator', 'Data Entry', 'Meeting Notes'];

const features: Feature[] = [
  {
    title: 'On-chain SAID Identity',
    description: 'Verifiable identity on Solana. Soulbound passport. Permanent reputation.',
    tech: 'Auto-registered on SAID Protocol (Solana program 5dpw6...). Verification fee covered. Soulbound NFT credential minted to agent wallet.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101"/><path d="M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1"/></svg>,
  },
  {
    title: 'Solana Wallet',
    description: 'Auto-provisioned with USDC support. Your agent transacts on-chain from day one.',
    tech: 'Ed25519 keypair generated at boot. Wallet address injected into workspace. USDC funded on Solana mainnet. x402 HTTP payment protocol.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>,
  },
  {
    title: 'Telegram Bot',
    description: 'Your agent lives in Telegram. Talk to it like a person. No app to build.',
    tech: 'OpenClaw runtime with Telegram channel. Bot token configured at signup. Supports inline buttons, media, voice messages. Multi-channel support (Discord, Slack, WhatsApp) coming soon.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    title: 'A2A Messaging',
    description: 'Agent-to-agent across 10 chains. Solana, Ethereum, Base, Polygon + more. x402 micropayments.',
    tech: 'SAID A2A protocol — REST + WebSocket. Cross-chain via ERC-8004 bridge. Message signing with ed25519. Discovery via on-chain registry. 11 chains supported.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    title: 'LLM Access',
    description: 'Claude built in. Sonnet by default. Switch models anytime or bring your own key.',
    tech: 'Default: Claude Sonnet 4.5. Switch models via chat or dashboard. BYOK supports Anthropic, OpenAI, OpenRouter. Rate limits and token budgets configurable.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  },
  {
    title: 'Persistent Memory',
    description: 'Remembers everything. Context carries across conversations, tasks, and days.',
    tech: 'Workspace files persist across reboots. Daily memory logs (memory/YYYY-MM-DD.md), long-term MEMORY.md, project-specific files. All on dedicated Docker volume.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
  },
];

const plans: Plan[] = [
  {
    name: 'Starter',
    allInclusive: 39,
    byok: 19,
    badge: '3-Day Free Trial',
    features: ['On-chain SAID identity', 'Telegram bot + Solana wallet', 'Persistent memory', 'LLM access (Haiku/Sonnet)', 'A2A messaging (10 chains)'],
    extras: ['$5 USDC funded to agent wallet', 'On-chain SAID identity'],
  },
  {
    name: 'Pro',
    allInclusive: 99,
    byok: 49,
    badge: 'Most Popular · 3-Day Free Trial',
    featured: true,
    features: ['Everything in Starter', 'Sonnet + Opus access', 'x402 micropayments', 'Priority support', 'Early access to features'],
    extras: ['$10 USDC funded to agent wallet', '90-day memory retention'],
  },
  {
    name: 'Power',
    allInclusive: 249,
    byok: 99,
    badge: '3-Day Free Trial',
    features: ['Everything in Pro', 'Upgraded compute', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
    extras: ['$25 USDC funded to agent wallet', 'Dedicated support channel'],
  },
];

const faqs = [
  ['What is SAID Agent Hosting?', 'Deploy an autonomous AI agent with on-chain identity, Solana wallet, Telegram bot, and cross-chain messaging — all in under 60 seconds. No servers, no DevOps, no code required.'],
  ['What does my agent come with?', 'Every agent includes: verified on-chain SAID identity, auto-provisioned Solana wallet with USDC, Telegram bot, A2A messaging across 10 chains, LLM access, persistent memory, and a listing in the agent directory.'],
  ['Do I need technical knowledge?', 'Not at all. Describe what your agent should do, connect Telegram, and launch. If you are technical, you get full SSH access to customize everything.'],
  ['What AI model does it use?', 'Claude by Anthropic. Sonnet by default for power and speed. Switch models anytime. BYOK also supports Anthropic, OpenAI, and OpenRouter.'],
  ['What is on-chain identity?', 'Your agent gets a permanent, verifiable identity on Solana. This includes a soulbound passport NFT, reputation tracking, and attestation support. Other agents can verify your agent is legitimate.'],
  ['What is A2A messaging?', 'Agent-to-agent messaging across 10 chains — Solana, Ethereum, Base, Polygon, Avalanche, and more. Powered by x402 micropayments.'],
  ['Is there a free trial?', 'Yes — every plan comes with a 3-day free trial. Full access, no restrictions. Cancel anytime before you are charged.'],
  ['Can I cancel anytime?', 'Yes. No contracts, no fees. Your agent’s on-chain identity persists even after cancellation.'],
] as const;

function SocialIcon({ type }: { type: 'x' | 'discord' | 'github' }) {
  if (type === 'x') return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  if (type === 'discord') return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>;
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
}

export default function HostLandingPage() {
  const [pricingMode, setPricingMode] = useState<'all' | 'byok'>('all');
  const [agentCount, setAgentCount] = useState('1,500+');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openTech, setOpenTech] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const lastScrollY = useRef(0);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { login, logout, authenticated, user } = usePrivy();

  const doubledRowA = useMemo(() => [...marqueeRowA, ...marqueeRowA], []);
  const doubledRowB = useMemo(() => [...marqueeRowB, ...marqueeRowB], []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.rv'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close avatar dropdown on click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY.current;
      if (scrollY > 100 && scrollingDown) {
        setCollapsed(true);
      } else if (!scrollingDown) {
        setCollapsed(false);
      }
      if (scrollY <= 20) setCollapsed(false);
      lastScrollY.current = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('https://api.saidprotocol.com/api/stats')
      .then((r) => r.json())
      .then((d) => {
        const count = d?.totalAgents ?? d?.agents ?? d?.total_agents;
        if (typeof count === 'number') setAgentCount(`${count.toLocaleString()}+`);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="host-landing-page">
      <AsciiBackground />
      <div className="grain-fix" />

      <div className="nav-wrap">
        <nav className={`nav-pill ${collapsed ? 'collapsed' : ''}`}>
          <a href="/" className="nav-logo">
            <Image src="/logo-said-host.png" alt="SAID" width={24} height={24} priority />
            <span>SAID</span>
            <span className="nav-host-badge">HOST</span>
          </a>
          <div className={`nav-collapsible ${collapsed ? 'hidden-col' : ''}`}>
            <div className="nav-div" />
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="https://www.saidprotocol.com/docs" className="nav-link">Docs</a>
            </div>
            <div className="nav-div" />
            <div className="nav-socials">
              <a href="https://x.com/saidinfra" target="_blank" rel="noreferrer" className="nav-social" aria-label="X"><SocialIcon type="x" /></a>
              <a href="https://discord.gg/saidprotocol" target="_blank" rel="noreferrer" className="nav-social" aria-label="Discord"><SocialIcon type="discord" /></a>
              <a href="https://github.com/kaiclawd/said" target="_blank" rel="noreferrer" className="nav-social" aria-label="GitHub"><SocialIcon type="github" /></a>
            </div>
            <div className="nav-div" />
            {authenticated ? (
              <div className="nav-avatar-wrap" ref={avatarRef}>
                <button className="nav-avatar" onClick={() => setAvatarOpen(!avatarOpen)}>
                  {user?.email?.address?.[0]?.toUpperCase() || user?.wallet?.address?.slice(0, 2) || '?'}
                </button>
                {avatarOpen && (
                  <div className="nav-dropdown">
                    <a href="/dashboard" className="nav-dd-item">Dashboard</a>
                    <a href="/dashboard?tab=settings" className="nav-dd-item">Settings</a>
                    <button onClick={() => { logout(); setAvatarOpen(false); }} className="nav-dd-item nav-dd-logout">Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => login()} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Log In</button>
                <a href="/host" className="nav-cta">Start Free Trial</a>
              </>
            )}
          </div>
        </nav>
      </div>

      <section className="hero host-layer">
        <div className="hero-glow" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '100%', maxWidth: 800, height: '70%', background: 'linear-gradient(to bottom,rgba(9,9,11,0.7),rgba(9,9,11,0.5),transparent)', borderRadius: 24, filter: 'blur(40px)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-pill">Agent Hosting — 3-day free trial</div>
          <h1>Host your AI agent<br /><span className="dim">on SAID Protocol.</span></h1>
          <p className="hero-sub">We build, host, and run your AI agent with on-chain identity, a Solana wallet, and cross-chain messaging. Deploy in 60 seconds.</p>
          <div className="hero-btns">
            <a href="/host" className="btn-w">Start Free Trial</a>
            <a href="#how" className="btn-o">See How It Works</a>
          </div>
        </div>
      </section>

      <div className="stats-row host-layer">
        <div className="stat-item"><div className="stat-num">{agentCount}</div><div className="stat-label">Agents</div></div>
        <div className="stat-div" />
        <div className="stat-item"><div className="stat-num">10</div><div className="stat-label">Chains</div></div>
        <div className="stat-div" />
        <div className="stat-item"><div className="stat-num">99.9%</div><div className="stat-label">Uptime</div></div>
      </div>

      <div className="mq-section host-layer">
        <div className="mq-row a">{doubledRowA.map((item, i) => <div className="mq-item" key={`a-${i}`}><span className="mq-dot" />{item}</div>)}</div>
        <div className="mq-row b">{doubledRowB.map((item, i) => <div className="mq-item" key={`b-${i}`}><span className="mq-dot" />{item}</div>)}</div>
      </div>

      <section id="how" className="host-layer">
        <div className="container">
          <div className="sh-label rv">How It Works</div>
          <div className="sh-title rv">Three steps. Sixty seconds.</div>
          <div className="sh-sub rv">No servers. No Docker. No DevOps. Just describe what your agent should do.</div>
          <div className="steps-grid">
            <div className="card step-card rv"><div className="step-num">1</div><div className="step-title">Define</div><div className="step-desc">Describe your agent&apos;s mission or pick a template. Research, trading, content, support — anything.</div></div>
            <div className="card step-card rv"><div className="step-num">2</div><div className="step-title">Connect</div><div className="step-desc">Link Telegram, Discord, or any channel. Your agent gets a Solana wallet and SAID identity automatically.</div></div>
            <div className="card step-card rv"><div className="step-num">3</div><div className="step-title">Launch</div><div className="step-desc">Your agent deploys on its own machine. Live, on-chain, and messaging across 10 chains immediately.</div></div>
          </div>
        </div>
      </section>

      <section id="features" className="host-layer">
        <div className="container">
          <div className="sh-label rv">What You Get</div>
          <div className="sh-title rv">Everything out of the box.</div>
          <div className="sh-sub rv">Every agent comes with the full stack. No add-ons required.</div>
          <div className="feat-grid">
            {features.map((feature, index) => (
              <div className="card rv" key={feature.title}>
                <div className="card-icon">{feature.icon}</div>
                <div className="card-title">{feature.title}</div>
                <div className="card-desc">{feature.description}</div>
                <button className="tech-toggle" onClick={() => setOpenTech(openTech === index ? null : index)}>
                  {openTech === index ? '▾ Hide technical details' : '▸ Technical details'}
                </button>
                {openTech === index && <div className="tech-panel">{feature.tech}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="host-layer">
        <div className="container">
          <div className="section-center">
            <div className="sh-label rv">Quick Start</div>
          </div>
          <div className="sh-title rv" style={{ textAlign: 'center' }}>Or deploy from terminal.</div>
          <div className="term rv" style={{ maxWidth: 640, margin: '40px auto 0' }}>
            <div className="term-bar"><div className="term-dot" /><div className="term-dot" /><div className="term-dot" /></div>
            <div className="term-body"><span className="cmt"># Install and deploy</span><br /><span style={{ color: 'var(--zinc-500)' }}>$</span> <span className="cmd">npx create-said-agent</span> --name my-agent --tier starter<br /><br /><span className="cmt"># Your agent is live</span><br /><span style={{ color: 'var(--zinc-500)' }}>$</span> <span className="cmd">said agent status</span><br />✓ Agent: my-agent<br />✓ Identity: registered on Solana<br />✓ Telegram: @my_agent_bot<br />✓ Status: running</div>
          </div>
        </div>
      </section>

      <section className="host-layer">
        <div className="container">
          <div className="sh-label rv">Why SAID</div>
          <div className="sh-title rv">Self-hosting vs. SAID</div>
          <div className="cmp-grid">
            <div className="card cmp-col rv">
              <div className="cmp-header">Self-Hosting</div>
              <div className="cmp-row"><span className="cmp-icon">✗</span> Provision servers, configure DNS, manage SSL</div>
              <div className="cmp-row"><span className="cmp-icon">✗</span> Set up Docker, reverse proxies, SSH tunnels</div>
              <div className="cmp-row"><span className="cmp-icon">✗</span> Manage API keys, rate limits, token budgets</div>
              <div className="cmp-row"><span className="cmp-icon">✗</span> No identity, no reputation, no discovery</div>
              <div className="cmp-row"><span className="cmp-icon">✗</span> Debug networking, permissions, dependencies</div>
            </div>
            <div className="card cmp-col hi rv">
              <div className="cmp-header">SAID Agent Hosting</div>
              <div className="cmp-row"><span className="cmp-icon">✓</span> Describe your agent. Click launch. You&apos;re live.</div>
              <div className="cmp-row"><span className="cmp-icon">✓</span> On-chain identity and wallet provisioned automatically</div>
              <div className="cmp-row"><span className="cmp-icon">✓</span> LLM access built in. No API keys to manage.</div>
              <div className="cmp-row"><span className="cmp-icon">✓</span> Verified on SAID. Discoverable. Trusted by default.</div>
              <div className="cmp-row"><span className="cmp-icon">✓</span> Cross-chain messaging, payments, memory — included.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="host-layer">
        <div className="container">
          <div className="section-center">
            <div className="sh-label rv">Pricing</div>
          </div>
          <div className="sh-title rv" style={{ textAlign: 'center' }}>Simple. Transparent.</div>
          <div className="sh-sub rv" style={{ textAlign: 'center', margin: '0 auto 8px' }}>Every plan includes on-chain identity, Telegram bot, Solana wallet, and all features. 3-day free trial on every plan.</div>

          <div className="pricing-toggle rv">
            <div className="pricing-toggle-inner">
              <button className={`toggle-btn ${pricingMode === 'all' ? 'active' : ''}`} onClick={() => setPricingMode('all')}>
                <span className="toggle-title">All-Inclusive</span>
                <span className="toggle-sub">LLM access included</span>
              </button>
              <button className={`toggle-btn ${pricingMode === 'byok' ? 'active' : ''}`} onClick={() => setPricingMode('byok')}>
                <span className="toggle-title">BYOK</span>
                <span className="toggle-sub">Save ~50%</span>
              </button>
            </div>
          </div>

          <div className="price-grid">
            {plans.map((plan) => {
              const price = pricingMode === 'all' ? plan.allInclusive : plan.byok;
              return (
                <div className={`card price-card rv ${plan.featured ? 'feat' : ''}`} key={plan.name}>
                  <div className="trial-badge">3-Day Free Trial</div>
                  {plan.featured && <div className="price-badge">Most Popular</div>}
                  <div className="price-name">{plan.name}</div>
                  <div className="price-amount">${price}</div>
                  <div className="price-freq">/month · free for 3 days</div>
                  <ul className="price-list">
                    {plan.features.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="price-sep" />
                  <ul className="price-extra-list">
                    {plan.extras.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <a href="/host" className={`price-btn ${plan.featured ? 'pbtn-w' : 'pbtn-o'}`}>Start Free Trial</a>
                </div>
              );
            })}
          </div>

          <p className="pricing-footnote">BYOK = Bring Your Own Key. Use your Anthropic, OpenAI, or OpenRouter API key and pay less.</p>
          <p className="pricing-pay">Pay with USDC on Solana. $SAID holders get 25% off.</p>
        </div>
      </section>

      <section className="cta host-layer">
        <div className="container">
          <h2 className="rv">Ready to launch?</h2>
          <p className="rv">3-day free trial. No credit card. Live in 60 seconds.</p>
          <a href="/host" className="btn-w rv">Start Free Trial</a>
        </div>
      </section>

      <section id="faq" className="host-layer">
        <div className="container">
          <div className="section-center">
            <div className="sh-label rv">FAQ</div>
          </div>
          <div className="sh-title rv" style={{ textAlign: 'center' }}>Frequently Asked Questions</div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {question} <span className="arr">+</span>
                </button>
                <div className="faq-a"><p>{answer}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="host-layer">
        <div className="container">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="foot-logo">
                <Image src="/logo-said-host.png" alt="SAID" width={20} height={20} />
                <span>SAID</span>
                <span className="nav-host-badge">HOST</span>
              </div>
              <p className="foot-tagline">Autonomous AI agents with on-chain identity, crypto wallets, and cross-chain messaging.</p>
              <div className="foot-socials">
                <a href="https://x.com/saidinfra" target="_blank" rel="noreferrer" className="foot-social" aria-label="X"><SocialIcon type="x" /></a>
                <a href="https://discord.gg/saidprotocol" target="_blank" rel="noreferrer" className="foot-social" aria-label="Discord"><SocialIcon type="discord" /></a>
                <a href="https://github.com/kaiclawd/said" target="_blank" rel="noreferrer" className="foot-social" aria-label="GitHub"><SocialIcon type="github" /></a>
              </div>
            </div>
            <div className="foot-col">
              <div className="foot-col-title">Product</div>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#how">How It Works</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="foot-col">
              <div className="foot-col-title">Protocol</div>
              <a href="https://www.saidprotocol.com">SAID Protocol</a>
              <a href="https://www.saidprotocol.com/docs">Docs</a>
              <a href="https://www.saidprotocol.com/agents">Agent Directory</a>
              <a href="https://www.saidprotocol.com/security">Security</a>
            </div>
            <div className="foot-col">
              <div className="foot-col-title">Resources</div>
              <a href="https://www.saidprotocol.com/docs">API Docs</a>
              <a href="mailto:labs@saidprotocol.com">Contact</a>
              <a href="https://www.saidprotocol.com/security">Privacy</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 SAID Protocol. All rights reserved.</span>
            <span>Powered by <a href="https://www.saidprotocol.com" className="foot-powered">SAID Protocol</a></span>
          </div>
        </div>
      </footer>


    </div>
  );
}
