'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';
import ReputationAnalytics from '@/components/ReputationAnalytics';
import CopyButton from '@/components/CopyButton';

interface TrustScore {
  score: number;
  tier: string;
  sources?: string[];
  badges?: string[];
  identity: number;
  activity: number;
  economic: number;
  ecosystem: number;
  longevity: number;
  fairscale: number;
  computedAt?: string;
}

interface Agent {
  wallet: string;
  name: string;
  description: string;
  isVerified: boolean;
  registeredAt: string;
  lastActivity?: string;
  lastActiveAt?: string;
  twitter?: string;
  website?: string;
  image?: string;
  skills?: string[];
  reputationScore: number;
  feedbackCount: number;
  pda?: string;
  trustScore?: TrustScore | null;
  registrationSource?: string | null;
  mcpEndpoint?: string | null;
  a2aEndpoint?: string | null;
  serviceTypes?: string[];
  activityCount?: number;
  metadataUri?: string | null;
}

interface LeaderboardEntry {
  wallet: string;
  rank: number;
  reputationScore: number;
}

interface SourcePlatform {
  key: string;
  label: string;
  icon: string;
  href?: string;
}

function matchSource(agent: Agent): SourcePlatform | null {
  const src = agent.registrationSource ?? '';
  const desc = agent.description ?? '';
  if (src === 'spawnr') return { key: 'spawnr', label: 'Spawnr', icon: '/platforms/spawnr.png', href: 'https://spawnr.io' };
  if (src === 'clawpump' || desc.includes('clawpump.tech')) return { key: 'clawpump', label: 'Claw Pump', icon: '/clawpump-logo.png', href: 'https://clawpump.tech' };
  if (src === 'said-hosting' || desc.includes('said-hosting') || desc.includes('host.saidprotocol')) return { key: 'said-hosting', label: 'SAID Hosted', icon: '/platforms/said-hosting.png', href: 'https://host.saidprotocol.com' };
  const web = agent.website ?? '';
  if (src === 'xona-orbit' || web.includes('orbit-agents.com') || web.includes('xona-agent.com') || web.includes('xona-orbit')) return { key: 'xona-orbit', label: 'Xona Orbit', icon: '/platforms/xona-orbit.png', href: 'https://xona-agent.com' };
  if (src === 'atelier' || desc.includes('atelier')) return { key: 'atelier', label: 'Atelier', icon: '/platforms/atelier.jpg' };
  return null;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  platinum: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30', label: 'Platinum' },
  gold: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30', label: 'Gold' },
  silver: { bg: 'bg-zinc-400/10', text: 'text-zinc-200', border: 'border-zinc-400/30', label: 'Silver' },
  bronze: { bg: 'bg-orange-600/10', text: 'text-orange-300', border: 'border-orange-600/30', label: 'Bronze' },
  unverified: { bg: 'bg-zinc-700/10', text: 'text-zinc-500', border: 'border-zinc-700/30', label: 'Unverified' },
};

type Tab = 'overview' | 'feedback' | 'identity';

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '—';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

