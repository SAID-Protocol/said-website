'use client';

const stats = [
  { label: 'Status', value: 'Running', accent: 'status' },
  { label: 'Uptime', value: '3d 14h' },
  { label: 'Messages', value: '1,247' },
  { label: 'Trades', value: '34' },
  { label: 'Revenue', value: '$12.40' },
] as const;

export default function StatsBar() {
  const creditsUsed = 3.2;
  const creditsTotal = 5.0;
  const creditsPercent = (creditsUsed / creditsTotal) * 100;

  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:p-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">{stat.label}</p>
            <div className="mt-2 flex items-center gap-2">
              {stat.accent === 'status' && <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />}
              <p className="text-sm font-semibold text-white sm:text-base">{stat.value}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">AI Credits</p>
            <span className="text-xs text-zinc-400">3.2/5.0</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-amber-500" style={{ width: `${creditsPercent}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
