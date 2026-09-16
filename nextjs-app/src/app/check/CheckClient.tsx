'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';

type Verdict = 'backed' | 'issuer-claimed' | 'synthetic' | 'meme' | 'impersonator';

interface Reserve { ratio: number; custodians: string[]; asOf: string; fresh?: boolean }
interface Market { holders?: number | null; liquidityUsd?: number | null; launchpad?: string | null }
interface Passport {
  mint: string; symbol: string | null; name: string | null; verdict: Verdict; reasons: string[];
  issuer: { name: string; redeemable: string; proofOfReservesUrl?: string; caveat?: string } | null;
  identifiers: { isin?: string; underlyingSymbol?: string; underlyingIsin?: string; exchangeMic?: string } | null;
  reserve: Reserve | null; market: Market | null;
  impersonating: { imitates: { mint: string; symbol: string; issuer: string } } | null;
  disclosure: string[];
}
interface RealRow { mint: string; symbol: string; name: string; issuer: string; verdict: Verdict; isin: string | null; reserve: Reserve | null }
interface FakeRow { mint: string; symbol: string; name: string; liquidityUsd: number | null; holders: number | null; launchpad: string | null }
interface Dominant { mint: string; symbol: string; name: string; verifiedOnJupiter: boolean; liquidityUsd: number | null; holders: number | null }
interface SearchResult {
  query: string; summary: string; real: RealRow[]; impersonators: FakeRow[];
  notATokenizedAsset?: boolean; dominant?: Dominant | null; lookalikes?: FakeRow[]; seeded?: boolean; liquidCount?: number;
}

const LABEL: Record<Verdict, string> = { backed: 'Backed', 'issuer-claimed': 'Issuer claim', synthetic: 'Synthetic', meme: 'Not a tokenized asset', impersonator: 'Impersonator' };
const TONE: Record<Verdict, string> = { backed: 'good', 'issuer-claimed': 'warn', synthetic: 'warn', meme: 'plain', impersonator: 'bad' };
const ISSUER: Record<string, string> = { backed: 'Backed Finance', ondo: 'Ondo Global Markets', backpack: 'Backpack Securities', prestocks: 'PreStocks', tessera: 'Tessera', shift: 'Shift' };

const short = (m: string) => `${m.slice(0, 6)}…${m.slice(-4)}`;
const money = (n?: number | null) => (n == null ? '—' : `$${Math.round(n).toLocaleString('en-US')}`);
const holders = (n?: number | null) => (n == null ? '' : `${n.toLocaleString('en-US')} holder${n === 1 ? '' : 's'}`);
const isMint = (s: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s);

/* A real result, captured 16 September 2026, so the page shows something
   true before anyone types. Live checks replace it. */
const SEED: SearchResult = {
  query: 'NVDAx', seeded: true, liquidCount: 16,
  summary: '1 real, 16 using the name, 16 of those with liquidity',
  real: [{ mint: 'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh', symbol: 'NVDAx', name: 'NVIDIA xStock', issuer: 'backed', verdict: 'backed', isin: 'CH1436219195', reserve: { ratio: 1.0018, custodians: ['Alpaca'], asOf: '2026-09-16T06:00:22.361Z' } }],
  impersonators: [
    { mint: '9F7Wv2bPB8LUo8obqXLuh4yVXbvoqtaVqpyy6U5N4aKF', symbol: 'NVDAx', name: 'NVIDIA xStock', liquidityUsd: 3136, holders: 1, launchpad: 'pump.fun' },
    { mint: 'Dn8CGUZr61mBJK1qqhvM7RKL6CvwXnABHrJuiDRspump', symbol: 'NVDAx', name: 'NVIDIA xStock', liquidityUsd: 3081, holders: 18, launchpad: 'pump.fun' },
    { mint: '6g95Bc68Wn5VazCvazzuHiC3waABJfu9srpjSaMZpump', symbol: 'NVDAx', name: 'NVDAx', liquidityUsd: 3000, holders: 1, launchpad: 'pump.fun' },
    { mint: '2kwvU12Zy5rN2iNQyKJhYFgGDfMiNwKnyEVKiApyLPjF', symbol: 'NVDAx', name: 'NVIDIA xStock', liquidityUsd: 2902, holders: 10, launchpad: 'pump.fun' },
  ],
};

