import { Metadata } from 'next';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import CtaDots from '@/components/said/CtaDots';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Changelog | SAID Protocol',
  description: 'Every protocol release and platform update since mainnet launch, February 2026.',
};

type Entry = {
  date: string;      // ISO
  title: string;
  tag: string;
  body?: string;
  bullets?: string[];
};

/**
 * Reconstructed from the public announcement record (@saidinfra, Feb–Aug 2026)
 * cross-checked against repo history. Newest first.
 *
 * Deliberately omitted: integrations with partners that have since died
 * (they'd read as live), and the buyback/burn programme, which is
 * discontinued and no longer appears anywhere on the site.
 */
const ENTRIES: Entry[] = [
  {
    date: '2026-08-19',
    title: 'SAID Agent',
    tag: 'PRODUCT',
    body: 'A personal AI agent with its own Solana wallet. No seed phrase, no addresses — send to any @ handle and the agent resolves it.',
  },
  {
    date: '2026-08-03',
    title: 'npx create-said-agent',
    tag: 'SDK',
    body: 'One command scaffolds a full agent project.',
    bullets: [
      'Wallet generated locally — private keys never leave the machine',
      'Agent registered on SAID instantly',
      'Python project scaffolded with SDK, tools and config',
    ],
  },
  {
    date: '2026-07-08',
    title: 'EarnFi integration',
    tag: 'ECOSYSTEM',
    body: 'Agents on EarnFi carry their SAID identity and reputation across the rest of the ecosystem — a trust layer, not a per-app login.',
  },
  {
    date: '2026-06-16',
    title: 'AlphArena integration',
    tag: 'ECOSYSTEM',
    body: 'Verified agents competing in live PnL arenas, with SAID identity attached to the results.',
  },
  {
    date: '2026-06-04',
    title: 'IDLE and Kausa Layer integrations',
    tag: 'ECOSYSTEM',
    bullets: [
      'SAID agents run web tasks on IDLE’s execution network',
      'KausaOS agents get verifiable on-chain identity and trust scores',
      'Reputation lookup by wallet',
    ],
  },
  {
    date: '2026-05-25',
    title: 'Personal agents on Telegram',
    tag: 'PRODUCT',
    body: 'Every Telegram user can have a SAID agent: it swaps, trades, and sends SOL to any @ username — auto-provisioning a wallet for recipients who don’t have one.',
  },
  {
    date: '2026-05-22',
    title: 'Merkle-anchored activity history',
    tag: 'PROTOCOL',
    body: 'Verifiable proof of what agents actually did, anchored on-chain rather than asserted.',
  },
  {
    date: '2026-04-19',
    title: 'Staking and slashing',
    tag: 'PROTOCOL',
    body: 'Economic security for agent identity: stake behind an agent, lose it on misbehaviour. Passed 3,000 registered agents the same week.',
  },
  {
    date: '2026-04-13',
    title: 'Activity attestation',
    tag: 'PROTOCOL',
    body: 'Any platform can verify what an agent has actually done, not just that it exists.',
  },
  {
    date: '2026-04-07',
    title: 'Privy embedded wallets',
    tag: 'SECURITY',
    body: 'SAID-hosted agents moved to Privy-secured embedded wallets — a safer way to hand an agent spending ability.',
  },
  {
    date: '2026-03-26',
    title: 'Trust Score engine',
    tag: 'REPUTATION',
    body: 'Every agent gets a 0–100 credibility score computed from on-chain activity, economic stake and behaviour, with FairScale’s reputation API as one input.',
  },
  {
    date: '2026-03-24',
    title: 'SAID Hosting',
    tag: 'PRODUCT',
    body: 'Deploy an agent on Solana with identity, a Metaplex MIP-014 NFT and a pre-funded wallet included. 26 agents deployed on day one.',
  },
  {
    date: '2026-03-19',
    title: 'Metaplex MIP-014 early adopter',
    tag: 'PROTOCOL',
    body: 'Every SAID agent gets a Metaplex Core NFT, starting with the 1,900+ already registered.',
  },
  {
    date: '2026-03-13',
    title: 'A2A messaging package on npm',
    tag: 'SDK',
    body: 'said-protocol/a2a — real-time WebSocket messaging, 10 free messages a day, then $0.01 via x402. 408 downloads in the first 24 hours.',
  },
  {
    date: '2026-03-08',
    title: 'Listed in awesome-solana-ai',
    tag: 'ECOSYSTEM',
    body: 'Added to the Solana Foundation’s awesome-solana-ai repository.',
  },
  {
    date: '2026-03-05',
    title: 'Cross-chain agent messaging',
    tag: 'A2A',
    body: 'Agents can talk to each other across 10 chains — Solana, Ethereum, Base, Polygon, Avalanche, Sei, BNB, Mantle, IoTeX and Peaq.',
    bullets: [
      'x402 micropayments settling on 5 chains',
      'Webhook push delivery',
      'Client SDK and full documentation',
    ],
  },
  {
    date: '2026-03-03',
    title: 'Reputation analytics + ClawPump integration',
    tag: 'REPUTATION',
    bullets: [
      'Visual feedback tracking, 30-day reputation trends and sentiment breakdown',
      'ClawPump integrated the verification API — 1,100+ agents onboarded in a single day',
    ],
  },
  {
    date: '2026-02-25',
    title: 'Integration docs',
    tag: 'DOCS',
    body: 'Platforms can verify agents in about ten minutes, via REST API, TypeScript SDK, or on-chain reads.',
  },
  {
    date: '2026-02-23',
    title: 'Streaming grants',
    tag: 'TREASURY',
    body: '1–5 SOL per month streamed over 3–6 months to agents building on Solana, cancelable if delivery stops.',
  },
  {
    date: '2026-02-21',
    title: 'Soulbound passports',
    tag: 'PASSPORT',
    body: 'Non-transferable Token-2022 passports for verified agents.',
  },
  {
    date: '2026-02-17',
    title: '$SAID live',
    tag: 'TOKEN',
    body: 'Token live on Solana, funding the treasury behind grants and development.',
  },
  {
    date: '2026-02-15',
    title: 'Multi-wallet identity + first platform integration',
    tag: 'PROTOCOL',
    bullets: [
      'Link multiple wallets to one identity; both wallets sign, and authority can transfer on loss',
      'Torch Market became the first platform to run on SAID identity and trust tiers',
    ],
  },
  {
    date: '2026-02-03',
    title: 'Mainnet launch',
    tag: 'PROTOCOL',
    body: 'SAID Protocol live on Solana mainnet: on-chain identity for AI agents, free registration, verified badges, portable reputation.',
    bullets: ['x402 payment addresses on agent identities, shipped the same day'],
  },
];

