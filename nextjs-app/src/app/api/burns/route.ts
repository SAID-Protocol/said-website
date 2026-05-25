import { NextResponse } from 'next/server';
import {
  Connection,
  ParsedInstruction,
  PartiallyDecodedInstruction,
} from '@solana/web3.js';

export const revalidate = 300;

const WALLET = 'GFqYiHVb9XGuKavUBin5qzcsq1okjLFDV4ZCZNx5tupV';
const SAID_MINT = '4rWuWZei2iFNHYpnz5wjMeSvimsJcj5EgpSNvNS1pump';
const SAID_DECIMALS = 6;
const BUYBACK_PAGES = 30;
const PAGE_LIMIT = 100;

// Append confirmed burn tx signatures here. Each is fetched individually
// via Helius RPC and parsed for SPL/Token-2022 burn instructions. Cheap
// to keep growing — the wallet's lifetime history is too large to scan
// every request.
const KNOWN_BURN_SIGNATURES: string[] = [
  '5agrBigR29C6HaJkZweqawyiWYXiiV99epdYgAQNK8aCgwAiHyMq2nyDBK74op2jCbtSvN4YtPkZS7jTQU24gkX2',
];

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

type HeliusTx = {
  signature: string;
  timestamp: number;
  type?: string;
  tokenTransfers?: HeliusTokenTransfer[];
};

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

async function fetchRecentBuybacks(apiKey: string): Promise<BurnEvent[]> {
  const events: BurnEvent[] = [];
  let before: string | undefined;
  for (let page = 0; page < BUYBACK_PAGES; page++) {
    const url = new URL(`https://api.helius.xyz/v0/addresses/${WALLET}/transactions`);
    url.searchParams.set('api-key', apiKey);
    url.searchParams.set('limit', String(PAGE_LIMIT));
    if (before) url.searchParams.set('before', before);

    const res = await fetchWithRetry(url.toString());
    if (res.status === 404) break;
    if (!res.ok) {
      throw new Error(`Helius ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    const txs = (await res.json()) as HeliusTx[];
    if (!Array.isArray(txs) || txs.length === 0) break;

    for (const tx of txs) {
      const transfers = (tx.tokenTransfers ?? []).filter((t) => t.mint === SAID_MINT);
      const incoming = transfers
        .filter((t) => t.toUserAccount === WALLET)
        .reduce((s, t) => s + (t.tokenAmount || 0), 0);
      const outgoing = transfers
        .filter((t) => t.fromUserAccount === WALLET)
        .reduce((s, t) => s + (t.tokenAmount || 0), 0);
      const delta = incoming - outgoing;
      if (delta > 0.000001) {
        events.push({
          signature: tx.signature,
          blockTime: tx.timestamp,
          type: 'buyback',
          amount: delta,
        });
      }
    }

    before = txs[txs.length - 1].signature;
    if (txs.length < PAGE_LIMIT) break;
    await sleep(120);
  }
  return events;
}

async function fetchKnownBurns(conn: Connection): Promise<BurnEvent[]> {
  if (KNOWN_BURN_SIGNATURES.length === 0) return [];

  const events: BurnEvent[] = [];
  // Sequentially to avoid bursting the RPC.
  for (const sig of KNOWN_BURN_SIGNATURES) {
    let tx;
    try {
      tx = await conn.getParsedTransaction(sig, { maxSupportedTransactionVersion: 0 });
    } catch {
      continue;
    }
    if (!tx || tx.meta?.err) continue;
    const blockTime = tx.blockTime ?? 0;
    if (!blockTime) continue;

    const allIx: (ParsedInstruction | PartiallyDecodedInstruction)[] = [
      ...tx.transaction.message.instructions,
      ...(tx.meta?.innerInstructions?.flatMap((ii) => ii.instructions) ?? []),
    ];

    let burned = 0;
    for (const ix of allIx) {
      const parsed = (ix as ParsedInstruction).parsed;
      if (!parsed || typeof parsed !== 'object') continue;
      if (parsed.type !== 'burn' && parsed.type !== 'burnChecked') continue;
      const info = parsed.info as {
        mint?: string;
        amount?: string;
        tokenAmount?: { uiAmount?: number };
      };
      if (info.mint !== SAID_MINT) continue;
      const amt =
        parsed.type === 'burnChecked'
          ? Number(info.tokenAmount?.uiAmount ?? 0)
          : Number(info.amount ?? 0) / 10 ** SAID_DECIMALS;
      if (amt > 0) burned += amt;
    }

    if (burned > 0) {
      events.push({ signature: sig, blockTime, type: 'burn', amount: burned });
    }

    await sleep(100);
  }

  return events;
}

export async function GET() {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'HELIUS_API_KEY not configured' }, { status: 500 });
  }

  const conn = new Connection(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, 'confirmed');

  let burns: BurnEvent[] = [];
  let buybacks: BurnEvent[] = [];
  try {
    const [bb, br] = await Promise.all([
      fetchRecentBuybacks(apiKey),
      fetchKnownBurns(conn),
    ]);
    buybacks = bb;
    burns = br;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'fetch failed' },
      { status: 502 },
    );
  }

  // Pin all burns to the top of the visible list (sorted newest-first),
  // then append the most recent buybacks. Burns are rare and the
  // marketing event; buybacks happen every few seconds.
  const sortedBurns = [...burns].sort((a, b) => b.blockTime - a.blockTime);
  const recentBuybacks = buybacks.slice(0, 100);
  const visibleEvents = [...sortedBurns, ...recentBuybacks];

  return NextResponse.json({
    totalBurned: burns.reduce((s, e) => s + e.amount, 0),
    totalBoughtBack: buybacks.reduce((s, e) => s + e.amount, 0),
    burnCount: burns.length,
    buybackCount: buybacks.length,
    events: visibleEvents,
    updatedAt: Date.now(),
  });
}
