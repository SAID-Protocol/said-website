'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, Agent } from '@/lib/api';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import AgentList from '@/components/dashboard/AgentList';
import ChatPanel from '@/components/dashboard/ChatPanel';
import ProgramEditor from '@/components/dashboard/ProgramEditor';
import QuickSettings from '@/components/dashboard/QuickSettings';
import StatsBar from '@/components/dashboard/StatsBar';
import TerminalPanel from '@/components/dashboard/TerminalPanel';
import {
  BarChartIcon,
  CogIcon,
  EditIcon,
  MessageCircleIcon,
  TerminalIcon,
} from '@/components/host/icons';

type SideTab = 'instructions' | 'settings' | 'terminal' | 'activity';
type MobileTab = 'chat' | 'instructions' | 'settings' | 'terminal' | 'activity';

const mobileTabs: Array<{ id: MobileTab; label: string; icon: React.ReactNode }> = [
  { id: 'chat', label: 'Chat', icon: <MessageCircleIcon size={16} /> },
  { id: 'instructions', label: 'Instructions', icon: <EditIcon size={16} /> },
  { id: 'settings', label: 'Settings', icon: <CogIcon size={16} /> },
  { id: 'terminal', label: 'Terminal', icon: <TerminalIcon size={16} /> },
  { id: 'activity', label: 'Activity', icon: <BarChartIcon size={16} /> },
];

const sideTabs: Array<{ id: SideTab; label: string; icon: React.ReactNode }> = [
  { id: 'instructions', label: 'Instructions', icon: <EditIcon size={16} /> },
  { id: 'terminal', label: 'Terminal', icon: <TerminalIcon size={16} /> },
  { id: 'activity', label: 'Activity', icon: <BarChartIcon size={16} /> },
  { id: 'settings', label: 'Settings', icon: <CogIcon size={16} /> },
];

function TabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: {
  tabs: Array<{ id: T; label: string; icon: React.ReactNode }>;
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`.trim()}>
      <div className="inline-flex min-w-full gap-1 rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md sm:min-w-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-500 text-black'
                  : 'text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent');

  const [sideTab, setSideTab] = useState<SideTab>('instructions');
  const [mobileTab, setMobileTab] = useState<MobileTab>('chat');

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        if (agentId) {
          const { agent } = await api.getAgent(agentId);
          setSelectedAgent(agent);
        } else {
          const allAgents = await api.listAgents();
          setAgents(allAgents);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [agentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-zinc-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!agentId || !selectedAgent) {
    return (
      <div className="min-h-screen bg-black px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Your Agents</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Select an agent to view its dashboard and manage settings.
            </p>
          </div>
          <AgentList agents={agents} />
        </div>
      </div>
    );
  }

  const renderSideContent = (tab: SideTab | MobileTab) => {
    switch (tab) {
      case 'instructions':
        return <ProgramEditor agent={selectedAgent} />;
      case 'settings':
        return <QuickSettings />;
      case 'terminal':
        return <TerminalPanel />;
      case 'activity':
        return <ActivityPanel agentId={selectedAgent.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-black px-4 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl min-h-0 flex-col overflow-hidden pb-6">
        <div className="flex-none pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="text-zinc-500 transition hover:text-white"
                title="Back to agents"
              >
                ←
              </a>
              <div>
                <h1 className="text-2xl font-semibold text-white">{selectedAgent.name}</h1>
                <p className="text-sm text-zinc-500">
                  {selectedAgent.tier.charAt(0).toUpperCase() + selectedAgent.tier.slice(1)} tier · Created {new Date(selectedAgent.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${selectedAgent.status === 'running' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
              <span className="text-sm text-zinc-400">{selectedAgent.status === 'running' ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        <div className="flex-none pb-6">
          <StatsBar agent={selectedAgent} />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full min-h-0 flex-col overflow-hidden lg:hidden">
            <TabBar tabs={mobileTabs} activeTab={mobileTab} onChange={setMobileTab} className="mb-4 flex-none" />
            <div className="min-h-0 flex-1 overflow-hidden">
              {mobileTab === 'chat' ? (
                <ChatPanel agentId={selectedAgent.id} />
              ) : (
                <div className="h-full overflow-y-auto">
                  {renderSideContent(mobileTab)}
                </div>
              )}
            </div>
          </div>

          <div className="hidden h-full min-h-0 gap-6 overflow-hidden lg:grid lg:grid-cols-5">
            <div className="min-h-0 lg:col-span-3">
              <ChatPanel agentId={selectedAgent.id} />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-2">
              <TabBar tabs={sideTabs} activeTab={sideTab} onChange={setSideTab} className="mb-4 flex-none" />
              <div className="min-h-0 flex-1 overflow-hidden">
                {renderSideContent(sideTab)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
