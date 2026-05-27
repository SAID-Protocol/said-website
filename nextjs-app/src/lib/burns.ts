import {
  Connection,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  PublicKey,
} from '@solana/web3.js';

const CACHE_TTL_MS = 30 * 60 * 1000;

export type EventKind = 'burn' | 'buyback';

export type BurnEvent = {
  signature: string;
  blockTime: number;
  type: EventKind;
  amount: number;
};

export type BurnsPayload = {
  totalBurned: number;
  totalBoughtBack: number;
  burnCount: number;
  buybackCount: number;
  treasuryBalanceSol: number | null;
  treasuryRevenueSol: number | null;
  events: BurnEvent[];
  updatedAt: number;
  stale?: boolean;
  error?: string;
};

let cached: { payload: BurnsPayload; expiresAt: number } | null = null;

const WALLET = 'GFqYiHVb9XGuKavUBin5qzcsq1okjLFDV4ZCZNx5tupV';
const TREASURY_WALLET = '2XfHTeNWTjNwUmgoXaafYuqHcAAXj8F5Kjw2Bnzi4FxH';
const SAID_MINT = '4rWuWZei2iFNHYpnz5wjMeSvimsJcj5EgpSNvNS1pump';
const LAMPORTS_PER_SOL = 1_000_000_000;
const SAID_DECIMALS = 6;
const BUYBACK_PAGES = 100;
const PAGE_LIMIT = 100;
const MAX_VISIBLE_EVENTS = 1000;

// Append confirmed burn tx signatures here. Each is fetched individually
// via Helius RPC and parsed for SPL/Token-2022 burn instructions. Cheap
// to keep growing — the wallet's lifetime history is too large to scan
// every request.
const KNOWN_BURN_SIGNATURES: string[] = [
  '5agrBigR29C6HaJkZweqawyiWYXiiV99epdYgAQNK8aCgwAiHyMq2nyDBK74op2jCbtSvN4YtPkZS7jTQU24gkX2',
];

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
    const res = await fetch(url, { cache: 'no-store' });
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
    const url = new URL(`https://api-mainnet.helius-rpc.com/v0/addresses/${WALLET}/transactions`);
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

async function fetchTreasuryBalance(conn: Connection): Promise<number | null> {
  try {
    const lamports = await conn.getBalance(new PublicKey(TREASURY_WALLET), 'confirmed');
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return null;
  }
}

type HeliusAccountData = {
  account: string;
  nativeBalanceChange?: number;
};

type HeliusTreasuryTx = {
  signature: string;
  timestamp: number;
  accountData?: HeliusAccountData[];
};

async function fetchTreasuryWithdrawnLamports(apiKey: string): Promise<number | null> {
  let withdrawn = 0;
  let before: string | undefined;
  try {
    for (let page = 0; page < 50; page++) {
      const url = new URL(`https://api-mainnet.helius-rpc.com/v0/addresses/${TREASURY_WALLET}/transactions`);
      url.searchParams.set('api-key', apiKey);
      url.searchParams.set('limit', String(PAGE_LIMIT));
      if (before) url.searchParams.set('before', before);

      const res = await fetchWithRetry(url.toString());
      if (res.status === 404) break;
      if (!res.ok) throw new Error(`Helius ${res.status}`);
      const txs = (await res.json()) as HeliusTreasuryTx[];
      if (!Array.isArray(txs) || txs.length === 0) break;

      for (const tx of txs) {
        const treasuryAcct = (tx.accountData ?? []).find((a) => a.account === TREASURY_WALLET);
        const delta = treasuryAcct?.nativeBalanceChange ?? 0;
        if (delta < 0) withdrawn += -delta;
      }

      before = txs[txs.length - 1].signature;
      if (txs.length < PAGE_LIMIT) break;
      await sleep(120);
    }
    return withdrawn;
  } catch {
    return null;
  }
}

function emptyPayload(error?: string): BurnsPayload {
  return {
    totalBurned: 0,
    totalBoughtBack: 0,
    burnCount: 0,
    buybackCount: 0,
    treasuryBalanceSol: null,
    treasuryRevenueSol: null,
    events: [],
    updatedAt: Date.now(),
    error,
  };
}

export async function fetchBurnsData(): Promise<BurnsPayload> {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    return emptyPayload('HELIUS_API_KEY not configured');
  }

  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.payload;
  }

  const conn = new Connection(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, 'confirmed');

  let burns: BurnEvent[] = [];
  let buybacks: BurnEvent[] = [];
  let treasuryBalanceSol: number | null = null;
  let treasuryWithdrawnLamports: number | null = null;
  try {
    const [bb, br, treasury, withdrawn] = await Promise.all([
      fetchRecentBuybacks(apiKey),
      fetchKnownBurns(conn),
      fetchTreasuryBalance(conn),
      fetchTreasuryWithdrawnLamports(apiKey),
    ]);
    buybacks = bb;
    burns = br;
    treasuryBalanceSol = treasury;
    treasuryWithdrawnLamports = withdrawn;
  } catch (err) {
    if (cached) {
      return { ...cached.payload, stale: true };
    }
    return emptyPayload(err instanceof Error ? err.message : 'fetch failed');
  }

  const visibleEvents = [...burns, ...buybacks]
    .sort((a, b) => b.blockTime - a.blockTime)
    .slice(0, MAX_VISIBLE_EVENTS);

  const treasuryRevenueSol =
    treasuryBalanceSol !== null && treasuryWithdrawnLamports !== null
      ? treasuryBalanceSol + treasuryWithdrawnLamports / LAMPORTS_PER_SOL
      : null;

  const payload: BurnsPayload = {
    totalBurned: burns.reduce((s, e) => s + e.amount, 0),
    totalBoughtBack: buybacks.reduce((s, e) => s + e.amount, 0),
    burnCount: burns.length,
    buybackCount: buybacks.length,
    treasuryBalanceSol,
    treasuryRevenueSol,
    events: visibleEvents,
    updatedAt: Date.now(),
  };
  cached = { payload, expiresAt: now + CACHE_TTL_MS };
  return payload;
}
