'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Agent, api } from '@/lib/api';
import { ShieldIcon } from '@/components/host/icons';

const TrashIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const PauseIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="4" height="16" x="6" y="4"/>
    <rect width="4" height="16" x="14" y="4"/>
  </svg>
);
import TerminalPanel from './TerminalPanel';

interface SettingsPanelProps {
  agent: Agent;
}

export default function SettingsPanel({ agent }: SettingsPanelProps) {
  const [agentName, setAgentName] = useState(agent.name);
  const [telegramToken, setTelegramToken] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const isFreeTier = agent.tier === 'free';

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Note: This assumes the API supports updating name via PATCH
      // You may need to adjust based on actual API capabilities
      await api.updateAgent(agent.id, { 
        // @ts-ignore - API may not support all fields yet
        name: agentName,
        ...(anthropicKey.trim() ? { anthropic_key: anthropicKey.trim() } : {}),
        ...(openaiKey.trim() ? { openai_key: openaiKey.trim() } : {}),
        ...(openrouterKey.trim() ? { openrouter_key: openrouterKey.trim() } : {}),
      });
      setHasSaved(true);
      
      setTimeout(() => setHasSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePause = async () => {
    if (!confirm('Pause this agent? It will stop responding until you restart it.')) {
      return;
    }

    try {
      await api.stopAgent(agent.id);
      window.location.reload();
    } catch (err) {
      toast.error(`Failed to pause agent: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this agent permanently? This cannot be undone.')) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== 'DELETE') {
      return;
    }

    try {
      await api.deleteAgent(agent.id);
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(`Failed to delete agent: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="h-full overflow-y-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-white">
          <span className="text-amber-500"><ShieldIcon size={16} /></span>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Settings</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your agent's configuration and access.
        </p>
      </div>

      {saveError && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          Error: {saveError}
        </div>
      )}

      <div className="space-y-6 px-4 py-6 sm:px-5">
        {/* Agent Name */}
        <div>
          <label htmlFor="agent-name" className="mb-2 block text-sm font-medium text-white">
            Agent Name
          </label>
          <input
            id="agent-name"
            type="text"
            value={agentName}
            onChange={(e) => {
              setAgentName(e.target.value);
              setHasSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
            placeholder="My Agent"
          />
        </div>

        {/* Telegram Bot Token */}
        <div>
          <label htmlFor="telegram-token" className="mb-2 block text-sm font-medium text-white">
            Telegram Bot Token
          </label>
          <input
            id="telegram-token"
            type="password"
            value={telegramToken}
            onChange={(e) => {
              setTelegramToken(e.target.value);
              setHasSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
            placeholder="••••••••••••••••••••"
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            Optional: Connect your agent to Telegram for messaging.
          </p>
        </div>

        {/* API Keys */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-1 text-sm font-medium text-white">API Keys</h3>
            {isFreeTier ? (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-sm font-medium text-amber-400">
                  Upgrade to unlock custom API keys
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Free tier agents use included credits only. Upgrade to Starter ($39/mo) to bring your own API keys for unlimited usage.
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400"
                  onClick={() => window.open('/host#pricing', '_blank')}
                >
                  Upgrade Plan
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-xs text-zinc-500">
                  Bring your own keys for unlimited usage. Leave blank to use included credits.
                </p>

                <div>
                  <label htmlFor="anthropic-key" className="mb-2 block text-sm font-medium text-zinc-300">
                    Anthropic
                  </label>
                  <input
                    id="anthropic-key"
                    type="password"
                    value={anthropicKey}
                    onChange={(e) => { setAnthropicKey(e.target.value); setHasSaved(false); }}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
                    placeholder="sk-ant-..."
                  />
                </div>

                <div>
                  <label htmlFor="openai-key" className="mb-2 block text-sm font-medium text-zinc-300">
                    OpenAI
                  </label>
                  <input
                    id="openai-key"
                    type="password"
                    value={openaiKey}
                    onChange={(e) => { setOpenaiKey(e.target.value); setHasSaved(false); }}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
                    placeholder="sk-..."
                  />
                </div>

                <div>
                  <label htmlFor="openrouter-key" className="mb-2 block text-sm font-medium text-zinc-300">
                    OpenRouter
                  </label>
                  <input
                    id="openrouter-key"
                    type="password"
                    value={openrouterKey}
                    onChange={(e) => { setOpenrouterKey(e.target.value); setHasSaved(false); }}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
                    placeholder="sk-or-v1-..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
          <span className={`text-xs ${hasSaved ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {hasSaved ? 'Settings saved' : 'Unsaved changes'}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Developer Tools (Collapsible) */}
        <div className="border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => setShowDeveloperTools(!showDeveloperTools)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-sm font-medium text-white">Developer Tools</span>
            <span className={`text-zinc-400 transition-transform ${showDeveloperTools ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showDeveloperTools && (
            <div className="mt-4">
              <TerminalPanel />
            </div>
          )}
        </div>

        {/* Agent Controls */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <div>
            <h3 className="text-sm font-medium text-white">Agent Controls</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Manage your agent's runtime state.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  await api.stopAgent(agent.id);
                  await new Promise(r => setTimeout(r, 2000));
                  await api.startAgent(agent.id);
                  window.location.reload();
                } catch (err) {
                  toast.error(`Failed to restart: ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
              }}
              className="flex w-full items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-left transition hover:bg-emerald-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">↻</span>
                <div>
                  <div className="text-sm font-medium text-emerald-300">Restart Agent</div>
                  <div className="text-xs text-emerald-200/70">Stop and start your agent (applies any config changes)</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4 border-t border-red-500/20 pt-6">
          <div>
            <h3 className="text-sm font-medium text-red-400">Danger Zone</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Irreversible actions. Proceed with caution.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handlePause}
              className="flex w-full items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left transition hover:bg-amber-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-400"><PauseIcon size={16} /></span>
                <div>
                  <div className="text-sm font-medium text-amber-300">Pause Agent</div>
                  <div className="text-xs text-amber-200/70">Stop responding until manually restarted</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex w-full items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-left transition hover:bg-red-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-red-400"><TrashIcon size={16} /></span>
                <div>
                  <div className="text-sm font-medium text-red-300">Delete Agent</div>
                  <div className="text-xs text-red-200/70">Permanently remove this agent and all data</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
