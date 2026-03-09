'use client';

import { useState } from 'react';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import ChatPanel from '@/components/dashboard/ChatPanel';
import ProgramEditor from '@/components/dashboard/ProgramEditor';
import QuickSettings from '@/components/dashboard/QuickSettings';
import StatsBar from '@/components/dashboard/StatsBar';
import TerminalPanel from '@/components/dashboard/TerminalPanel';
import VersionSidebar from '@/components/dashboard/VersionSidebar';
import {
  BarChartIcon,
  CogIcon,
  EditIcon,
  MessageCircleIcon,
  TerminalIcon,
} from '@/components/host/icons';

type CenterTab = 'instructions' | 'settings';
type RightTab = 'terminal' | 'activity';
type MobileTab = 'chat' | 'instructions' | 'settings' | 'terminal' | 'activity';

const mobileTabs: Array<{ id: MobileTab; label: string; icon: React.ReactNode }> = [
  { id: 'chat', label: 'Chat', icon: <MessageCircleIcon size={16} /> },
  { id: 'instructions', label: 'Instructions', icon: <EditIcon size={16} /> },
  { id: 'settings', label: 'Settings', icon: <CogIcon size={16} /> },
  { id: 'terminal', label: 'Terminal', icon: <TerminalIcon size={16} /> },
  { id: 'activity', label: 'Activity', icon: <BarChartIcon size={16} /> },
];

const centerTabs: Array<{ id: CenterTab; label: string; icon: React.ReactNode }> = [
  { id: 'instructions', label: 'Instructions', icon: <EditIcon size={16} /> },
  { id: 'settings', label: 'Settings', icon: <CogIcon size={16} /> },
];

const rightTabs: Array<{ id: RightTab; label: string; icon: React.ReactNode }> = [
  { id: 'terminal', label: 'Terminal', icon: <TerminalIcon size={16} /> },
  { id: 'activity', label: 'Activity', icon: <BarChartIcon size={16} /> },
];

function TabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: Array<{ id: T; label: string; icon: React.ReactNode }>;
  activeTab: T;
  onChange: (tab: T) => void;
}) {
  return (
    <div className="mb-4 overflow-x-auto">
      <div className="inline-flex min-w-full gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-md sm:min-w-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition ${
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
  const [centerTab, setCenterTab] = useState<CenterTab>('instructions');
  const [rightTab, setRightTab] = useState<RightTab>('terminal');
  const [mobileTab, setMobileTab] = useState<MobileTab>('chat');

  return (
    <div className="min-h-screen bg-black px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Manage your hosted agent</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Edit instructions, tune personality, monitor runtime activity, and test how your SAID agent responds in real time.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 backdrop-blur-md">
            Changes to instructions apply on the agent&apos;s next task.
          </div>
        </div>

        <div className="mb-6">
          <StatsBar />
        </div>

        <div className="lg:hidden">
          <TabBar tabs={mobileTabs} activeTab={mobileTab} onChange={setMobileTab} />

          <div className="space-y-6">
            {mobileTab === 'chat' && <ChatPanel />}
            {mobileTab === 'instructions' && (
              <div className="space-y-6">
                <ProgramEditor />
                <div className="min-h-[320px]">
                  <VersionSidebar />
                </div>
              </div>
            )}
            {mobileTab === 'settings' && <QuickSettings />}
            {mobileTab === 'terminal' && <TerminalPanel />}
            {mobileTab === 'activity' && <ActivityPanel />}
          </div>
        </div>

        <div className="hidden gap-6 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ChatPanel />
          </div>

          <div className="lg:col-span-4">
            <TabBar tabs={centerTabs} activeTab={centerTab} onChange={setCenterTab} />
            {centerTab === 'instructions' ? (
              <div className="space-y-6">
                <ProgramEditor />
                <div className="min-h-[320px]">
                  <VersionSidebar />
                </div>
              </div>
            ) : (
              <QuickSettings />
            )}
          </div>

          <div className="lg:col-span-4">
            <TabBar tabs={rightTabs} activeTab={rightTab} onChange={setRightTab} />
            {rightTab === 'terminal' ? <TerminalPanel /> : <ActivityPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
