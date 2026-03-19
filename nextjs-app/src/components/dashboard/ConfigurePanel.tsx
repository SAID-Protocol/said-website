'use client';

import { useState } from 'react';
import { Agent, api } from '@/lib/api';
import { CogIcon } from '@/components/host/icons';

interface ConfigurePanelProps {
  agent: Agent;
}

const DEFAULT_MISSION = `You are a helpful SAID agent built to support users with focused, reliable assistance.`;

const PERSONALITY_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'research', label: 'Research-focused' },
  { value: 'trading', label: 'Trading-focused' },
  { value: 'custom', label: 'Custom' },
];

const AUTONOMY_OPTIONS = [
  { value: 'observer', label: 'Observer', description: 'Agent only responds when asked' },
  { value: 'assistant', label: 'Assistant', description: 'Suggests actions, waits for approval' },
  { value: 'autonomous', label: 'Autonomous', description: 'Can take actions independently' },
];

export default function ConfigurePanel({ agent }: ConfigurePanelProps) {
  // Parse existing program.md to extract mission (simplified for now)
  const existingMission = agent.programMd || DEFAULT_MISSION;
  
  const [mission, setMission] = useState(existingMission);
  const [personality, setPersonality] = useState('professional');
  const [autonomy, setAutonomy] = useState('assistant');
  const [spendingLimit, setSpendingLimit] = useState('10');
  const [showCustomInstructions, setShowCustomInstructions] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Construct program.md from form values
      const programMd = buildProgramMd({
        mission,
        personality,
        autonomy,
        spendingLimit,
        customInstructions,
      });

      await api.updateAgent(agent.id, { program_md: programMd });
      setHasSaved(true);
      
      setTimeout(() => setHasSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-white">
          <span className="text-amber-500"><CogIcon size={16} /></span>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Configure</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          Customize your agent's behavior and goals.
        </p>
      </div>

      {saveError && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          Error: {saveError}
        </div>
      )}

      <div className="space-y-6 px-4 py-6 sm:px-5">
        {/* Agent Mission */}
        <div>
          <label htmlFor="mission" className="mb-2 block text-sm font-medium text-white">
            Agent Mission
          </label>
          <textarea
            id="mission"
            value={mission}
            onChange={(e) => {
              setMission(e.target.value);
              setHasSaved(false);
            }}
            rows={4}
            className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
            placeholder="Describe your agent's primary purpose..."
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            What should your agent help you accomplish?
          </p>
        </div>

        {/* Personality */}
        <div>
          <label htmlFor="personality" className="mb-2 block text-sm font-medium text-white">
            Personality
          </label>
          <select
            id="personality"
            value={personality}
            onChange={(e) => {
              setPersonality(e.target.value);
              setHasSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:bg-black/40"
          >
            {PERSONALITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-zinc-500">
            Choose the communication style that fits your needs.
          </p>
        </div>

        {/* Autonomy */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Autonomy
          </label>
          <div className="space-y-2">
            {AUTONOMY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                  autonomy === opt.value
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-white/10 bg-black/20 hover:bg-black/30'
                }`}
              >
                <input
                  type="radio"
                  name="autonomy"
                  value={opt.value}
                  checked={autonomy === opt.value}
                  onChange={(e) => {
                    setAutonomy(e.target.value);
                    setHasSaved(false);
                  }}
                  className="mt-0.5 h-4 w-4 accent-amber-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{opt.label}</div>
                  <div className="mt-0.5 text-xs text-zinc-400">{opt.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Spending Limit (if Autonomous) */}
        {autonomy === 'autonomous' && (
          <div>
            <label htmlFor="spending-limit" className="mb-2 block text-sm font-medium text-white">
              Spending Limit (USD)
            </label>
            <input
              id="spending-limit"
              type="number"
              value={spendingLimit}
              onChange={(e) => {
                setSpendingLimit(e.target.value);
                setHasSaved(false);
              }}
              min="0"
              step="1"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Maximum amount the agent can spend per day.
            </p>
          </div>
        )}

        {/* Advanced: Custom Instructions */}
        <div>
          <button
            type="button"
            onClick={() => setShowCustomInstructions(!showCustomInstructions)}
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <span className={`transition-transform ${showCustomInstructions ? 'rotate-90' : ''}`}>
              ▶
            </span>
            Advanced: Custom prompt
          </button>
          
          {showCustomInstructions && (
            <div className="mt-3">
              <textarea
                value={customInstructions}
                onChange={(e) => {
                  setCustomInstructions(e.target.value);
                  setHasSaved(false);
                }}
                rows={6}
                className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40"
                placeholder="Add custom instructions for advanced behavior..."
              />
              <p className="mt-1.5 text-xs text-zinc-500">
                These instructions will be appended to your agent's configuration.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur-sm sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-xs ${hasSaved ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {hasSaved ? 'Saved successfully' : 'Make changes to enable save'}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to build program.md from form values
function buildProgramMd(values: {
  mission: string;
  personality: string;
  autonomy: string;
  spendingLimit: string;
  customInstructions: string;
}): string {
  const sections: string[] = [];

  // Mission
  sections.push(`# Agent Instructions\n\n## Mission\n${values.mission}`);

  // Personality
  const personalityMap: Record<string, string> = {
    professional: 'Be clear, professional, and concise in all communications.',
    casual: 'Be friendly, conversational, and approachable.',
    research: 'Focus on thorough analysis, citations, and detailed explanations.',
    trading: 'Prioritize market analysis, risk assessment, and actionable insights.',
    custom: 'Follow the custom instructions provided below.',
  };
  
  sections.push(`\n## Communication Style\n${personalityMap[values.personality] || personalityMap.professional}`);

  // Autonomy
  const autonomyMap: Record<string, string> = {
    observer: 'Respond only when directly asked. Do not take proactive actions.',
    assistant: 'Suggest actions and provide recommendations, but always wait for user approval before executing.',
    autonomous: `You may take actions independently within approved boundaries. Spending limit: $${values.spendingLimit}/day.`,
  };
  
  sections.push(`\n## Autonomy Level\n${autonomyMap[values.autonomy] || autonomyMap.assistant}`);

  // Custom instructions
  if (values.customInstructions.trim()) {
    sections.push(`\n## Custom Instructions\n${values.customInstructions.trim()}`);
  }

  return sections.join('\n');
}
