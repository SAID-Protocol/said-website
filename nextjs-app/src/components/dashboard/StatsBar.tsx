'use client';

import { useEffect, useState } from 'react';
import { Agent, api } from '@/lib/api';

interface StatsBarProps {
  agent: Agent;
}

function StatCard({ label, value, extra }: { label: string; value: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
      <span className="text-xs text-zinc-500">{label}</span>
      <div className="flex items-center gap-2 text-sm font-medium text-white">{value}</div>
      {extra}
    </div>
  );
}

const statusColors = {
  running: 'bg-emerald-500',
  paused: 'bg-amber-500',
  stopped: 'bg-zinc-500',
  creating: 'bg-blue-500',
  error: 'bg-red-500',
};

const tierLabels = {
  starter: 'Starter',
  pro: 'Pro',
  power: 'Power',
};

export default function StatsBar({ agent }: StatsBarProps) {
  const [usage, setUsage] = useState<{ llm: { used: number; limit: number } | null } | null>(null);
  
  useEffect(() => {
    async function fetchUsage() {
      try {
        const data = await api.getAgentUsage(agent.id);
        setUsage(data);
      } catch (err) {
        console.error('Failed to fetch usage:', err);
      }
    }
    
    fetchUsage();
    // Refresh usage every 30 seconds
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, [agent.id]);

  const creditsUsed = usage?.llm?.used ?? agent.aiCreditsUsed;
  const creditsLimit = usage?.llm?.limit ?? agent.aiCreditsLimit;
  const pct = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  // Calculate uptime if agent is running
  const uptime = agent.status === 'running' 
    ? calculateUptime(new Date(agent.updatedAt))
    : '—';

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard
        label="Status"
        value={
          <>
            <span className={`h-2 w-2 rounded-full ${statusColors[agent.status]}`} />
            {agent.status}
          </>
        }
      />
      <StatCard label="Tier" value={tierLabels[agent.tier]} />
      <StatCard label="Uptime" value={uptime} />
      <StatCard 
        label="Messages" 
        value="—" 
      />
      <StatCard
        label="AI Credits"
        value={`${creditsUsed.toFixed(1)} / ${creditsLimit.toFixed(1)}`}
        extra={
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        }
      />
      <StatCard 
        label="SAID Identity" 
        value={agent.saidIdentity ? '✓' : '—'} 
      />
    </div>
  );
}

function calculateUptime(since: Date): string {
  const now = new Date();
  const diff = now.getTime() - since.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h`;
}
