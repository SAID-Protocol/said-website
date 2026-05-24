import { NextResponse } from 'next/server';

export const revalidate = 300;

const WALLET = 'GFqYiHVb9XGuKavUBin5qzcsq1okjLFDV4ZCZNx5tupV';
const SAID_MINT = '4rWuWZei2iFNHYpnz5wjMeSvimsJcj5EgpSNvNS1pump';
const MAX_PAGES = 30;
const PAGE_LIMIT = 100;
const BURN_QUERY_PAGES = 5;
const KNOWN_BURN_ADDRESSES = new Set([
  '1nc1nerator11111111111111111111111111111111',
]);

type EventKind = 'burn' | 'buyback';

type BurnEvent = {
  signature: string;
  blockTime: number;
  type: EventKind;
  amount: number;
};

type HeliusTokenTransfer = {
  fromUserAccount?: string | null;
  toUserAccount?: string | null;
  mint: string;
  tokenAmount: number;
};

type HeliusInstruction = {
  programId?: string;
  parsed?: { type?: string; info?: { mint?: string; amount?: string | number; tokenAmount?: { uiAmount?: number } } };
  innerInstructions?: HeliusInstruction[];
};

type HeliusTx = {
  signature: string;
  timestamp: number;
  type?: string;
  tokenTransfers?: HeliusTokenTransfer[];
  instructions?: HeliusInstruction[];
};

function classifyTx(tx: HeliusTx): BurnEvent[] {
  const out: BurnEvent[] = [];
  const transfers = (tx.tokenTransfers ?? []).filter((t) => t.mint === SAID_MINT);

  const inAmt = transfers
    .filter((t) => t.toUserAccount === WALLET)
    .reduce((s, t) => s + (t.tokenAmount || 0), 0);
  const outAmt = transfers
    .filter((t) => t.fromUserAccount === WALLET)
    .reduce((s, t) => s + (t.tokenAmount || 0), 0);
  const toBurnAddr = transfers
    .filter(
      (t) =>
        t.fromUserAccount === WALLET &&
        (t.toUserAccount == null || (t.toUserAccount && KNOWN_BURN_ADDRESSES.has(t.toUserAccount))),
    )
    .reduce((s, t) => s + (t.tokenAmount || 0), 0);

  let burnFromIx = 0;
  const visit = (ix: HeliusInstruction) => {
    const t = ix.parsed?.type;
    if ((t === 'burn' || t === 'burnChecked') && ix.parsed?.info?.mint === SAID_MINT) {
      const info = ix.parsed.info;
      const amt =
        t === 'burnChecked'
          ? Number(info.tokenAmount?.uiAmount ?? 0)
          : Number(info.amount ?? 0) / 1_000_000;
      if (amt > 0) burnFromIx += amt;
    }
    for (const inner of ix.innerInstructions ?? []) visit(inner);
  };
  for (const ix of tx.instructions ?? []) visit(ix);

  const burnAmount = Math.max(burnFromIx, toBurnAddr, tx.type === 'BURN' ? outAmt : 0);

  if (burnAmount > 0.000001) {
    out.push({ signature: tx.signature, blockTime: tx.timestamp, type: 'burn', amount: burnAmount });
  }

  const buybackAmount = inAmt - Math.max(0, outAmt - burnAmount);
  if (buybackAmount > 0.000001 && tx.type !== 'BURN') {
    out.push({ signature: tx.signature, blockTime: tx.timestamp, type: 'buyback', amount: buybackAmount });
  }

  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, attempts = 4): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (res.ok) return res;
    if (res.status !== 429 && res.status < 500) return res;
    lastErr = `Helius ${res.status}`;
    await sleep(400 * Math.pow(2, i));
  }
  throw new Error(typeof lastErr === 'string' ? lastErr : 'retry exhausted');
}

async function paginate(
  apiKey: string,
  maxPages: number,
  type?: string,
): Promise<HeliusTx[]> {
  const all: HeliusTx[] = [];
  let before: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const url = new URL(`https://api.helius.xyz/v0/addresses/${WALLET}/transactions`);
    url.searchParams.set('api-key', apiKey);
    url.searchParams.set('limit', String(PAGE_LIMIT));
    if (type) url.searchParams.set('type', type);
    if (before) url.searchParams.set('before', before);

    const res = await fetchWithRetry(url.toString());
    if (res.status === 404) break;
    if (!res.ok) {
      throw new Error(`Helius ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    const txs = (await res.json()) as HeliusTx[];
    if (!Array.isArray(txs) || txs.length === 0) break;
    all.push(...txs);
    before = txs[txs.length - 1].signature;
    if (txs.length < PAGE_LIMIT) break;
    await sleep(120);
  }
  return all;
}

export async function GET() {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'HELIUS_API_KEY not configured' }, { status: 500 });
  }

  const events: BurnEvent[] = [];

  try {
    const burnTxs = await paginate(apiKey, BURN_QUERY_PAGES, 'BURN');
    const recentTxs = await paginate(apiKey, MAX_PAGES);

    const seenSigs = new Set<string>();
    const merged = [...burnTxs, ...recentTxs].filter((tx) => {
      if (seenSigs.has(tx.signature)) return false;
      seenSigs.add(tx.signature);
      return true;
    });

    for (const tx of merged) {
      events.push(...classifyTx(tx));
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'fetch failed' },
      { status: 502 },
    );
  }

  events.sort((a, b) => b.blockTime - a.blockTime);

  const burns = events.filter((e) => e.type === 'burn');
  const buybacks = events.filter((e) => e.type === 'buyback');

  return NextResponse.json({
    totalBurned: burns.reduce((s, e) => s + e.amount, 0),
    totalBoughtBack: buybacks.reduce((s, e) => s + e.amount, 0),
    burnCount: burns.length,
    buybackCount: buybacks.length,
    events: events.slice(0, 50),
    updatedAt: Date.now(),
  });
}
