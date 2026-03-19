'use client';

import { ReactNode } from 'react';

interface AutonomyCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
}

export default function AutonomyCard({ icon, title, description, value, selected, onSelect }: AutonomyCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        p-5 bg-white/5 backdrop-blur-md border rounded-xl text-left transition group
        hover:border-zinc-600/80 hover:bg-zinc-900/40
        ${selected ? 'border-white/40 bg-zinc-800/50' : 'border-white/10'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition
          ${selected ? 'bg-white/10 border-white/20' : 'bg-zinc-800 border-zinc-700'}
          border
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            {title}
            {selected && (
              <svg className="text-white" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </h3>
          <p className="text-zinc-400 text-sm">{description}</p>
        </div>
      </div>
    </button>
  );
}