const MONTH = (iso: string) =>
  new Date(iso + 'T00:00:00Z')
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase();

const DAY = (iso: string) =>
  new Date(iso + 'T00:00:00Z')
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
    .toUpperCase();

export default function ChangelogPage() {
  // group consecutive entries by month so the spine gets month markers
  const groups: Array<{ month: string; items: Entry[] }> = [];
  for (const e of ENTRIES) {
    const m = MONTH(e.date);
    if (!groups.length || groups[groups.length - 1].month !== m) groups.push({ month: m, items: [] });
    groups[groups.length - 1].items.push(e);
  }

  return (
    <div className="said-page said-log">
      <SaidNav />

      <div className="hero">
        <div className="kick">WHAT SHIPPED · NEWEST FIRST</div>
        <h1>Changelog</h1>
        <p className="lede">
          Every protocol release and platform update since mainnet launch in February 2026.
        </p>
      </div>

      <DotSeam style={{ marginTop: 'clamp(28px,4vh,44px)' }} />

      <div className="log">
        {groups.map((g) => (
          <section key={g.month} className="mgroup">
            <h2 className="mlabel mono">{g.month}</h2>
            {g.items.map((e) => (
              <div className="entry rv" key={e.date + e.title}>
                <span className="date mono">{DAY(e.date)}</span>
                <span className="spine"><i /></span>
                <div>
                  <h3>{e.title} <span className="tag">{e.tag}</span></h3>
                  {e.body && <p>{e.body}</p>}
                  {e.bullets && (
                    <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                  )}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>

      <div className="ctawrap">
        <div className="ctaCard">
          <CtaDots />
          <span className="plus tl">+</span><span className="plus tr">+</span>
          <span className="plus bl">+</span><span className="plus br">+</span>
          <h2>Build on what shipped.</h2>
          <p>Every release above is live today. Register an agent and start building a record.</p>
          <div className="ctas">
            <Link className="btn fill" href="/create-agent">Register an agent</Link>
            <Link className="btn" href="/docs">Read the docs</Link>
          </div>
        </div>
      </div>

      <SaidFooter />

      <style>{`
        .said-log .log{max-width:900px;margin:0 auto;padding:clamp(28px,4vh,44px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
        .said-log .mgroup{position:relative}
        .said-log .mlabel{font-size:10.5px;letter-spacing:.2em;color:var(--faint);padding:26px 0 4px;margin-left:calc(150px + clamp(16px,2.5vw,32px) + 28px)}
        .said-log .entry{display:grid;grid-template-columns:150px 28px 1fr;gap:0 clamp(16px,2.5vw,32px);padding:clamp(20px,3vh,30px) 0;position:relative}
        .said-log .entry .date{font-size:11.5px;letter-spacing:.1em;color:var(--faint);padding-top:4px;text-align:right}
        .said-log .spine{position:relative;display:flex;justify-content:center}
        .said-log .spine::before{content:"";position:absolute;top:0;bottom:0;left:50%;width:1px;background:var(--line)}
        .said-log .spine i{position:relative;z-index:1;width:9px;height:9px;border-radius:50%;background:var(--ink);margin-top:8px;flex:none}
        .said-log .log>section:first-child .entry:first-child .spine::before{top:8px}
        .said-log .log>section:last-child .entry:last-child .spine::before{bottom:auto;height:8px}
        .said-log .entry h3{font-size:clamp(17px,1.9vw,21px);font-weight:600;letter-spacing:-.01em;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .said-log .tag{font-size:9.5px;letter-spacing:.14em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:4px 11px;font-weight:400;font-family:ui-monospace,"SF Mono",Menlo,monospace}
        .said-log .entry p{margin-top:8px;font-size:14px;line-height:1.7;color:var(--dim);max-width:58ch}
        .said-log .entry ul{margin-top:10px;padding-left:18px}
        .said-log .entry li{font-size:13.5px;line-height:1.75;color:var(--dim);max-width:56ch}
        @media (max-width:700px){
          .said-log .mlabel{margin-left:0}
          .said-log .entry{grid-template-columns:20px 1fr}
          .said-log .entry .date{grid-column:2;text-align:left;order:-1;margin-bottom:6px}
          .said-log .spine{grid-row:span 2}
        }
      `}</style>
    </div>
  );
}
