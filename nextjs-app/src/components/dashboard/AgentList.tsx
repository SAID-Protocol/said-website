'use client';

import { Agent } from '@/lib/api';
import Link from 'next/link';

const statusColors = {
  running: 'bg-emerald-500',
  paused: 'bg-amber-500',
  stopped: 'bg-zinc-500',
  creating: 'bg-blue-500',
  error: 'bg-red-500',
};

const tierLabels = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  power: 'Power',
};

interface AgentListProps {
  agents: Agent[];
}

export default function AgentList({ agents }: AgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
        <p className="text-zinc-400">No agents found. Create your first agent to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Link
          key={agent.id}
          href={`/dashboard?agent=${agent.id}`}
          className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-amber-500 transition">
                {agent.name}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                {tierLabels[agent.tier]}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1">
              <span className={`h-2 w-2 rounded-full ${statusColors[agent.status]}`} />
              <span className="text-xs text-zinc-300">{agent.status}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>AI Credits:</span>
              <span className="text-white">
                {agent.aiCreditsUsed.toFixed(1)} / {agent.aiCreditsLimit.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span className="text-white">
                {new Date(agent.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
