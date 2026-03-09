'use client';

function StatCard({ label, value, extra }: { label: string; value: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
      <span className="text-xs text-zinc-500">{label}</span>
      <div className="flex items-center gap-2 text-sm font-medium text-white">{value}</div>
      {extra}
    </div>
  );
}

export default function StatsBar() {
  const creditsUsed = 3.2;
  const creditsLimit = 5.0;
  const pct = (creditsUsed / creditsLimit) * 100;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard
        label="Status"
        value={<><span className="h-2 w-2 rounded-full bg-emerald-500" />Running</>}
      />
      <StatCard label="Uptime" value="3d 14h" />
      <StatCard label="Messages" value="1,247" />
      <StatCard label="Trades" value="34" />
      <StatCard
        label="AI Credits"
        value={`${creditsUsed} / ${creditsLimit}`}
        extra={
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
          </div>
        }
      />
      <StatCard label="Revenue" value="$12.40" />
    </div>
  );
}
