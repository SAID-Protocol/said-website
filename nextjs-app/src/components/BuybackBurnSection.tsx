'use client';

import { useMemo, useState } from 'react';
import type { BurnsPayload } from '@/lib/burns';

const TOTAL_SUPPLY = 1_000_000_000;

const Icons = {
  flame: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  cart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  ),
};

function formatTokenAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
}

function formatDate(blockTime: number): string {
  return new Date(blockTime * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function shortSig(sig: string): string {
  return `${sig.slice(0, 6)}…${sig.slice(-4)}`;
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 text-zinc-400 mb-3">
        <span className="text-white">{icon}</span>
        <span className="text-sm uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
      {sub ? <div className="text-sm text-zinc-500 mt-1">{sub}</div> : null}
    </div>
  );
}

const VISIBLE_STEP = 10;

export default function BuybackBurnSection({ initialData }: { initialData: BurnsPayload }) {
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP);

  const data = initialData;
  const error = data.error ?? null;
  const visibleEvents = useMemo(
    () => data.events.slice(0, visibleCount),
    [data.events, visibleCount],
  );
  const hasMore = data.events.length > visibleCount;
  const burnedPctSupply = (data.totalBurned / TOTAL_SUPPLY) * 100;

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-white">{Icons.flame}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Buybacks & Burns</h2>
        </div>
        <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
          A portion of treasury revenue is used to buy $SAID off the open market and burn it. Burns
          happen on a weekly cadence, reducing circulating supply over time.
        </p>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={Icons.flame}
            label="Total Burned"
            value={error ? '—' : `${formatTokenAmount(data.totalBurned)} SAID`}
            sub={error ? undefined : `${burnedPctSupply.toFixed(4)}% of supply`}
          />
          <StatCard
            icon={Icons.cart}
            label="Total Bought Back"
            value={error ? '—' : `${formatTokenAmount(data.totalBoughtBack)} SAID`}
            sub={error ? undefined : `${data.buybackCount} buyback ${data.buybackCount === 1 ? 'tx' : 'txs'}`}
          />
          <StatCard
            icon={Icons.chart}
            label="Burns Executed"
            value={error ? '—' : `${data.burnCount}`}
            sub={error ? undefined : 'Weekly cadence'}
          />
        </div>

        {/* Next Burn */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <span className="text-white mt-1">{Icons.calendar}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Next Scheduled Burn</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Burns are executed weekly. Specific day and amount announced on Twitter ahead of each burn.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Cadence</div>
                  <div className="text-white font-semibold">Weekly</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Funded By</div>
                  <div className="text-white font-semibold">Treasury creator rewards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">History</h3>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/10 text-xs text-zinc-500 uppercase tracking-wider">
              <div className="col-span-3">Date</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-3 text-right">Tx</div>
            </div>

            {error ? (
              <div className="px-6 py-10 text-center text-zinc-500 text-sm">
                Couldn&apos;t load on-chain data. Try again later.
              </div>
            ) : visibleEvents.length === 0 ? (
              <div className="px-6 py-10 text-center text-zinc-500 text-sm">
                No burns or buybacks detected in recent history.
              </div>
            ) : (
              visibleEvents.map((e) => (
                <div
                  key={`${e.signature}-${e.type}`}
                  className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 last:border-b-0 text-sm items-center"
                >
                  <div className="col-span-3 text-zinc-300">{formatDate(e.blockTime)}</div>
                  <div className="col-span-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${
                        e.type === 'burn'
                          ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {e.type === 'burn' ? Icons.flame : Icons.cart}
                      {e.type === 'burn' ? 'Burn' : 'Buyback'}
                    </span>
                  </div>
                  <div className="col-span-3 text-white font-mono">
                    {formatTokenAmount(e.amount)}
                  </div>
                  <div className="col-span-3 text-right">
                    <a
                      href={`https://solscan.io/tx/${e.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors font-mono text-xs"
                    >
                      {shortSig(e.signature)}
                      {Icons.external}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
          {hasMore ? (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + VISIBLE_STEP)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
