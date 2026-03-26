'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import AsciiBackground from '@/components/AsciiBackground';
import HostNavbar from '@/components/HostNavbar';
import HostFooter from '@/components/HostFooter';
import './host-landing.css';

type Feature = {
  title: string;
  description: string;
  tech: string;
  icon: React.ReactNode;
};

type Plan = {
  name: string;
  tier: string;
  allInclusive: number;
  byok: number;
  badge: string;
  featured?: boolean;
  features: string[];
  byokFeatures?: string[];
  extras: string[];
  byokExtras?: string[];
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
    tier: 'starter',
    allInclusive: 29,
    byok: 14,
    badge: '3-Day Free Trial',
    features: [
      'Dedicated agent container',
      '$10/mo API credits (Haiku)',
      'Telegram channel',
      'SAID identity + Solana wallet',
      'A2A messaging (10 chains)',
      'Persistent workspace',
      '7-day memory retention',
    ],
    byokFeatures: [
      'Dedicated agent container',
      'Bring your own API key',
      'Telegram channel',
      'SAID identity + Solana wallet',
      'A2A messaging (10 chains)',
      'Persistent workspace',
      '7-day memory retention',
    ],
    extras: ['$2 USDC funded at signup', 'Email support'],
    byokExtras: ['$2 USDC funded at signup', 'Email support', 'Anthropic / OpenAI / OpenRouter'],
  },
  {
    name: 'Pro',
    tier: 'pro',
    allInclusive: 79,
    byok: 39,
    badge: 'Most Popular · 3-Day Free Trial',
    featured: true,
    features: [
      'Dedicated agent container',
      '$30/mo API credits (Haiku + Sonnet)',
      'Telegram + Discord',
      'Browser automation',
      'Code execution',
      '30-day memory retention',
      'x402 micropayments',
    ],
    byokFeatures: [
      'Dedicated agent container',
      'Bring your own API key',
      'Telegram + Discord',
      'Browser automation',
      'Code execution',
      '30-day memory retention',
      'x402 micropayments',
    ],
    extras: ['$5 USDC funded at signup', 'Priority support'],
    byokExtras: ['$5 USDC funded at signup', 'Priority support', 'Anthropic / OpenAI / OpenRouter'],
  },
  {
    name: 'Power',
    tier: 'power',
    allInclusive: 199,
    byok: 99,
    badge: '3-Day Free Trial',
    features: [
      'Dedicated agent container',
      '$75/mo API credits (All models + Opus)',
      'All channels + API access',
      'Browser automation',
      'Full code execution',
      '90-day memory retention',
      'x402 micropayments',
    ],
    byokFeatures: [
      'Dedicated agent container',
      'Bring your own API key',
      'All channels + API access',
      'Browser automation',
      'Full code execution',
      '90-day memory retention',
      'x402 micropayments',
    ],
    extras: ['$15 USDC funded at signup', 'Dedicated support channel'],
    byokExtras: ['$15 USDC funded at signup', 'Dedicated support channel', 'Anthropic / OpenAI / OpenRouter'],
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

export default function HostLandingPage() {
  const [pricingMode, setPricingMode] = useState<'all' | 'byok'>('all');
  const [agentCount, setAgentCount] = useState('1,500+');
  const [trialsRemaining, setTrialsRemaining] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openTech, setOpenTech] = useState<number | null>(null);
  // Nav state moved to HostNavbar component
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

  // Fetch live agent count from protocol API
  useEffect(() => {
    fetch('https://api.saidprotocol.com/api/stats')
      .then(r => r.json())
      .then(data => {
        if (data.totalAgents) {
          const rounded = Math.floor(data.totalAgents / 50) * 50;
          setAgentCount(rounded.toLocaleString() + '+');
        }
      })
      .catch(() => {});
    
    // Fetch trials remaining from hosting API
    fetch('https://app.saidprotocol.com/api/stats')
      .then(r => r.json())
      .then(data => {
        if (typeof data.trialsRemaining === 'number') {
          setTrialsRemaining(data.trialsRemaining);
        }
      })
      .catch(() => {});
  }, []);

  // Avatar dropdown click-outside moved to HostNavbar

  // Scroll collapse moved to HostNavbar

  return (
    <div className="host-landing-page">
      <AsciiBackground />
      <div className="grain-fix" />

      <HostNavbar />

      <section className="hero host-layer">
        <div className="hero-glow" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '100%', maxWidth: 800, height: '70%', background: 'linear-gradient(to bottom,rgba(9,9,11,0.7),rgba(9,9,11,0.5),transparent)', borderRadius: 24, filter: 'blur(40px)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-pill">
            {trialsRemaining !== null 
              ? (trialsRemaining === 0 ? 'Free trials sold out' : `${trialsRemaining} free trials remaining`)
              : 'Agent Hosting — free trial'}
          </div>
          <h1>Host your AI agent<br /><span className="dim">on SAID Protocol.</span></h1>
          <p className="hero-sub">We build, host, and run your AI agent with on-chain identity, a Solana wallet, and cross-chain messaging. Deploy in 60 seconds.</p>
          <div className="hero-btns">
            <a href="#pricing" className="btn-w">Start Free Trial</a>
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

      {/* Terminal Quick Start section — commented out for hosting site, CLI lives in docs
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
      */}

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
          <div className="sh-title rv" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', marginBottom: '8px' }}>Simple. Transparent.</div>
          <div className="sh-sub rv" style={{ textAlign: 'center', margin: '0 auto 4px', fontSize: '15px' }}>All plans include SAID identity, Solana wallet, and A2A messaging. 3-day free trial.</div>

          <div className="pricing-toggle rv">
            <div className="pricing-toggle-inner" id="pricing-toggle">
              <div
                className="toggle-pill"
                style={{
                  left: pricingMode === 'all' ? '3px' : '50%',
                  width: 'calc(50% - 3px)',
                }}
              />
              <button className={`toggle-btn ${pricingMode === 'all' ? 'active' : ''}`} onClick={() => setPricingMode('all')}>
                <span className="toggle-title">All-Inclusive</span>
              </button>
              <button className={`toggle-btn ${pricingMode === 'byok' ? 'active' : ''}`} onClick={() => setPricingMode('byok')}>
                <span className="toggle-title">BYOK</span>
              </button>
            </div>
          </div>

          <div className="price-grid">
            {plans.map((plan) => {
              const price = pricingMode === 'all' ? plan.allInclusive : plan.byok;
              const features = pricingMode === 'byok' && plan.byokFeatures ? plan.byokFeatures : plan.features;
              const extras = pricingMode === 'byok' && plan.byokExtras ? plan.byokExtras : plan.extras;
              return (
                <div className={`card price-card rv ${plan.featured ? 'feat' : ''}`} key={plan.name}>
                  <div className="trial-badge" style={trialsRemaining === 0 ? { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' } : {}}>
                    {trialsRemaining === 0 ? 'Sold Out' : '3-Day Free Trial'}
                  </div>
                  {plan.featured && <div className="price-badge">Most Popular</div>}
                  <div className="price-name">{plan.name}</div>
                  <div className="price-amount">${price}</div>
                  <div className="price-freq">/month · free for 3 days</div>
                  <ul className="price-list">
                    {features.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="price-sep" />
                  <ul className="price-extra-list">
                    {extras.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  {trialsRemaining !== null && trialsRemaining === 0 ? (
                    <button disabled className="price-btn pbtn-disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Trials Sold Out
                    </button>
                  ) : (
                    <a href={`/host?tier=${plan.tier}`} className={`price-btn ${plan.featured ? 'pbtn-w' : 'pbtn-o'}`}>
                      Start Free Trial
                    </a>
                  )}
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
          <a href="#pricing" className="btn-w rv">Start Free Trial</a>
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

      <HostFooter />


    </div>
  );
}
