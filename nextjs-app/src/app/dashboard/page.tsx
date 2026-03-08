'use client';

import { useState } from 'react';
import ProgramEditor from '@/components/dashboard/ProgramEditor';
import QuickSettings from '@/components/dashboard/QuickSettings';
import VersionSidebar from '@/components/dashboard/VersionSidebar';
import {
  BarChartIcon,
  CogIcon,
  EditIcon,
  MessageCircleIcon,
} from '@/components/host/icons';

type Tab = 'chat' | 'instructions' | 'settings' | 'activity';

const tabs: Array<{
  id: Tab;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'chat', label: 'Chat', icon: <MessageCircleIcon size={16} /> },
  { id: 'instructions', label: 'Instructions', icon: <EditIcon size={16} /> },
  { id: 'settings', label: 'Settings', icon: <CogIcon size={16} /> },
  { id: 'activity', label: 'Activity', icon: <BarChartIcon size={16} /> },
];

function PlaceholderPanel({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
      <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-zinc-300">{icon}</div>
      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('instructions');

  return (
    <div className="min-h-screen bg-black px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Manage your hosted agent
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Edit instructions, tune personality, review prior versions, and monitor how
              your SAID agent evolves over time.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 backdrop-blur-md">
            Changes to instructions apply on the agent&apos;s next task.
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex min-w-full gap-2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-md sm:min-w-0">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-black'
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

        {activeTab === 'instructions' && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <ProgramEditor />
            <div className="min-h-[320px] xl:min-h-[720px]">
              <VersionSidebar />
            </div>
          </div>
        )}

        {activeTab === 'settings' && <QuickSettings />}

        {activeTab === 'chat' && (
          <PlaceholderPanel
            title="Chat interface coming soon"
            description="This panel will embed a live conversation view so users can test their agent immediately after changing instructions."
            icon={<MessageCircleIcon size={24} />}
          />
        )}

        {activeTab === 'activity' && (
          <PlaceholderPanel
            title="Activity log coming soon"
            description="This panel will show recent agent actions, messages, edits, and runtime events in a searchable timeline."
            icon={<BarChartIcon size={24} />}
          />
        )}
      </div>
    </div>
  );
}
