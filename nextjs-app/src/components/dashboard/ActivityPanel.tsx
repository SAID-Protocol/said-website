'use client';

import {
  AlertTriangleIcon,
  BarChartIcon,
  CogIcon,
  MessageCircleIcon,
  SparklesIcon,
  TrendingUpIcon,
} from '@/components/host/icons';

export interface ActivityItem {
  id: string;
  type: 'message' | 'trade' | 'system' | 'error' | 'skill';
  title: string;
  description?: string;
  timestamp: Date;
}

const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: '1',
    type: 'system',
    title: 'Agent runtime healthy',
    description: 'Container heartbeat received and process supervisor reports all services online.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: '2',
    type: 'message',
    title: 'Responded to portfolio summary request',
    description: 'Generated a concise overview with current positions, recent fills, and next actions.',
    timestamp: new Date(Date.now() - 11 * 60 * 1000),
  },
  {
    id: '3',
    type: 'skill',
    title: 'Research skill executed',
    description: 'Collected three external sources and prepared a structured brief for review.',
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
  },
  {
    id: '4',
    type: 'trade',
    title: 'Trade opportunity evaluated',
    description: 'Risk filter passed, but execution was skipped because confidence remained below threshold.',
    timestamp: new Date(Date.now() - 54 * 60 * 1000),
  },
  {
    id: '5',
    type: 'error',
    title: 'Retry handled for market data fetch',
    description: 'Primary provider timed out once. Secondary fetch completed successfully on retry.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

function formatRelativeTime(timestamp: Date) {
  const diffMs = Date.now() - timestamp.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

const typeStyles = {
  message: {
    icon: MessageCircleIcon,
    accent: 'text-blue-300',
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
  },
  trade: {
    icon: TrendingUpIcon,
    accent: 'text-amber-300',
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
  },
  system: {
    icon: CogIcon,
    accent: 'text-emerald-300',
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
  },
  error: {
    icon: AlertTriangleIcon,
    accent: 'text-red-300',
    badge: 'border-red-500/20 bg-red-500/10 text-red-200',
  },
  skill: {
    icon: SparklesIcon,
    accent: 'text-violet-300',
    badge: 'border-violet-500/20 bg-violet-500/10 text-violet-200',
  },
} as const;

export default function ActivityPanel() {
  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 text-white">
          <BarChartIcon size={16} className="text-amber-500" />
          <h2 className="text-base font-semibold">Activity Feed</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          A live stream of recent agent actions, system events, skills, and execution outcomes.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
        {ACTIVITY_ITEMS.map((item) => {
          const style = typeStyles[item.type];
          const Icon = style.icon;

          return (
            <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start gap-3">
                <div className={`rounded-lg border border-white/10 bg-black/30 p-2 ${style.accent}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${style.badge}`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-zinc-500">{formatRelativeTime(item.timestamp)}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-white">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
