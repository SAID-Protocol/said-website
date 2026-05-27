'use client';

import { useEffect, useState } from 'react';

function formatMarketCap(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function MarketCap({ tokenAddress }: { tokenAddress: string }) {
  const [marketCap, setMarketCap] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)
        .then((r) => r.json())
        .then((d: { pairs?: { marketCap?: number; liquidity?: { usd?: number } }[] }) => {
          if (cancelled) return;
          const pairs = d.pairs ?? [];
          const top = pairs.reduce<typeof pairs[number] | null>((best, p) => {
            const liq = p.liquidity?.usd ?? 0;
            const bestLiq = best?.liquidity?.usd ?? -1;
            return liq > bestLiq ? p : best;
          }, null);
          if (top && typeof top.marketCap === 'number') setMarketCap(top.marketCap);
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [tokenAddress]);

  return (
    <div className="mt-4">
      <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5">
        <span className="text-xs uppercase tracking-wider text-zinc-500">Market Cap</span>
        <span className="text-zinc-700">·</span>
        <span className="text-sm text-white font-semibold">
          {marketCap !== null ? formatMarketCap(marketCap) : '—'}
        </span>
      </div>
    </div>
  );
}
