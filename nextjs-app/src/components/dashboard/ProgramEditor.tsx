'use client';

import { useMemo, useState } from 'react';
import { Agent, api } from '@/lib/api';
import { EditIcon, ShieldIcon, ArrowDownIcon } from '@/components/host/icons';

interface ProgramEditorProps {
  agent: Agent;
}

const DEFAULT_TEMPLATE = `# Agent Instructions

## Identity
You are a helpful SAID agent built to support users with focused, reliable assistance.

## Communication Style
- Be clear, calm, and direct
- Match the user's level of technical detail
- Ask clarifying questions when context is missing

## Goals
1. Solve the user's request accurately
2. Surface useful context and next steps
3. Keep responses structured and easy to act on

## Operating Principles
- Be honest about uncertainty
- Protect user privacy
- Stay within platform rules and permissions
- Prefer safe, reversible actions when possible
`;

export default function ProgramEditor({ agent }: ProgramEditorProps) {
  const initialContent = agent.programMd || DEFAULT_TEMPLATE;
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const counts = useMemo(() => {
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

    return {
      words,
      characters: content.length,
    };
  }, [content]);

  const isDirty = content !== initialContent;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await api.updateAgent(agent.id, { program_md: content });
      setHasSaved(true);
      
      // Reset the saved state after a few seconds
      setTimeout(() => setHasSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setContent(DEFAULT_TEMPLATE);
    setHasSaved(false);
    setShowResetModal(false);
  };

  return (
    <>
      <div className="flex h-full flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
        <div className="border-b border-white/10 bg-white/5 px-4 py-3 sm:px-5">
          <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-zinc-300">
            <ShieldIcon size={16} className="mt-0.5 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Locked Layer
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                Platform safety rules are applied automatically and cannot be edited.
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-white">
                <EditIcon size={16} className="text-zinc-400" />
                <h2 className="text-base font-semibold">
                  Your Agent&apos;s Instructions (program.md)
                </h2>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Edit your agent&apos;s goals, tone, workflow rules, and domain instructions.
                Changes apply on the next task.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowDownIcon size={14} className="rotate-45" />
                Reset to template defaults
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {saveError && (
          <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            Error: {saveError}
          </div>
        )}

        <div className="px-4 pt-4 sm:px-5">
          <label
            htmlFor="program-editor"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-zinc-500"
          >
            Markdown Editor
          </label>
        </div>

        <div className="flex-1 px-4 pb-4 sm:px-5 sm:pb-5">
          <textarea
            id="program-editor"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setHasSaved(false);
            }}
            spellCheck={false}
            className="h-full min-h-[420px] w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-4 font-mono text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-black/40"
            placeholder="Write the instructions that shape how your agent behaves..."
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-black/20 px-4 py-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <span>{counts.characters.toLocaleString()} characters</span>
            <span>{counts.words.toLocaleString()} words</span>
            <span className={isDirty ? 'text-amber-400' : hasSaved ? 'text-emerald-400' : 'text-zinc-500'}>
              {isDirty ? 'Unsaved changes' : hasSaved ? 'Saved successfully' : 'No changes'}
            </span>
          </div>
          <p className="text-zinc-500">Every save creates a new version automatically.</p>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-950/90 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Reset to template defaults?</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              This will replace your current program.md content with the original
              template instructions for this agent.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
