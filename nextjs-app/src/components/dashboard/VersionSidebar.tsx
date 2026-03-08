'use client';

import { useMemo, useState } from 'react';
import { ArrowDownIcon, EditIcon, EyeIcon } from '@/components/host/icons';

interface VersionEntry {
  id: string;
  savedAt: string;
  title: string;
  summary: string;
  diff: string[];
}

interface VersionSidebarProps {
  onRestore?: (versionId: string) => void;
}

const MOCK_VERSIONS: VersionEntry[] = [
  {
    id: 'v12',
    savedAt: '2026-03-08T19:22:00Z',
    title: 'Current draft',
    summary: 'Tightened tone guidance and added stronger workflow steps for research requests.',
    diff: ['+ Ask one clarifying question when scope is ambiguous', '+ Keep summaries concise unless asked for depth'],
  },
  {
    id: 'v11',
    savedAt: '2026-03-08T16:48:00Z',
    title: 'Template refinement',
    summary: 'Expanded operating principles to emphasize privacy, reversibility, and explicit uncertainty.',
    diff: ['+ Prefer safe, reversible actions', '+ State uncertainty clearly when evidence is limited'],
  },
  {
    id: 'v10',
    savedAt: '2026-03-07T13:05:00Z',
    title: 'Personality sync update',
    summary: 'Adjusted communication style to be slightly more professional and more structured.',
    diff: ['- Be casual in all replies', '+ Use a calm, professional tone by default'],
  },
  {
    id: 'v09',
    savedAt: '2026-03-05T21:12:00Z',
    title: 'Initial template',
    summary: 'Generated automatically from the selected onboarding template and quick settings.',
    diff: ['+ Created from onboarding template'],
  },
];

export default function VersionSidebar({ onRestore }: VersionSidebarProps) {
  const [showDiff, setShowDiff] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState(MOCK_VERSIONS[0]?.id ?? '');

  const selectedVersion = useMemo(
    () => MOCK_VERSIONS.find((version) => version.id === selectedVersionId) ?? MOCK_VERSIONS[0],
    [selectedVersionId]
  );

  const formatTimestamp = (savedAt: string) => {
    const date = new Date(savedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <aside className="flex h-full flex-col rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-white">
              <EditIcon size={16} className="text-zinc-400" />
              <h2 className="text-base font-semibold">Version History</h2>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Review previous saves, compare changes, and restore earlier instructions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDiff((value) => !value)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
              showDiff
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <EyeIcon size={14} />
            {showDiff ? 'Hide diff' : 'Show diff'}
          </button>
        </div>
      </div>

      {selectedVersion && showDiff && (
        <div className="border-b border-white/10 bg-black/20 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Selected Version
          </p>
          <p className="mt-2 text-sm font-medium text-white">{selectedVersion.title}</p>
          <div className="mt-3 space-y-2">
            {selectedVersion.diff.map((line) => (
              <div
                key={line}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  line.startsWith('+')
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                    : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {MOCK_VERSIONS.map((version) => {
            const isSelected = version.id === selectedVersionId;

            return (
              <div
                key={version.id}
                className={`rounded-xl border p-4 transition ${
                  isSelected
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/10 bg-black/10 hover:bg-white/5'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedVersionId(version.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                      {version.id}
                    </span>
                    <span className="text-xs text-zinc-500">{formatTimestamp(version.savedAt)}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">{version.title}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{version.summary}</p>
                </button>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVersionId(version.id)}
                    className="text-xs text-zinc-400 transition hover:text-white"
                  >
                    {isSelected ? 'Selected' : 'View details'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRestore?.(version.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <ArrowDownIcon size={12} className="rotate-90" />
                    Restore
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 px-4 py-3">
        <p className="text-xs leading-5 text-zinc-500">
          Versions are created automatically whenever program.md is saved.
        </p>
      </div>
    </aside>
  );
}
