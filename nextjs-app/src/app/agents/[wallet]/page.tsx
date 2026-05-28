'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';
import ReputationAnalytics from '@/components/ReputationAnalytics';

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
  twitter?: string;
  website?: string;
  image?: string;
  skills?: string[];
  reputationScore: number;
  feedbackCount: number;
  pda?: string;
  trustScore?: TrustScore | null;
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
  return `${Math.floor(diff / 2592000)}mo ago`;
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
        <HeaderSection agent={agent} />
        <StatusBadgesRow agent={agent} />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
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

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <TrustScoreCard score={agent.trustScore ?? null} />
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
        src={`https://api.saidprotocol.com/api/avatar/${agent.wallet}.svg`}
        alt={agent.name || 'Agent'}
        className="w-20 h-20 rounded-2xl flex-shrink-0"
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
        </div>
      </div>
    </div>
  );
}

function StatusBadgesRow({ agent }: { agent: Agent }) {
  const active = isActive(agent.lastActivity);
  const tier = agent.trustScore?.tier ?? 'unverified';
  const tierStyles = TIER_COLORS[tier] ?? TIER_COLORS.unverified;
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
      {agent.trustScore && agent.trustScore.score > 0 && (
        <span className={`px-2.5 py-1 rounded-full border ${tierStyles.bg} ${tierStyles.border} ${tierStyles.text} font-medium uppercase tracking-wide`}>
          {tierStyles.label} · {agent.trustScore.score}
        </span>
      )}
      {sourceCount > 0 && (
        <span className="px-2.5 py-1 rounded-full border bg-zinc-800/50 border-zinc-700/50 text-zinc-400">
          {sourceCount} verified {sourceCount === 1 ? 'source' : 'sources'}
        </span>
      )}
      {agent.lastActivity && (
        <span className="px-2.5 py-1 rounded-full border bg-zinc-800/50 border-zinc-700/50 text-zinc-400">
          Last active {timeAgo(agent.lastActivity)}
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Reputation" value={agent.reputationScore?.toFixed(1) ?? '0'} />
        <StatTile label="Feedback" value={String(agent.feedbackCount ?? 0)} />
        <StatTile label="Skills" value={String(agent.skills?.length ?? 0)} />
        <StatTile
          label="Registered"
          value={
            agent.registeredAt
              ? new Date(agent.registeredAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : '—'
          }
        />
      </div>

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
  return (
    <div className="space-y-4">
      <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl space-y-3">
        <Row label="Wallet" value={agent.wallet} mono />
        {agent.pda && <Row label="Identity PDA" value={agent.pda} mono />}
        <Row label="Registered" value={agent.registeredAt ? new Date(agent.registeredAt).toLocaleString() : '—'} />
        {agent.lastActivity && <Row label="Last Activity" value={new Date(agent.lastActivity).toLocaleString()} />}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`https://solscan.io/account/${agent.wallet}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline"
          >
            View wallet on Solscan →
          </a>
          {agent.pda && (
            <a
              href={`https://solscan.io/account/${agent.pda}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline"
            >
              View PDA on Solscan →
            </a>
          )}
        </div>
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

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-zinc-400 text-xs uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function TrustScoreCard({ score }: { score: TrustScore | null }) {
  const rows = useMemo(() => {
    if (!score) return [];
    return [
      { label: 'Identity', value: score.identity },
      { label: 'Activity', value: score.activity },
      { label: 'Economic', value: score.economic },
      { label: 'Ecosystem', value: score.ecosystem },
      { label: 'Longevity', value: score.longevity },
      { label: 'Fairscale', value: score.fairscale },
    ];
  }, [score]);

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

  return (
    <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-sm uppercase tracking-wider text-zinc-500">Trust Score</h3>
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${tierStyles.bg} ${tierStyles.border} ${tierStyles.text} border`}>
          {tierStyles.label}
        </span>
      </div>
      <div className="text-4xl font-bold mb-4">{score.score}<span className="text-base font-normal text-zinc-500">/100</span></div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-zinc-400">{r.label}</span>
              <span className="text-zinc-300 font-mono">{r.value}</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/50"
                style={{ width: `${Math.max(0, Math.min(100, r.value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {score.sources && score.sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800/60">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Verified Sources</div>
          <div className="flex flex-wrap gap-1.5">
            {score.sources.map((s) => (
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

function OnChainIdentityCard({ agent }: { agent: Agent }) {
  return (
    <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl">
      <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">On-Chain Identity</h3>
      <div className="space-y-3 text-xs">
        <div>
          <div className="text-zinc-500 mb-1">Wallet</div>
          <code className="block bg-zinc-800 px-2 py-1 rounded font-mono break-all">{agent.wallet}</code>
        </div>
        {agent.pda && (
          <div>
            <div className="text-zinc-500 mb-1">Identity PDA</div>
            <code className="block bg-zinc-800 px-2 py-1 rounded font-mono break-all">{agent.pda}</code>
          </div>
        )}
        <a
          href={`https://solscan.io/account/${agent.wallet}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-400 hover:underline"
        >
          View on Solscan →
        </a>
      </div>
    </div>
  );
}

function EmbedBadgeCard({ agent }: { agent: Agent }) {
  return (
    <div className="p-5 bg-zinc-950/50 backdrop-blur-md border border-zinc-800/60 rounded-xl">
      <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">Embed Badge</h3>
      <img
        src={`https://api.saidprotocol.com/api/badge/${agent.wallet}.svg`}
        alt="SAID Badge"
        className="h-8 mb-3"
      />
      <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Markdown</p>
      <code className="block bg-zinc-800 p-2 rounded text-[10px] overflow-x-auto whitespace-pre">
        {`[![SAID ${agent.isVerified ? 'Verified' : 'Registered'}](https://api.saidprotocol.com/api/badge/${agent.wallet}.svg)](https://www.saidprotocol.com/agents/${agent.wallet})`}
      </code>
    </div>
  );
}