function CopyMint({ mint }: { mint: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="addr">
      <span className="l">MINT</span>
      <code>{mint}</code>
      <button className="copy" onClick={() => { navigator.clipboard?.writeText(mint).then(() => { setDone(true); setTimeout(() => setDone(false), 1400); }); }}>
        {done ? 'COPIED' : 'COPY'}
      </button>
    </div>
  );
}

function Facts({ items }: { items: Array<[string, React.ReactNode]> }) {
  if (!items.length) return null;
  return (
    <div className="facts">
      {items.map(([k, v]) => (
        <div className="fact" key={k}><span className="fk">{k}</span><span className="fv">{v}</span></div>
      ))}
    </div>
  );
}

function FakeList({ rows, more }: { rows: FakeRow[]; more: number }) {
  return (
    <div className="fakes">
      {rows.map((f) => (
        <div className="fake" key={f.mint}>
          <span className="dot" />
          <span className="fn">{f.name || f.symbol} <span className="mono fm">{short(f.mint)}</span></span>
          <span className="mono fnum">{money(f.liquidityUsd)}{f.holders != null ? ` · ${holders(f.holders)}` : ''}{f.launchpad ? ` · ${f.launchpad}` : ''}</span>
        </div>
      ))}
      {more > 0 && <div className="more mono">AND {more} MORE USING THIS NAME</div>}
    </div>
  );
}

