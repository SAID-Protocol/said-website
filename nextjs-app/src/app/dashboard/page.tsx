'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, Agent } from '@/lib/api';
import AgentList from '@/components/dashboard/AgentList';
import ChatPanel from '@/components/dashboard/ChatPanel';
import ConfigurePanel from '@/components/dashboard/ConfigurePanel';
import OverviewPanel from '@/components/dashboard/OverviewPanel';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import HostNavbar from '@/components/HostNavbar';
import AsciiBackground from '@/components/AsciiBackground';
import HostFooter from '@/components/HostFooter';
import { CogIcon, BarChartIcon, ShieldIcon } from '@/components/host/icons';

// Chat icon for tab
function ChatIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// Home/overview icon
function HomeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

type TabId = 'overview' | 'chat' | 'configure' | 'settings';

const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: 'overview', label: 'Overview', icon: <HomeIcon size={14} /> },
  { id: 'chat', label: 'Chat', icon: <ChatIcon size={14} /> },
  { id: 'configure', label: 'Configure', icon: <CogIcon size={14} /> },
  { id: 'settings', label: 'Settings', icon: <ShieldIcon size={14} /> },
];

function TabBar({
  activeTab,
  onChange,
  className = '',
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`.trim()}>
      <div className="inline-flex min-w-full gap-1 rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm sm:min-w-0">
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

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ llm: { used: number; limit: number; unit?: string } | null } | null>(null);

  // Listen for tab change events from child components
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail as TabId;
      if (tabs.some(t => t.id === tab)) setActiveTab(tab);
    };
    window.addEventListener('dashboard-tab', handler);
    return () => window.removeEventListener('dashboard-tab', handler);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        if (agentId) {
          const { agent } = await api.getAgent(agentId);
          setSelectedAgent(agent);
          
          try {
            const usageData = await api.getAgentUsage(agentId);
            setUsage(usageData);
          } catch (err) {
            console.error('Failed to fetch usage:', err);
          }
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

  // Auto-refresh usage
  useEffect(() => {
    if (!agentId) return;
    const interval = setInterval(async () => {
      try {
        const usageData = await api.getAgentUsage(agentId);
        setUsage(usageData);
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, [agentId]);

  if (loading) {
    return (
      <>
        <HostNavbar noCollapse />
        <AsciiBackground />
        <div className="relative z-10 min-h-screen px-4 pb-12 pt-24 sm:px-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-zinc-400">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HostNavbar noCollapse />
        <AsciiBackground />
        <div className="relative z-10 min-h-screen px-4 pb-12 pt-24 sm:px-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </>
    );
  }

  // Agent list view (no agent selected)
  if (!agentId || !selectedAgent) {
    return (
      <>
        <HostNavbar noCollapse />
        <AsciiBackground />
        <div className="relative z-10 min-h-screen px-4 pb-12 pt-24 sm:px-6">
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
      </>
    );
  }

  // Usage for header bar
  const creditsUsed = usage?.llm?.used ?? selectedAgent.aiCreditsUsed;
  const creditsLimit = usage?.llm?.limit ?? selectedAgent.aiCreditsLimit;
  const isPrompts = usage?.llm?.unit === 'prompts';
  const creditsPct = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  const renderContent = (tab: TabId) => {
    switch (tab) {
      case 'overview':
        return <OverviewPanel agent={selectedAgent} />;
      case 'chat':
        return <ChatPanel agentId={selectedAgent.id} />;
      case 'configure':
        return <ConfigurePanel agent={selectedAgent} />;
      case 'settings':
        return <SettingsPanel agent={selectedAgent} />;
      default:
        return null;
    }
  };

  return (
    <>
    <HostNavbar noCollapse />
    <AsciiBackground />
    <div className="relative z-10 h-screen overflow-hidden px-4 pt-24 sm:px-6">
      <div className="flex h-full min-h-0 flex-col overflow-hidden pb-6">

        {/* Top Bar: Agent name + status + usage */}
        <div className="flex-none pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-zinc-500 transition hover:text-white" title="Back to agents">←</a>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-white">{selectedAgent.name}</h1>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${selectedAgent.status === 'running' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                  <span className="text-sm text-zinc-400">
                    {selectedAgent.status === 'running' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                {selectedAgent.tier.charAt(0).toUpperCase() + selectedAgent.tier.slice(1)}
              </div>
              <div className="group relative min-w-[140px]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-sm text-white">{isPrompts ? creditsUsed : creditsUsed.toFixed(1)}</span>
                  <span className="text-xs text-zinc-500">/</span>
                  <span className="font-mono text-sm text-zinc-400">{isPrompts ? creditsLimit : creditsLimit.toFixed(1)}</span>
                  <span className="text-xs text-zinc-500">{isPrompts ? 'prompts' : 'credits'}</span>
                </div>
                <div className="pointer-events-none absolute -bottom-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 opacity-0 shadow-lg transition group-hover:opacity-100">
                  {isPrompts ? '7-day free trial — upgrade for unlimited usage' : 'AI credits refill monthly with your plan'}
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${Math.min(creditsPct, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Content */}
        <TabBar activeTab={activeTab} onChange={setActiveTab} className="flex-none mb-4" />

        <div className="min-h-0 flex-1 overflow-hidden">
          {activeTab === 'chat' ? (
            <ChatPanel agentId={selectedAgent.id} />
          ) : activeTab === 'overview' ? (
            <OverviewPanel agent={selectedAgent} />
          ) : (
            <div className="h-full overflow-y-auto">
              {renderContent(activeTab)}
            </div>
          )}
        </div>

      </div>
    </div>
    <HostFooter />
    </>
  );
}
