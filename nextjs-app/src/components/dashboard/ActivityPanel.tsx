'use client';

import {
  BarChartIcon,
  CogIcon,
  MessageCircleIcon,
  ShieldIcon,
  SparklesIcon,
  TrendingUpIcon,
} from '@/components/host/icons';

type ActivityType = 'message' | 'trade' | 'system' | 'error' | 'skill';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

const activityItems: ActivityItem[] = [
  {
    id: 'a1',
    type: 'message',
    title: 'User requested portfolio summary',
    description: 'Generated a concise wallet overview and highlighted the largest 24h position change.',
    timestamp: '2m ago',
  },
  {
    id: 'a2',
    type: 'trade',
    title: 'Simulated SOL rebalance completed',
    description: 'Executed demo rebalance workflow with 0.4% slippage and logged post-trade metrics.',
    timestamp: '9m ago',
  },
  {
    id: 'a3',
    type: 'skill',
    title: 'Web research skill invoked',
    description: 'Collected the latest protocol mentions and summarized sentiment across monitored sources.',
    timestamp: '18m ago',
  },
  {
    id: 'a4',
    type: 'system',
    title: 'Instruction version deployed',
    description: 'Loaded program.md v12 and scheduled it for the next task execution window.',
    timestamp: '31m ago',
  },
  {
    id: 'a5',
    type: 'error',
    title: 'Transfer request blocked',
    description: 'Amount exceeded baseline threshold and destination address was not allowlisted.',
    timestamp: '44m ago',
  },
  {
    id: 'a6',
    type: 'system',
    title: 'Runtime health check passed',
    description: 'Memory, queue depth, and outbound task latency remained within expected limits.',
    timestamp: '1h ago',
  },
];

const typeStyles: Record<ActivityType, { icon: React.ReactNode; badge: string }> = {
  message: {
    icon: <MessageCircleIcon size={16} />,
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  },
  trade: {
    icon: <TrendingUpIcon size={16} />,
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  },
  system: {
    icon: <CogIcon size={16} />,
    badge: 'border-white/10 bg-zinc-900 text-zinc-300',
  },
  error: {
    icon: <ShieldIcon size={16} />,
    badge: 'border-red-500/20 bg-red-500/10 text-red-300',
  },
  skill: {
    icon: <SparklesIcon size={16} />,
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  },
};

export default function ActivityPanel() {
  return (
    <section className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-white">
          <BarChartIcon size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Activity Feed</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-400">Recent agent actions, tools, and runtime events.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <div className="space-y-3">
          {activityItems.map((item) => {
            const styles = typeStyles[item.type];

            return (
              <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg border p-2 ${styles.badge}`}>{styles.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-medium text-white">{item.title}</h3>
                      <span className="shrink-0 text-xs text-zinc-500">{item.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