function PassportView({ p }: { p: Passport }) {
  const ids = p.identifiers ?? {};
  const facts: Array<[string, React.ReactNode]> = [];
  if (p.issuer) facts.push(['ISSUER', p.issuer.name]);
  if (ids.isin) facts.push(['ISIN', <span className="mono" key="isin">{ids.isin}</span>]);
  if (ids.underlyingSymbol) facts.push(['TRACKS', `${ids.underlyingSymbol}${ids.exchangeMic ? ` on ${ids.exchangeMic}` : ''}`]);
  if (p.reserve) facts.push(['RESERVES', `${p.reserve.ratio.toFixed(4)}× cover${p.reserve.custodians.length ? ` at ${p.reserve.custodians.join(', ')}` : ''}`]);
  if (p.issuer?.proofOfReservesUrl) facts.push(['PROOF', <a key="proof" className="proof" href={p.issuer.proofOfReservesUrl} target="_blank" rel="noopener noreferrer">Check it yourself →</a>]);
  if (p.issuer) facts.push(['REDEEMABLE', p.issuer.redeemable]);
  if (p.impersonating) facts.push(['IMITATES', `${p.impersonating.imitates.symbol} · real mint ${short(p.impersonating.imitates.mint)}`]);
  if (p.market?.liquidityUsd != null) facts.push(['MARKET', `${money(p.market.liquidityUsd)} liquidity${p.market.holders != null ? ` · ${holders(p.market.holders)}` : ''}`]);
  return (
    <div className={`answer ${TONE[p.verdict]}`}>
      <span className="vlabel"><i />{LABEL[p.verdict]}</span>
      <h2 className="aname">{p.name || p.symbol || 'Unknown token'}</h2>
      {p.symbol && <div className="asym mono">{p.symbol}</div>}
      <CopyMint mint={p.mint} />
      <ul className="reasons">{p.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
      <Facts items={facts} />
      {p.disclosure?.[0] && <p className="disclosure">{p.disclosure[0]}</p>}
    </div>
  );
}

function SearchView({ d }: { d: SearchResult }) {
  if (d.notATokenizedAsset) {
    const dom = d.dominant;
    const look = d.lookalikes ?? [];
    if (!dom) return <p className="empty mono">NOTHING IS TRADING UNDER {d.query.toUpperCase()}.</p>;
    return (
      <>
        <div className="answer plain">
          <span className="vlabel"><i />Not a tokenized asset</span>
          <h2 className="aname">{dom.name || dom.symbol}</h2>
          <div className="asym mono">{dom.symbol}</div>
          <CopyMint mint={dom.mint} />
          <ul className="reasons">
            <li>No issuer publishes this as a tokenized real-world asset, so there is no share, bond or commodity behind it.</li>
            {dom.verifiedOnJupiter && <li>It is on Jupiter&apos;s verified list, so the ticker is recognised. That says nothing about backing either way.</li>}
          </ul>
          <Facts items={[['LIQUIDITY', money(dom.liquidityUsd)], ...(dom.holders != null ? [['HOLDERS', dom.holders.toLocaleString('en-US')] as [string, React.ReactNode]] : [])]} />
        </div>
        {look.length > 0 && (
          <>
            <h3 className="contrast"><em>{look.length} other token{look.length === 1 ? '' : 's'}</em> trade{look.length === 1 ? 's' : ''} under the same ticker.</h3>
            <FakeList rows={look.slice(0, 6)} more={Math.max(0, look.length - 6)} />
          </>
        )}
      </>
    );
  }
  const real = d.real[0];
  const fakes = d.impersonators ?? [];
  const liquid = d.liquidCount ?? fakes.filter((f) => (f.liquidityUsd ?? 0) > 0).length;
  const total = (/(\d+) using the name/.exec(d.summary ?? '') ?? [])[1] ?? String(fakes.length);
  return (
    <>
      {real && (
        <div className={`answer ${TONE[real.verdict]}`}>
          <span className="vlabel"><i />{LABEL[real.verdict]} · the real one</span>
          <h2 className="aname">{real.name}</h2>
          <div className="asym mono">{real.symbol}</div>
          <CopyMint mint={real.mint} />
          <Facts items={[
            ...(real.isin ? [['ISIN', <span className="mono" key="isin">{real.isin}</span>] as [string, React.ReactNode]] : []),
            ['ISSUER', ISSUER[real.issuer] ?? real.issuer],
            ...(real.reserve ? [
              ['RESERVES', `${real.reserve.ratio.toFixed(4)}× cover at ${real.reserve.custodians.join(', ')}`] as [string, React.ReactNode],
              ['PROOF', <a key="proof" className="proof" href={`https://api.xstocks.fi/api/v2/public/proof-of-reserves/${encodeURIComponent(real.symbol)}`} target="_blank" rel="noopener noreferrer">Check it yourself →</a>] as [string, React.ReactNode],
            ] : []),
          ]} />
        </div>
      )}
      {fakes.length > 0 && (
        <>
          <h3 className="contrast"><em>{total} other tokens</em> are trading under this name{liquid ? `, and ${liquid} of them can be bought right now.` : '.'}</h3>
          <FakeList rows={fakes.slice(0, 6)} more={Math.max(0, fakes.length - 6)} />
        </>
      )}
      {d.seeded && <p className="empty mono">A REAL CHECK RUN ON 16 SEPTEMBER 2026. TYPE ABOVE TO RUN A LIVE ONE.</p>}
    </>
  );
}

export default function CheckClient({ initialQuery }: { initialQuery: string | null }) {
  const [q, setQ] = useState(initialQuery ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passport, setPassport] = useState<Passport | null>(null);
  const [search, setSearch] = useState<SearchResult | null>(initialQuery ? null : SEED);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(async (raw: string) => {
    const query = raw.trim();
    if (!query) return;
    setBusy(true); setError(null);
    try {
      const mint = isMint(query);
      const res = await fetch(mint ? `/api/asset/${encodeURIComponent(query)}` : `/api/asset/search?q=${encodeURIComponent(query)}`, { headers: { accept: 'application/json' } });
      const body = await res.json();
      if (!res.ok) { setError(body.error ?? `HTTP ${res.status}`); return; }
      if (mint) { setPassport(body); setSearch(null); } else { setSearch(body); setPassport(null); }
      const url = new URL(window.location.href); url.searchParams.set('q', query); window.history.replaceState(null, '', url.toString());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the API.');
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { if (initialQuery) run(initialQuery); }, [initialQuery, run]);

  const submit = (e: React.FormEvent) => { e.preventDefault(); run(q); };
  const tryQ = (v: string) => { setQ(v); run(v); };

  return (
    <div className="said-page said-check">
      <div className="hero">
        <div className="kick">TOKENIZED STOCKS</div>
        <h1>Is it real?</h1>
        <p className="lede">Tokenized stocks now trade beside memecoins wearing the same ticker. Paste a ticker or a mint address and find out which one you are looking at, with the evidence.</p>

        <form className="searchrow" onSubmit={submit}>
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="NVDAx, or a mint address" autoComplete="off" spellCheck={false} aria-label="Ticker or mint address" />
          </div>
          <button type="submit" className="btn fill" disabled={busy}>{busy ? 'Checking…' : 'Check'}</button>
        </form>
        <p className="try mono">
          TRY {(['NVDAx', 'TSLAx', 'SPYx'] as const).map((t, i) => (
            <span key={t}>{i > 0 && ' · '}<button type="button" onClick={() => tryQ(t)}>{t}</button></span>
          ))} · <button type="button" onClick={() => tryQ('PreweJYECqtQwBtpxHL171nL2K6umo692gTm7Q3rpgF')}>A PRESTOCKS MINT</button>
        </p>
      </div>

      <DotSeam style={{ marginTop: 'clamp(20px,3vh,30px)' }} />

      <div className="results">
        {error && <div className="err">{error}</div>}
        {busy && !error && <p className="empty mono">CHECKING…</p>}
        {!busy && passport && <PassportView p={passport} />}
        {!busy && search && <SearchView d={search} />}
      </div>

      <div className="note">
        <p>Evidence comes from each issuer&apos;s own published feeds and from the chain. Nothing is marked backed without a reserve figure you can fetch yourself. Reserves are attested by the issuer&apos;s auditor; the circulating supply is verifiable on chain, the shares held at the custodian are not.</p>
        <p className="mono"><a href="https://api.saidprotocol.com/api/asset/issuers" target="_blank" rel="noopener noreferrer">WHO WE COVER →</a> · <a href="https://api.saidprotocol.com/openapi.json" target="_blank" rel="noopener noreferrer">API →</a></p>
      </div>

      <SaidFooter />

      <style>{`
        .said-check{--good:#3da35d;--warn:#d9a514;--bad:#b4432f}
        .said-check .searchrow{display:flex;gap:10px;margin-top:28px;max-width:720px}
        .said-check .search{flex:1;min-width:0;position:relative}
        .said-check .search input{padding-left:42px;border-radius:99px}
        .said-check .search svg{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--faint)}
        .said-check .searchrow .btn{white-space:nowrap}
        .said-check .searchrow .btn[disabled]{opacity:.5;cursor:default}
        .said-check .try{margin-top:14px;font-size:11.5px;letter-spacing:.12em;color:var(--faint)}
        .said-check .try button{background:none;border:0;padding:0;font:inherit;letter-spacing:inherit;color:var(--dim);cursor:pointer;border-bottom:1px solid var(--line)}
        .said-check .try button:hover{color:var(--ink);border-color:var(--ink)}

        .said-check .results{max-width:1280px;margin:0 auto;padding:clamp(24px,4vh,40px) clamp(20px,4vw,48px) 0}
        .said-check .results>*+*{margin-top:22px}
        .said-check .empty{font-size:11.5px;letter-spacing:.12em;color:var(--faint)}
        .said-check .err{border:1px solid var(--bad);border-radius:14px;padding:14px 18px;font-size:14px;color:var(--ink);max-width:720px}

        .said-check .answer{position:relative;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:clamp(22px,3vw,34px);max-width:820px}
        .said-check .vlabel{display:inline-flex;align-items:center;gap:9px;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
        .said-check .vlabel i{width:8px;height:8px;border-radius:50%;background:var(--faint)}
        .said-check .answer.good .vlabel{color:var(--good)} .said-check .answer.good .vlabel i{background:var(--good)}
        .said-check .answer.warn .vlabel{color:var(--warn)} .said-check .answer.warn .vlabel i{background:var(--warn)}
        .said-check .answer.bad .vlabel{color:var(--bad)} .said-check .answer.bad .vlabel i{background:var(--bad)}
        .said-check .aname{margin-top:14px;font-size:clamp(26px,3vw,38px);font-weight:500;letter-spacing:-.03em;line-height:1.08}
        .said-check .asym{margin-top:4px;font-size:12.5px;color:var(--faint);letter-spacing:.04em}
        .said-check .addr{margin-top:16px;background:var(--bg)}
        .said-check .reasons{margin:18px 0 0;padding:0;list-style:none}
        .said-check .reasons li{position:relative;padding-left:18px;margin-top:8px;font-size:14.5px;line-height:1.55;color:var(--ink)}
        .said-check .reasons li:before{content:"";position:absolute;left:0;top:9px;width:6px;height:6px;border-radius:50%;background:var(--faint)}
        .said-check .answer.good .reasons li:before{background:var(--good)}
        .said-check .answer.bad .reasons li:before{background:var(--bad)}
        .said-check .answer.warn .reasons li:before{background:var(--warn)}
        .said-check .facts{margin-top:22px;padding-top:18px;border-top:1px solid var(--line);display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px 22px}
        .said-check .fk{display:block;font-size:11px;letter-spacing:.14em;color:var(--faint);margin-bottom:5px}
        .said-check .fv{font-size:14px;line-height:1.45;color:var(--ink);word-break:break-word}
        .said-check .fv .mono{font-size:13px}
        .said-check .proof{color:var(--good);border-bottom:1px solid var(--line)}
        .said-check .proof:hover{border-color:var(--good)}
        .said-check .disclosure{margin-top:18px;padding-top:14px;border-top:1px solid var(--line);font-size:12.5px;line-height:1.6;color:var(--dim)}

        .said-check .contrast{max-width:820px;font-size:clamp(20px,2.4vw,28px);font-weight:500;letter-spacing:-.025em;line-height:1.25;color:var(--ink)}
        .said-check .contrast em{font-style:normal;color:var(--bad)}
        .said-check .fakes{max-width:820px;border:1px solid var(--line);border-radius:16px;overflow:hidden}
        .said-check .fake{display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid var(--line);font-size:13.5px}
        .said-check .fake:first-child{border-top:0}
        .said-check .fake .dot{width:6px;height:6px;border-radius:50%;background:var(--bad);flex:none;opacity:.8}
        .said-check .fake .fn{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dim)}
        .said-check .fake .fm{font-size:11px;color:var(--faint);margin-left:4px}
        .said-check .fake .fnum{margin-left:auto;font-size:12px;color:var(--dim);white-space:nowrap;font-variant-numeric:tabular-nums}
        .said-check .more{padding:10px 16px;font-size:10.5px;letter-spacing:.12em;color:var(--faint);background:var(--card);border-top:1px solid var(--line)}

        .said-check .note{max-width:1280px;margin:0 auto;padding:clamp(40px,7vh,72px) clamp(20px,4vw,48px)}
        .said-check .note p{max-width:64ch;font-size:13px;line-height:1.7;color:var(--dim)}
        .said-check .note p+p{margin-top:12px;font-size:11px;letter-spacing:.12em}
        .said-check .note a{color:var(--dim);border-bottom:1px solid var(--line)}
        .said-check .note a:hover{color:var(--ink);border-color:var(--ink)}

        @media (max-width:520px){
          .said-check .searchrow{flex-direction:column}
          .said-check .fake{flex-wrap:wrap;gap:6px 12px}
          .said-check .fake .fnum{margin-left:18px;white-space:normal}
        }
      `}</style>
    </div>
  );
}
