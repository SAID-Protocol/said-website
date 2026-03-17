'use client';

import { useEffect, useState } from 'react';
import { ActivityItem, api } from '@/lib/api';
import {
  BarChartIcon,
  CogIcon,
  MessageCircleIcon,
  ShieldIcon,
  SparklesIcon,
  TrendingUpIcon,
} from '@/components/host/icons';

interface ActivityPanelProps {
  agentId: string;
}

const typeStyles: Record<string, { icon: React.ReactNode; badge: string }> = {
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
  chat: {
    icon: <MessageCircleIcon size={16} />,
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  },
  default: {
    icon: <BarChartIcon size={16} />,
    badge: 'border-white/10 bg-zinc-900 text-zinc-300',
  },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function ActivityPanel({ agentId }: ActivityPanelProps) {
  const [logs, setLogs] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await api.getAgentLogs(agentId);
        setLogs(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
    
    // Poll for new logs every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    
    // Also refresh on tab focus
    const handleFocus = () => fetchLogs();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [agentId]);

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
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-zinc-400">Loading activity...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Error: {error}</p>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full border border-white/10 bg-white/5 p-4">
              <BarChartIcon size={24} className="text-zinc-500" />
            </div>
            <p className="mt-4 text-sm font-medium text-white">No activity yet</p>
            <p className="mt-1 max-w-sm text-xs text-zinc-500">
              Start chatting to see analytics here.
            </p>
          </div>
        )}

        {!loading && !error && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((item) => {
              const styles = typeStyles[item.type] || typeStyles.default;
              
              // Parse data if it's JSON
              let description = item.data || 'No details';
              try {
                if (item.data) {
                  const parsed = JSON.parse(item.data);
                  if (parsed.message) {
                    description = parsed.message;
                  } else if (typeof parsed === 'string') {
                    description = parsed;
                  }
                }
              } catch {
                // Use raw data if not JSON
              }

              return (
                <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg border p-2 ${styles.badge}`}>{styles.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-medium text-white capitalize">{item.type}</h3>
                        <span className="shrink-0 text-xs text-zinc-500">
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
