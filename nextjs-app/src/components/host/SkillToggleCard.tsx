'use client';

import { useState } from 'react';

type RiskLevel = 'green' | 'yellow' | 'red';

interface SkillToggleCardProps {
  icon: string;
  name: string;
  description: string;
  risk: RiskLevel;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function SkillToggleCard({ icon, name, description, risk, enabled, onToggle }: SkillToggleCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const riskColors = {
    green: 'text-green-400 border-green-500/30',
    yellow: 'text-yellow-400 border-yellow-500/30',
    red: 'text-red-400 border-red-500/30'
  };

  const riskBadge = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴'
  };

  const handleToggle = () => {
    if (risk === 'red' && !enabled) {
      setShowConfirm(true);
    } else {
      onToggle(!enabled);
    }
  };

  const confirmEnable = () => {
    onToggle(true);
    setShowConfirm(false);
  };

  return (
    <>
      <div className={`
        p-4 bg-white/5 backdrop-blur-md border rounded-lg transition
        ${enabled ? 'border-white/20 bg-zinc-800/40' : 'border-white/10'}
      `}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0 mt-0.5">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{name}</h4>
              <span className="text-xs">{riskBadge[risk]}</span>
            </div>
            <p className="text-zinc-400 text-xs">{description}</p>
          </div>
          <button
            onClick={handleToggle}
            className={`
              relative w-11 h-6 rounded-full transition flex-shrink-0
              ${enabled ? 'bg-white' : 'bg-zinc-700'}
            `}
          >
            <div className={`
              absolute top-1 w-4 h-4 rounded-full transition-all
              ${enabled ? 'right-1 bg-black' : 'left-1 bg-zinc-500'}
            `} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6 max-w-md">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-400 mb-2">High-Risk Skill</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  <strong>{name}</strong> allows your agent to execute on-chain transactions or send payments. 
                  Make sure you set appropriate spending limits and understand the risks.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmEnable}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/30 transition"
                  >
                    Enable Anyway
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
