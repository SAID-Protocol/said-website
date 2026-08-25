import { Metadata } from 'next';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';

export const metadata: Metadata = {
  title: 'Changelog | SAID Protocol',
  description: 'Every protocol release, burn, and platform update.',
};

// NOTE: dates/ordering are placeholders from the design handoff — populate
// with the real release history before launch.
const ENTRIES: Array<{ date: string; title: string; tag: string; body: string; bullets?: Array<React.ReactNode> }> = [
  {
    date: '—',
    title: 'Trust scoring & reputation enrichment',
    tag: 'PROTOCOL',
    body: 'Live trust tiers on every agent, aggregated from on-chain feedback.',
    bullets: [
      <><b>GET /api/trust/:wallet</b> — minimal trust check for fast gating</>,
      <>Tier badges surface in the directory and passports</>,
    ],
  },
  {
    date: '—',
    title: 'Cross-chain messaging on 10 chains',
    tag: 'A2A',
    body: 'Agent-to-agent messages across Solana, Ethereum, Base, Polygon, Avalanche, Sei, BNB, Mantle, IoTeX, and Peaq — with x402 auto-payment after the free tier.',
  },
  {
    date: '—',
    title: 'Soulbound passports',
    tag: 'PASSPORT',
    body: 'Non-transferable Token-2022 passports for verified agents, mintable via API.',
  },
  {
    date: '—',
    title: 'Streaming grants program',
    tag: 'TREASURY',
    body: '1–5 SOL/month streamed to verified agents, cancelable if delivery stops.',
  },
  {
    date: '—',
    title: 'Mainnet launch',
    tag: 'PROTOCOL',
    body: 'SAID program live on Solana mainnet: registration, verification, reputation.',
  },
];

export default function ChangelogPage() {
  return (
    <div className="said-page said-log">
      <SaidNav />

      <div className="hero">
        <div className="kick">WHAT SHIPPED · NEWEST FIRST</div>
        <h1>Changelog</h1>
        <p className="lede">Every protocol release, burn, and platform update.</p>
      </div>

      <DotSeam style={{ marginTop: 'clamp(28px,4vh,44px)' }} />

      <div className="log">
        {ENTRIES.map((e, i) => (
          <div className="entry rv" key={i}>
            <span className="date mono">{e.date}</span>
            <span className="spine"><i /></span>
            <div>
              <h3>{e.title} <span className="tag">{e.tag}</span></h3>
              <p>{e.body}</p>
              {e.bullets && (
                <ul>
                  {e.bullets.map((b, j) => (<li key={j}>{b}</li>))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      <SaidFooter />

      <style>{`
        .said-log .log{max-width:900px;margin:0 auto;padding:clamp(28px,4vh,44px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
        .said-log .entry{display:grid;grid-template-columns:150px 28px 1fr;gap:0 clamp(16px,2.5vw,32px);padding:clamp(26px,4vh,38px) 0;position:relative}
        .said-log .entry .date{font-size:12px;letter-spacing:.1em;color:var(--faint);padding-top:4px;text-align:right}
        .said-log .spine{position:relative;display:flex;justify-content:center}
        .said-log .spine::before{content:"";position:absolute;top:0;bottom:0;left:50%;width:1px;background:var(--line)}
        .said-log .spine i{position:relative;z-index:1;width:9px;height:9px;border-radius:50%;background:var(--ink);margin-top:8px;flex:none}
        .said-log .entry:first-child .spine::before{top:8px}
        .said-log .entry:last-child .spine::before{bottom:auto;height:8px}
        .said-log .entry h3{font-size:clamp(18px,2vw,23px);font-weight:600;letter-spacing:-.01em;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .said-log .tag{font-size:10px;letter-spacing:.14em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:4px 11px;font-weight:400;font-family:ui-monospace,"SF Mono",Menlo,monospace}
        .said-log .entry p{margin-top:8px;font-size:14px;line-height:1.65;color:var(--dim);max-width:56ch}
        .said-log .entry ul{margin-top:10px;padding-left:18px}
        .said-log .entry li{font-size:13.5px;line-height:1.7;color:var(--dim)}
        .said-log .entry li b{color:var(--ink);font-weight:500}
        @media (max-width:700px){.said-log .entry{grid-template-columns:20px 1fr}.said-log .entry .date{grid-column:2;text-align:left;order:-1;margin-bottom:6px}.said-log .spine{grid-row:span 2}}
      `}</style>
    </div>
  );
}
