'use client';

import { ReactNode } from 'react';

interface TemplateCardProps {
  icon: ReactNode;
  name: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function TemplateCard({ icon, name, description, selected, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-6 bg-white/5 backdrop-blur-md border rounded-xl text-left transition group
        hover:border-zinc-600/80 hover:bg-zinc-900/40
        ${selected ? 'border-white/40 bg-zinc-800/50' : 'border-white/10'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition
          ${selected ? 'bg-white/10 border-white/20' : 'bg-zinc-800 border-zinc-700'}
          border
        `}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <p className="text-zinc-400 text-sm">{description}</p>
        </div>
        {selected && (
          <svg className="text-white flex-shrink-0 mt-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
    </button>
  );
}
