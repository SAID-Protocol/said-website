'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, Agent } from '@/lib/api';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import AgentList from '@/components/dashboard/AgentList';
import ChatPanel from '@/components/dashboard/ChatPanel';
import ConfigurePanel from '@/components/dashboard/ConfigurePanel';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import HostNavbar from '@/components/HostNavbar';
import AsciiBackground from '@/components/AsciiBackground';
import { CogIcon, BarChartIcon, ShieldIcon } from '@/components/host/icons';

type RightTab = 'configure' | 'analytics' | 'settings';
type MobileTab = 'chat' | 'configure' | 'analytics' | 'settings';

const mobileTabs: Array<{ id: MobileTab; label: string; icon: React.ReactNode }> = [
  { id: 'chat', label: 'Chat', icon: null },
  { id: 'configure', label: 'Configure', icon: <CogIcon size={14} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon size={14} /> },
  { id: 'settings', label: 'Settings', icon: <ShieldIcon size={14} /> },
];

const rightTabs: Array<{ id: RightTab; label: string; icon: React.ReactNode }> = [
  { id: 'configure', label: 'Configure', icon: <CogIcon size={14} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon size={14} /> },
  { id: 'settings', label: 'Settings', icon: <ShieldIcon size={14} /> },
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

function OnboardingCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-emerald-300">Your agent is live</h3>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-emerald-200">
              <span className="text-emerald-400">✓</span>
              <span>Agent deployed</span>
            </div>
            <span className="text-emerald-500/50">→</span>
            <div className="text-sm text-emerald-300 font-medium">Test it out (chat below)</div>
            <span className="text-emerald-500/50">→</span>
            <div className="text-sm text-emerald-200/70">Customize (optional)</div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-emerald-400 hover:text-emerald-300 transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent');

  const [rightTab, setRightTab] = useState<RightTab>('configure');
  const [mobileTab, setMobileTab] = useState<MobileTab>('chat');

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [usage, setUsage] = useState<{ llm: { used: number; limit: number } | null } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        if (agentId) {
          const { agent } = await api.getAgent(agentId);
          setSelectedAgent(agent);
          
          // Load usage data
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
      } catch (err) {
        console.error('Failed to refresh usage:', err);
      }
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

  const creditsUsed = usage?.llm?.used ?? selectedAgent.aiCreditsUsed;
  const creditsLimit = usage?.llm?.limit ?? selectedAgent.aiCreditsLimit;
  const creditsPct = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  const renderRightContent = (tab: RightTab | MobileTab) => {
    switch (tab) {
      case 'configure':
        return <ConfigurePanel agent={selectedAgent} />;
      case 'analytics':
        return <ActivityPanel agentId={selectedAgent.id} />;
      case 'settings':
        return <SettingsPanel agent={selectedAgent} />;
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
        {/* Top Bar */}
        <div className="flex-none pb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back arrow + Agent name + Status */}
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="text-zinc-500 transition hover:text-white"
                title="Back to agents"
              >
                ←
              </a>
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

            {/* Right: Tier badge + AI Credits */}
            <div className="flex items-center gap-4">
              {/* Tier Badge */}
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                {selectedAgent.tier.charAt(0).toUpperCase() + selectedAgent.tier.slice(1)}
              </div>

              {/* AI Credits */}
              <div className="group relative min-w-[140px]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-sm text-white">{creditsUsed.toFixed(1)}</span>
                  <span className="text-xs text-zinc-500">/</span>
                  <span className="font-mono text-sm text-zinc-400">{creditsLimit.toFixed(1)}</span>
                  <span className="text-xs text-zinc-500">credits</span>
                </div>
                <div className="pointer-events-none absolute -bottom-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 opacity-0 shadow-lg transition group-hover:opacity-100">
                  AI credits refill monthly with your plan
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div 
                    className="h-full rounded-full bg-amber-500 transition-all" 
                    style={{ width: `${Math.min(creditsPct, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding Card (dismissible, shows on first visit) */}
        {showOnboarding && (
          <div className="flex-none pb-6">
            <OnboardingCard onDismiss={() => setShowOnboarding(false)} />
          </div>
        )}

        {/* Main Area */}
        <div className="min-h-0 flex-1 overflow-hidden">
          {/* Mobile: Full-width tabs */}
          <div className="flex h-full min-h-0 flex-col overflow-hidden lg:hidden">
            <TabBar tabs={mobileTabs} activeTab={mobileTab} onChange={setMobileTab} className="mb-4 flex-none" />
            <div className="min-h-0 flex-1 overflow-hidden">
              {mobileTab === 'chat' ? (
                <ChatPanel agentId={selectedAgent.id} />
              ) : (
                <div className="h-full overflow-y-auto">
                  {renderRightContent(mobileTab)}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Chat 65% + Right panel 35% */}
          <div className="hidden h-full min-h-0 gap-6 overflow-hidden lg:grid" style={{ gridTemplateColumns: '65fr 35fr' }}>
            <div className="min-h-0">
              <ChatPanel agentId={selectedAgent.id} />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden">
              <TabBar tabs={rightTabs} activeTab={rightTab} onChange={setRightTab} className="mb-4 flex-none" />
              <div className="min-h-0 flex-1 overflow-hidden">
                {renderRightContent(rightTab)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