function formatAbsolute(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

function isActive(lastActivity?: string): boolean {
  if (!lastActivity) return false;
  return Date.now() - new Date(lastActivity).getTime() < 7 * 24 * 60 * 60 * 1000;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AsciiBackground agentThemed />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
}

export default function AgentPage() {
  const params = useParams();
  const wallet = params.wallet as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    if (!wallet) return;
    let cancelled = false;
    fetch(`/api/agents/${wallet}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Agent not found'))))
      .then((data) => {
        if (cancelled) return;
        setAgent(data.agent || data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load agent');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Look up rank on the all-time leaderboard. Only meaningful if the agent
    // is high enough to be in the top N.
    fetch('/api/leaderboard?limit=200')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const lb: LeaderboardEntry[] = data.leaderboard ?? [];
        const entry = lb.find((e) => e.wallet === wallet);
        if (entry) setRank(entry.rank);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [wallet]);

  if (loading) {
    return (
      <Shell>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
            <p className="mt-4 text-zinc-400">Loading agent...</p>
          </div>
        </main>
      </Shell>
    );
  }

  if (error || !agent) {
    return (
      <Shell>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto mb-4 text-zinc-600" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
            <p className="text-zinc-400 mb-6">This agent doesn&apos;t exist or hasn&apos;t been registered yet.</p>
            <Link href="/agents" className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition">
              Browse Directory
            </Link>
          </div>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 w-full">
        {/* Top row: identity on the left, Trust Score as the hero on the right */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HeaderSection agent={agent} />
            <StatusBadgesRow agent={agent} rank={rank} />
          </div>
          <aside className="lg:col-span-1">
            <TrustScoreCard score={agent.trustScore ?? null} />
          </aside>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-4">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <TabBar
              activeTab={activeTab}
              onChange={setActiveTab}
              feedbackCount={agent.feedbackCount || 0}
            />
            {activeTab === 'overview' && <OverviewTab agent={agent} />}
            {activeTab === 'feedback' && <FeedbackTab agent={agent} />}
            {activeTab === 'identity' && <IdentityTab agent={agent} />}
          </div>

          {/* Sidebar — offset down on desktop so the cards align with the tab
              content (below the tab-underline divider), not the tab row itself. */}
          <aside className="lg:col-span-1 space-y-6 lg:mt-16">
            <OnChainIdentityCard agent={agent} />
            <EmbedBadgeCard agent={agent} />
          </aside>
        </div>
      </main>
    </Shell>
  );
}

function HeaderSection({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
      <img
        src={agent.image || `https://api.saidprotocol.com/api/avatar/${agent.wallet}.svg`}
        alt={agent.name || 'Agent'}
        className="w-20 h-20 rounded-2xl flex-shrink-0 object-cover bg-zinc-900"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">{agent.name || 'Unnamed Agent'}</h1>
          {agent.isVerified && (
            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-sm rounded-full flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <p className="text-zinc-400 mb-4 max-w-2xl">{agent.description || 'No description provided'}</p>
        <div className="flex flex-wrap gap-3">
          {agent.twitter && (
            <a
              href={`https://twitter.com/${agent.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:border-zinc-600 transition flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="truncate">{agent.twitter}</span>
            </a>
          )}
          {agent.website && (
            <a
              href={agent.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:border-zinc-600 transition flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Website
            </a>
          )}
          <SourceBadge agent={agent} />
        </div>
      </div>
    </div>
  );
}

function SourceBadge({ agent }: { agent: Agent }) {
  const src = matchSource(agent);
  if (!src) return null;
  const inner = (
    <>
      <img src={src.icon} alt={src.label} className="w-3.5 h-3.5 rounded-full" />
      <span className="text-zinc-300">Launched on {src.label}</span>
    </>
  );
  const className = 'px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:border-zinc-600 transition flex items-center gap-2';
  return src.href ? (
    <a href={src.href} target="_blank" rel="noopener noreferrer" className={className}>{inner}</a>
  ) : (
    <span className={className}>{inner}</span>
  );
}

function StatusBadgesRow({ agent, rank }: { agent: Agent; rank: number | null }) {
  const lastActive = agent.lastActivity ?? agent.lastActiveAt;
  const active = isActive(lastActive);
  const sourceCount = agent.trustScore?.sources?.length ?? 0;

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span
        className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
          active ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-500'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-400' : 'bg-zinc-500'}`} />
        {active ? 'Active' : 'Inactive'}
      </span>
      {rank !== null && (
        <Link
          href="/leaderboard"
          className="px-2.5 py-1 rounded-full border bg-amber-500/10 border-amber-500/30 text-amber-300 font-medium uppercase tracking-wide hover:bg-amber-500/20 transition"
        >
          Rank #{rank}
        </Link>
      )}
      {sourceCount > 0 && (
        <span className="px-2.5 py-1 rounded-full border bg-zinc-800/50 border-zinc-700/50 text-zinc-400">
          {sourceCount} verified {sourceCount === 1 ? 'source' : 'sources'}
        </span>
      )}
      {lastActive && (
        <span className="px-2.5 py-1 rounded-full border bg-zinc-800/50 border-zinc-700/50 text-zinc-400">
          Last active {timeAgo(lastActive)}
        </span>
      )}
    </div>
  );
}

function TabBar({
  activeTab,
  onChange,
  feedbackCount,
}: {
  activeTab: Tab;
  onChange: (t: Tab) => void;
  feedbackCount: number;
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'feedback', label: feedbackCount > 0 ? `Feedback (${feedbackCount})` : 'Feedback' },
    { id: 'identity', label: 'Identity' },
  ];
  return (
    <div className="flex gap-1 border-b border-zinc-800">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === t.id
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function OverviewTab({ agent }: { agent: Agent }) {
  const hasServices = Boolean(agent.mcpEndpoint || agent.a2aEndpoint || (agent.serviceTypes?.length ?? 0) > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Reputation" value={agent.reputationScore?.toFixed(1) ?? '0'} />
        <StatTile label="Feedback" value={String(agent.feedbackCount ?? 0)} />
        <StatTile label="Activity" value={String(agent.activityCount ?? 0)} />
        <StatTile label="Registered" value={timeAgo(agent.registeredAt)} />
      </div>

      {agent.trustScore && agent.trustScore.score > 0 && (
        <TrustBreakdown score={agent.trustScore} />
      )}

      {agent.skills && agent.skills.length > 0 && (
        <section>
          <h2 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {agent.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {hasServices && (
        <section>
          <h2 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">Services</h2>
          <div className="space-y-2">
            {agent.mcpEndpoint && (
              <EndpointRow protocol="MCP" url={agent.mcpEndpoint} />
            )}
            {agent.a2aEndpoint && (
              <EndpointRow protocol="A2A" url={agent.a2aEndpoint} />
            )}
            {agent.serviceTypes && agent.serviceTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {agent.serviceTypes.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 text-xs bg-white/5 border border-white/10 rounded-full text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function FeedbackTab({ agent }: { agent: Agent }) {
  if (!agent.feedbackCount || agent.feedbackCount === 0) {
    return (
      <div className="p-10 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl text-center">
        <svg className="mx-auto mb-3 text-zinc-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <h3 className="text-sm font-semibold mb-1">No feedback yet</h3>
        <p className="text-zinc-500 text-xs max-w-sm mx-auto">
          This agent hasn&apos;t received any on-chain feedback. Once users start leaving feedback, reputation analytics will appear here.
        </p>
      </div>
    );
  }
  return (
    <ReputationAnalytics
      wallet={agent.wallet}
      currentScore={agent.reputationScore || 0}
      feedbackCount={agent.feedbackCount || 0}
    />
  );
}

function IdentityTab({ agent }: { agent: Agent }) {
  const lastActive = agent.lastActivity ?? agent.lastActiveAt;
  return (
    <div className="space-y-4">
      {/* Wallet + PDA live in the always-visible On-Chain Identity sidebar card;
          this tab holds the registration record / metadata. */}
      <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl space-y-3">
        <Row
          label="Registered"
          value={agent.registeredAt ? `${timeAgo(agent.registeredAt)} · ${formatAbsolute(agent.registeredAt)}` : '—'}
        />
        {lastActive && (
          <Row
            label="Last Activity"
            value={`${timeAgo(lastActive)} · ${formatAbsolute(lastActive)}`}
          />
        )}
        {agent.metadataUri && (
          <div className="pt-2">
            <span className="text-zinc-400 text-xs uppercase tracking-wider block mb-1">AgentCard</span>
            <a
              href={agent.metadataUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline font-mono break-all"
            >
              {agent.metadataUri}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
      <span className="text-zinc-400 text-xs uppercase tracking-wider">{label}</span>
      <code className={`text-xs ${mono ? 'bg-zinc-800 px-2 py-1 rounded font-mono' : ''} break-all`}>
        {value}
      </code>
    </div>
  );
}

// Round to 1 decimal and drop trailing zeros: 8.9999→"9", 3.5→"3.5", 7.3→"7.3".
const fmtDim = (v: number) => String(Math.round(v * 10) / 10);

// Axis-agnostic breakdown row: label + value/max + a bar filled to value/max.
type BreakdownDim = { label: string; value: number; max: number };

function TrustBreakdown({ score }: { score: TrustScore }) {
  // PLACEHOLDER DATA — the legacy v0.6 pillars (each 0–10) while the reputation
  // model is being finalized. The rendering below is axis-agnostic: to switch to
  // the real reputation axes, just repoint `dims` (label/value/max) — no layout
  // changes needed.
  const dims: BreakdownDim[] = [
    { label: 'Identity', value: score.identity, max: 10 },
    { label: 'Activity', value: score.activity, max: 10 },
    { label: 'Economic', value: score.economic, max: 10 },
    { label: 'Ecosystem', value: score.ecosystem, max: 10 },
    { label: 'Longevity', value: score.longevity, max: 10 },
    // FairScale arrives already on the 0–10 scale (e.g. Xona ~1.6), so no rescale.
    { label: 'Fairscale', value: score.fairscale, max: 10 },
  ];
  const color = TIER_SOLID[score.tier] ?? TIER_SOLID.unverified;

  return (
    <section>
      <h2 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">Trust Breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
        {dims.map((d) => {
          const pct = d.max > 0 ? Math.max(0, Math.min(100, (d.value / d.max) * 100)) : 0;
          return (
            <div key={d.label}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-zinc-300 text-xs">{d.label}</span>
                <span className="text-[11px] font-mono text-zinc-300">
                  {fmtDim(d.value)}
                  <span className="text-zinc-600">/{d.max}</span>
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-zinc-400 text-xs uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function EndpointRow({ protocol, url }: { protocol: string; url: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-lg">
      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white rounded">
        {protocol}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-300 hover:text-white transition text-xs font-mono break-all min-w-0 flex-1"
      >
        {url}
      </a>
    </div>
  );
}

const TIER_SOLID: Record<string, string> = {
  platinum: '#C084FC',
  gold: '#FBBF24',
  silver: '#A1A1AA',
  bronze: '#FB923C',
  unverified: '#71717A',
};

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="flex-shrink-0">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="42" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill="#f4f4f5" fontFamily="Inter, system-ui, sans-serif">{score}</text>
      <text x="44" y="60" textAnchor="middle" fontSize="9" fontWeight="600" letterSpacing="0.08em" fill="#71717a" fontFamily="Inter, system-ui, sans-serif">/ 100</text>
    </svg>
  );
}

function TrustScoreCard({ score }: { score: TrustScore | null }) {
  if (!score || score.score === 0) {
    return (
      <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl">
        <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-2">Trust Score</h3>
        <p className="text-zinc-500 text-xs">
          Trust score will be computed once this agent has on-chain activity and verifications.
        </p>
      </div>
    );
  }

  const tierStyles = TIER_COLORS[score.tier] ?? TIER_COLORS.unverified;
  const color = TIER_SOLID[score.tier] ?? TIER_SOLID.unverified;
  const sources = score.sources ?? [];

  return (
    <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl">
      <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-4">Trust Score</h3>
      <div className="flex items-center gap-4">
        <ScoreGauge score={score.score} color={color} />
        <div className="min-w-0">
          <div className={`text-lg font-bold leading-tight ${tierStyles.text}`}>{tierStyles.label}</div>
          <div className="text-xs text-zinc-500 mt-1">
            {sources.length > 0
              ? `Verified across ${sources.length} ${sources.length === 1 ? 'source' : 'sources'}`
              : 'On-chain verified'}
          </div>
        </div>
      </div>
      {sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800/60">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Verified Sources</div>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-zinc-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IdField({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-zinc-500 text-[10px] uppercase tracking-wider">{label}</span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-blue-400 hover:underline"
        >
          Solscan →
        </a>
      </div>
      <div className="flex items-center gap-1 bg-zinc-800 rounded-lg pl-2.5 pr-1 py-1">
        <code className="block flex-1 min-w-0 text-[11px] font-mono truncate text-zinc-300">{value}</code>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

function OnChainIdentityCard({ agent }: { agent: Agent }) {
  return (
    <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl">
      <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">On-Chain Identity</h3>
      <div className="space-y-3">
        <IdField label="Wallet" value={agent.wallet} href={`https://solscan.io/account/${agent.wallet}`} />
        {agent.pda && (
          <IdField label="Identity PDA" value={agent.pda} href={`https://solscan.io/account/${agent.pda}`} />
        )}
      </div>
    </div>
  );
}

const EMBED_FORMATS = ['Markdown', 'HTML', 'URL'] as const;
type EmbedFormat = (typeof EMBED_FORMATS)[number];

function EmbedBadgeCard({ agent }: { agent: Agent }) {
  const [format, setFormat] = useState<EmbedFormat>('Markdown');

  const badgeUrl = `https://api.saidprotocol.com/api/badge/${agent.wallet}.svg`;
  const profileUrl = `https://www.saidprotocol.com/agents/${agent.wallet}`;
  const label = `SAID ${agent.isVerified ? 'Verified' : 'Registered'}`;

  const snippets: Record<EmbedFormat, string> = {
    Markdown: `[![${label}](${badgeUrl})](${profileUrl})`,
    HTML: `<a href="${profileUrl}"><img src="${badgeUrl}" alt="${label}" width="348"></a>`,
    URL: badgeUrl,
  };
  const snippet = snippets[format];

  return (
    <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl">
      <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">Embed Badge</h3>

      {/* Live preview — exactly what gets embedded */}
      <a
        href={badgeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-3 rounded-xl overflow-hidden ring-1 ring-white/[0.06] transition hover:ring-white/20"
      >
        <img src={badgeUrl} alt={label} className="block w-full h-auto" />
      </a>

      <p className="text-zinc-400 text-xs leading-relaxed mb-3">
        Show off this agent&apos;s verified SAID badge on your site, README, or docs. It updates live as the trust score changes.
      </p>

      {/* Format toggle */}
      <div className="flex gap-0.5 mb-2 p-0.5 bg-zinc-900/70 border border-zinc-800/60 rounded-lg">
        {EMBED_FORMATS.map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`flex-1 text-[11px] font-medium py-1 rounded-md transition ${
              format === f ? 'bg-zinc-700/70 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Snippet + copy */}
      <div className="flex items-start gap-1 bg-zinc-800 rounded-lg p-2">
        <code className="block flex-1 min-w-0 text-[10px] leading-relaxed overflow-x-auto whitespace-pre text-zinc-300">
          {snippet}
        </code>
        <CopyButton text={snippet} />
      </div>
    </div>
  );
}
