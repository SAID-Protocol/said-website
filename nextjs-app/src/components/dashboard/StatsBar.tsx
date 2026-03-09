'use client';

import { CircleIcon, MessageCircleIcon, TrendingUpIcon } from '@/components/host/icons';

const stats = {
  status: 'Running',
  uptime: '3d 14h',
  messages: '1,247',
  trades: '34',
  creditsUsed: 3.2,
  creditsTotal: 5.0,
  revenue: '$12.40',
};

const creditPercent = Math.min((stats.creditsUsed / stats.creditsTotal) * 100, 100);

function StatCard({ label, value, detail }: { label: string; value: string; detail?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      {detail && <div className="mt-2">{detail}</div>}
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      <StatCard
        label="Status"
        value={stats.status}
        detail={
          <div className="inline-flex items-center gap-2 text-xs text-emerald-300">
            <CircleIcon size={10} color="#22C55E" />
            Agent online
          </div>
        }
      />
      <StatCard label="Uptime" value={stats.uptime} />
      <StatCard
        label="Messages"
        value={stats.messages}
        detail={
          <div className="inline-flex items-center gap-2 text-xs text-zinc-400">
            <MessageCircleIcon size={12} />
            Session traffic
          </div>
        }
      />
      <StatCard
        label="Trades"
        value={stats.trades}
        detail={
          <div className="inline-flex items-center gap-2 text-xs text-amber-300">
            <TrendingUpIcon size={12} />
            Executed workflows
          </div>
        }
      />
      <StatCard
        label="AI Credits"
        value={`${stats.creditsUsed.toFixed(1)} / ${stats.creditsTotal.toFixed(1)}`}
        detail={
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${creditPercent}%` }} />
            </div>
          </div>
        }
      />
      <StatCard label="Revenue" value={stats.revenue} />
    </div>
  );
}
