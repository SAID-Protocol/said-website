'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import ShimmerDots from '@/components/said/ShimmerDots';
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

// Tier accent colors — match the directory champion auras.
const TIER_SOLID: Record<string, string> = {
  platinum: '#a78bfa',
  gold: '#d9a514',
  silver: '#8fa3bb',
  bronze: '#c2703d',
  unverified: '#8a8a8a',
};
const tierLabel = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Unverified');

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

const shortAddr = (v: string) => `${v.slice(0, 6)}…${v.slice(-6)}`;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="said-page said-agent">
      {children}
      <SaidFooter />
      <style>{agentStyles}</style>
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
        // API entries carry no rank field — derive it from list position.
        const idx = lb.findIndex((e) => e.wallet === wallet);
        if (idx >= 0) setRank(lb[idx].rank ?? idx + 1);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [wallet]);

  if (loading) {
    return (
      <Shell>
        <main className="agentwrap center">
          <p className="mono dimlabel">LOADING AGENT…</p>
        </main>
      </Shell>
    );
  }

  if (error || !agent) {
    return (
      <Shell>
        <main className="agentwrap center">
          <h1 className="nfTitle">Agent not found</h1>
          <p className="nfSub">This agent doesn&apos;t exist or hasn&apos;t been registered yet.</p>
          <Link href="/agents" className="btn fill" style={{ marginTop: 26 }}>Browse the directory</Link>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="agentwrap">
        <Link href="/agents" className="backlink mono">← DIRECTORY</Link>

        <div className="topgrid">
          <div>
            <HeaderSection agent={agent} />
            <StatusBadgesRow agent={agent} rank={rank} />
          </div>
          <aside>
            <TrustScoreCard score={agent.trustScore ?? null} />
          </aside>
        </div>

        <DotSeam style={{ marginTop: 'clamp(20px,3vh,32px)' }} />

        <div className="maingrid">
          <div>
            <div className="tabbar">
              {([
                ['overview', 'Overview'],
                ['feedback', agent.feedbackCount > 0 ? `Feedback (${agent.feedbackCount})` : 'Feedback'],
                ['identity', 'Identity'],
              ] as Array<[Tab, string]>).map(([id, label]) => (
                <button key={id} className={`tabbtn${activeTab === id ? ' on' : ''}`} onClick={() => setActiveTab(id)}>
                  {label}
                </button>
              ))}
            </div>
            {activeTab === 'overview' && <OverviewTab agent={agent} />}
            {activeTab === 'feedback' && <FeedbackTab agent={agent} />}
            {activeTab === 'identity' && <IdentityTab agent={agent} />}
          </div>
          <aside className="sidecol">
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
    <div className="head">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="avatar"
        src={agent.image || `https://api.saidprotocol.com/api/avatar/${agent.wallet}.svg`}
        alt={agent.name || 'Agent'}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="namerow">
          <h1>{agent.name || 'Unnamed Agent'}</h1>
          {agent.isVerified && <span className="vbadge">✓</span>}
        </div>
        <p className="desc">{agent.description || 'No description provided'}</p>
        <div className="links">
          {agent.twitter && (
            <a className="pill" href={`https://twitter.com/${agent.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
              {agent.twitter}
            </a>
          )}
          {agent.website && (
            <a className="pill" href={agent.website} target="_blank" rel="noopener noreferrer">Website ↗</a>
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src.icon} alt="" />
      <span>Launched on {src.label}</span>
    </>
  );
  return src.href ? (
    <a className="pill src" href={src.href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <span className="pill src">{inner}</span>
  );
}

function StatusBadgesRow({ agent, rank }: { agent: Agent; rank: number | null }) {
  const lastActive = agent.lastActivity ?? agent.lastActiveAt;
  const active = isActive(lastActive);
  const sourceCount = agent.trustScore?.sources?.length ?? 0;

  return (
    <div className="statusrow mono">
      <span className={`chip${active ? ' live' : ''}`}>
        <i className="dot" />{active ? 'ACTIVE' : 'INACTIVE'}
      </span>
      {rank !== null && <Link href="/leaderboard" className="chip rank">RANK #{rank}</Link>}
      {sourceCount > 0 && <span className="chip">{sourceCount} VERIFIED {sourceCount === 1 ? 'SOURCE' : 'SOURCES'}</span>}
      {lastActive && <span className="chip">LAST ACTIVE {timeAgo(lastActive).toUpperCase()}</span>}
    </div>
  );
}

function OverviewTab({ agent }: { agent: Agent }) {
  const hasServices = Boolean(agent.mcpEndpoint || agent.a2aEndpoint || (agent.serviceTypes?.length ?? 0) > 0);

  return (
    <div className="tabbody">
      <div className="tiles">
        <StatTile label="REPUTATION" value={agent.reputationScore?.toFixed(1) ?? '0'} />
        <StatTile label="FEEDBACK" value={String(agent.feedbackCount ?? 0)} />
        <StatTile label="ACTIVITY" value={String(agent.activityCount ?? 0)} />
        <StatTile label="REGISTERED" value={timeAgo(agent.registeredAt)} />
      </div>

      {agent.trustScore && agent.trustScore.score > 0 && <TrustBreakdown score={agent.trustScore} />}

      {agent.skills && agent.skills.length > 0 && (
        <section>
          <h2 className="seclabel mono">SKILLS</h2>
          <div className="pillrow">
            {agent.skills.map((skill) => <span key={skill} className="pill">{skill}</span>)}
          </div>
        </section>
      )}

      {hasServices && (
        <section>
          <h2 className="seclabel mono">SERVICES</h2>
          <div className="eplist">
            {agent.mcpEndpoint && <EndpointRow protocol="MCP" url={agent.mcpEndpoint} />}
            {agent.a2aEndpoint && <EndpointRow protocol="A2A" url={agent.a2aEndpoint} />}
          </div>
          {agent.serviceTypes && agent.serviceTypes.length > 0 && (
            <div className="pillrow" style={{ marginTop: 10 }}>
              {agent.serviceTypes.map((t) => <span key={t} className="pill">{t}</span>)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function FeedbackTab({ agent }: { agent: Agent }) {
  if (!agent.feedbackCount || agent.feedbackCount === 0) {
    return (
      <div className="tabbody">
        <div className="emptycard">
          <h3>No feedback yet</h3>
          <p>This agent hasn&apos;t received any on-chain feedback. Once users start leaving feedback, reputation analytics will appear here.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="tabbody">
      <ReputationAnalytics
        wallet={agent.wallet}
        currentScore={agent.reputationScore || 0}
        feedbackCount={agent.feedbackCount || 0}
      />
    </div>
  );
}

function IdentityTab({ agent }: { agent: Agent }) {
  const lastActive = agent.lastActivity ?? agent.lastActiveAt;
  return (
    <div className="tabbody">
      <div className="card">
        <Row label="REGISTERED" value={agent.registeredAt ? `${timeAgo(agent.registeredAt)} · ${formatAbsolute(agent.registeredAt)}` : '—'} />
        {lastActive && <Row label="LAST ACTIVITY" value={`${timeAgo(lastActive)} · ${formatAbsolute(lastActive)}`} />}
        {agent.metadataUri && (
          <div style={{ marginTop: 14 }}>
            <span className="seclabel mono" style={{ marginBottom: 6, display: 'block' }}>AGENTCARD</span>
            <a className="metalink mono" href={agent.metadataUri} target="_blank" rel="noopener noreferrer">
              {agent.metadataUri}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="krow">
      <span className="seclabel mono">{label}</span>
      <span className="kval">{value}</span>
    </div>
  );
}

// Round to 1 decimal and drop trailing zeros: 8.9999→"9", 3.5→"3.5", 7.3→"7.3".
const fmtDim = (v: number) => String(Math.round(v * 10) / 10);

function TrustBreakdown({ score }: { score: TrustScore }) {
  // PLACEHOLDER DATA — the legacy v0.6 pillars (each 0–10) while the reputation
  // model is being finalized. Rendering is axis-agnostic: repoint `dims` to the
  // real axes when ready.
  const dims = [
    { label: 'Identity', value: score.identity, max: 10 },
    { label: 'Activity', value: score.activity, max: 10 },
    { label: 'Economic', value: score.economic, max: 10 },
    { label: 'Ecosystem', value: score.ecosystem, max: 10 },
    { label: 'Longevity', value: score.longevity, max: 10 },
    // FairScale arrives already on the 0–10 scale, no rescale.
    { label: 'Fairscale', value: score.fairscale, max: 10 },
  ];
  const color = TIER_SOLID[score.tier] ?? TIER_SOLID.unverified;

  return (
    <section>
      <h2 className="seclabel mono">TRUST BREAKDOWN</h2>
      <div className="bkgrid">
        {dims.map((d) => {
          const pct = d.max > 0 ? Math.max(0, Math.min(100, (d.value / d.max) * 100)) : 0;
          return (
            <div key={d.label}>
              <div className="bkhead">
                <span>{d.label}</span>
                <span className="mono">{fmtDim(d.value)}<i>/{d.max}</i></span>
              </div>
              <div className="bkbar"><i style={{ width: `${pct}%`, backgroundColor: color }} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="tile">
      <div className="tv">{value}</div>
      <div className="tl mono">{label}</div>
    </div>
  );
}

function EndpointRow({ protocol, url }: { protocol: string; url: string }) {
  return (
    <div className="eprow">
      <span className="proto mono">{protocol}</span>
      <a href={url} target="_blank" rel="noopener noreferrer" className="mono">{url}</a>
    </div>
  );
}

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
      <circle
        cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 44 44)"
      />
      <text x="44" y="42" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="500" fill="var(--ink)" letterSpacing="-1">{score}</text>
      <text x="44" y="60" textAnchor="middle" fontSize="9" letterSpacing="0.08em" fill="var(--faint)">/ 100</text>
    </svg>
  );
}

function TrustScoreCard({ score }: { score: TrustScore | null }) {
  if (!score || score.score === 0) {
    return (
      <div className="card">
        <h3 className="seclabel mono">TRUST SCORE</h3>
        <p className="cardnote">Trust score will be computed once this agent has on-chain activity and verifications.</p>
      </div>
    );
  }

  const color = TIER_SOLID[score.tier] ?? TIER_SOLID.unverified;
  const sources = score.sources ?? [];

  return (
    <div className="card trustcard">
      <ShimmerDots />
      <h3 className="seclabel mono">TRUST SCORE</h3>
      <div className="scorerow">
        <ScoreGauge score={score.score} color={color} />
        <div style={{ minWidth: 0 }}>
          <div className="tiername" style={{ color }}>{tierLabel(score.tier)}</div>
          <div className="cardnote" style={{ marginTop: 4 }}>
            {sources.length > 0
              ? `Verified across ${sources.length} ${sources.length === 1 ? 'source' : 'sources'}`
              : 'On-chain verified'}
          </div>
        </div>
      </div>
      {sources.length > 0 && (
        <div className="cardsep">
          <div className="seclabel mono" style={{ marginBottom: 8 }}>VERIFIED SOURCES</div>
          <div className="pillrow">
            {sources.map((s) => <span key={s} className="pill sm">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function IdField({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="idfield">
      <div className="idhead">
        <span className="seclabel mono">{label}</span>
        <a className="solscan mono" href={href} target="_blank" rel="noopener noreferrer">SOLSCAN ↗</a>
      </div>
      <div className="addr" style={{ padding: '10px 14px', marginTop: 6 }}>
        {/* hidden full value first — the shared copy handler copies the first <code> */}
        <code style={{ display: 'none' }}>{value}</code>
        <code title={value}>{shortAddr(value)}</code>
        <button className="copy">COPY</button>
      </div>
    </div>
  );
}

function OnChainIdentityCard({ agent }: { agent: Agent }) {
  return (
    <div className="card">
      <h3 className="seclabel mono">ON-CHAIN IDENTITY</h3>
      <IdField label="WALLET" value={agent.wallet} href={`https://solscan.io/account/${agent.wallet}`} />
      {agent.pda && <IdField label="IDENTITY PDA" value={agent.pda} href={`https://solscan.io/account/${agent.pda}`} />}
    </div>
  );
}

const EMBED_FORMATS = ['Markdown', 'HTML', 'URL'] as const;
type EmbedFormat = (typeof EMBED_FORMATS)[number];

function EmbedBadgeCard({ agent }: { agent: Agent }) {
  const [format, setFormat] = useState<EmbedFormat>('Markdown');
  const [copied, setCopied] = useState(false);

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
    <div className="card">
      <h3 className="seclabel mono">EMBED BADGE</h3>

      {/* Live preview — exactly what gets embedded */}
      <a href={badgeUrl} target="_blank" rel="noopener noreferrer" className="badgeprev">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeUrl} alt={label} />
      </a>

      <p className="cardnote">
        Show off this agent&apos;s SAID badge on your site, README, or docs. It updates live
        as the trust score changes.
      </p>

      <div className="fmtrow">
        {EMBED_FORMATS.map((f) => (
          <button key={f} className={`fmtbtn${format === f ? ' on' : ''}`} onClick={() => setFormat(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="snip">
        <code className="mono">{snippet}</code>
        <button
          className="copy"
          onClick={() => { navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
    </div>
  );
}

const agentStyles = `
  .said-agent .agentwrap{max-width:1180px;margin:0 auto;padding:clamp(32px,5vh,52px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
  .said-agent .agentwrap.center{text-align:center;padding-top:16vh;padding-bottom:16vh}
  .said-agent .dimlabel{font-size:12px;letter-spacing:.14em;color:var(--faint)}
  .said-agent .nfTitle{font-size:clamp(26px,3vw,38px);font-weight:500;letter-spacing:-.03em}
  .said-agent .nfSub{margin-top:12px;color:var(--dim);font-size:14.5px}
  .said-agent .backlink{display:inline-block;font-size:11px;letter-spacing:.14em;color:var(--faint);margin-bottom:30px}
  .said-agent .backlink:hover{color:var(--ink)}
  .said-agent .topgrid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:clamp(20px,3vw,36px);align-items:start}
  .said-agent .maingrid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:clamp(20px,3vw,36px);margin-top:clamp(28px,4vh,40px);align-items:start}
  .said-agent .topgrid>*,.said-agent .maingrid>*{min-width:0}
  .said-agent .sidecol{display:grid;gap:16px}
  .said-agent .card{min-width:0;overflow:hidden}
  .said-agent .trustcard{position:relative}
  .said-agent .trustcard>*:not(canvas){position:relative}
  .said-agent .maingrid{margin-top:clamp(20px,3vh,30px)}
  .said-agent .head{display:flex;gap:22px;align-items:flex-start;margin-bottom:18px}
  .said-agent .avatar{width:76px;height:76px;border-radius:20px;object-fit:cover;background:var(--card);border:1px solid var(--line);flex-shrink:0}
  .said-agent .namerow{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .said-agent .namerow h1{font-size:clamp(24px,2.8vw,34px);font-weight:500;letter-spacing:-.02em}
  .said-agent .vbadge{flex:none;width:18px;height:18px;border-radius:50%;background:var(--ink);color:var(--bg);display:inline-flex;align-items:center;justify-content:center;font-size:10px}
  .said-agent .desc{margin-top:8px;font-size:14.5px;line-height:1.65;color:var(--dim);max-width:56ch}
  .said-agent .links{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
  .said-agent .pill{font-size:12.5px;padding:7px 14px}
  .said-agent .pill.sm{font-size:11px;padding:4px 10px}
  .said-agent .pill.src{display:inline-flex;align-items:center;gap:8px}
  .said-agent .pill.src img{width:15px;height:15px;border-radius:50%}
  .said-agent .statusrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:2px}
  .said-agent .chip{display:inline-flex;align-items:center;gap:7px;font-size:10px;letter-spacing:.1em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:6px 12px}
  .said-agent .chip .dot{width:6px;height:6px;border-radius:50%;background:var(--faint)}
  .said-agent .chip.live{color:var(--good);border-color:var(--good)}
  .said-agent .chip.live .dot{background:var(--good)}
  .said-agent .chip.rank:hover{border-color:var(--ink);color:var(--ink)}
  .said-agent .card{border:1px solid var(--line);border-radius:16px;padding:20px 22px;background:var(--card)}
  .said-agent .cardnote{margin-top:10px;font-size:12.5px;line-height:1.6;color:var(--dim)}
  .said-agent .cardsep{margin-top:16px;padding-top:16px;border-top:1px solid var(--line)}
  .said-agent .seclabel{font-size:10.5px;letter-spacing:.16em;color:var(--faint)}
  .said-agent .scorerow{display:flex;align-items:center;gap:18px;margin-top:14px}
  .said-agent .tiername{font-size:18px;font-weight:600;letter-spacing:-.01em}
  .said-agent .tabbar{display:flex;gap:2px;border-bottom:1px solid var(--line)}
  .said-agent .tabbtn{padding:11px 16px;font-size:13.5px;font-family:inherit;background:none;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;color:var(--dim);cursor:pointer}
  .said-agent .tabbtn:hover{color:var(--ink)}
  .said-agent .tabbtn.on{color:var(--ink);border-bottom-color:var(--ink)}
  .said-agent .tabbody{margin-top:22px;display:grid;gap:26px}
  .said-agent .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .said-agent .tile{border:1px solid var(--line);border-radius:14px;padding:16px;text-align:center}
  .said-agent .tile .tv{font-size:22px;font-weight:500;letter-spacing:-.02em}
  .said-agent .tile .tl{margin-top:6px;font-size:9.5px;letter-spacing:.14em;color:var(--faint)}
  .said-agent .bkgrid{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:14px 32px}
  .said-agent .bkhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;font-size:12.5px;color:var(--dim)}
  .said-agent .bkhead .mono{font-size:11px;color:var(--ink)}
  .said-agent .bkhead .mono i{font-style:normal;color:var(--faint)}
  .said-agent .bkbar{height:4px;background:var(--line);border-radius:2px;overflow:hidden}
  .said-agent .bkbar i{display:block;height:100%;border-radius:2px;opacity:.85;transition:width .5s}
  .said-agent .pillrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  .said-agent .eplist{display:grid;gap:8px;margin-top:12px}
  .said-agent .eprow{display:flex;align-items:center;gap:12px;border:1px solid var(--line);border-radius:12px;padding:10px 14px}
  .said-agent .eprow .proto{font-size:10px;letter-spacing:.1em;color:var(--bg);background:var(--ink);border-radius:6px;padding:3px 8px}
  .said-agent .eprow a{font-size:12px;color:var(--dim);word-break:break-all;min-width:0}
  .said-agent .eprow a:hover{color:var(--ink)}
  .said-agent .emptycard{border:1px solid var(--line);border-radius:16px;padding:40px 30px;text-align:center;background:var(--card)}
  .said-agent .emptycard h3{font-size:15px;font-weight:600}
  .said-agent .emptycard p{margin:8px auto 0;font-size:13px;line-height:1.65;color:var(--dim);max-width:42ch}
  .said-agent .krow{display:flex;justify-content:space-between;gap:16px;padding:8px 0;flex-wrap:wrap}
  .said-agent .kval{font-size:12.5px;color:var(--dim)}
  .said-agent .metalink{font-size:11.5px;color:var(--dim);border-bottom:1px solid var(--line);word-break:break-all}
  .said-agent .metalink:hover{color:var(--ink);border-color:var(--ink)}
  .said-agent .idfield{margin-top:14px}
  .said-agent .idhead{display:flex;justify-content:space-between;align-items:baseline}
  .said-agent .solscan{font-size:10px;letter-spacing:.08em;color:var(--faint)}
  .said-agent .solscan:hover{color:var(--ink)}
  .said-agent .idfield .addr{background:var(--bg)}
  .said-agent .badgeprev{display:block;margin-top:12px;border-radius:12px;overflow:hidden;border:1px solid var(--line)}
  .said-agent .badgeprev:hover{border-color:var(--ink)}
  .said-agent .badgeprev img{display:block;width:100%;height:auto}
  .said-agent .fmtrow{display:flex;gap:4px;margin-top:14px;border:1px solid var(--line);border-radius:99px;padding:3px}
  .said-agent .fmtbtn{flex:1;font-size:11px;font-family:inherit;padding:6px 0;border:0;border-radius:99px;background:none;color:var(--dim);cursor:pointer}
  .said-agent .fmtbtn.on{background:var(--ink);color:var(--bg)}
  .said-agent .snip{display:flex;align-items:flex-start;gap:10px;margin-top:10px;border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--bg)}
  .said-agent .snip code{flex:1;min-width:0;font-size:10.5px;line-height:1.6;overflow-x:auto;white-space:pre;display:block}
  .said-agent .snip .copy{margin-left:0}
  @media (max-width:960px){
    .said-agent .topgrid,.said-agent .maingrid{grid-template-columns:1fr}
    .said-agent .tiles{grid-template-columns:1fr 1fr}
    .said-agent .bkgrid{grid-template-columns:1fr}
  }
`;
