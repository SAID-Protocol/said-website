'use client';

import { useState } from 'react';
import PersonalitySlider from '@/components/host/PersonalitySlider';
import { CogIcon, EyeIcon } from '@/components/host/icons';

interface QuickSettingsValues {
  communicationStyle: number;
  initiative: number;
  detailLevel: number;
}

interface QuickSettingsProps {
  onUpdate?: (settings: QuickSettingsValues) => void;
}

const INITIAL_VALUES: QuickSettingsValues = {
  communicationStyle: 58,
  initiative: 44,
  detailLevel: 68,
};

export default function QuickSettings({ onUpdate }: QuickSettingsProps) {
  const [settings, setSettings] = useState<QuickSettingsValues>(INITIAL_VALUES);

  const handleChange = (key: keyof QuickSettingsValues, value: number) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    onUpdate?.(next);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-2 text-zinc-300">
            <CogIcon size={18} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Quick Settings</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Adjust the core personality traits generated during onboarding. These
              controls are designed to stay in sync with your program.md instructions.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <PersonalitySlider
            label="Communication Style"
            leftLabel="Casual"
            rightLabel="Professional"
            value={settings.communicationStyle}
            onChange={(value) => handleChange('communicationStyle', value)}
          />

          <PersonalitySlider
            label="Initiative"
            leftLabel="Waits for instructions"
            rightLabel="Proactively suggests"
            value={settings.initiative}
            onChange={(value) => handleChange('initiative', value)}
          />

          <PersonalitySlider
            label="Detail Level"
            leftLabel="Brief & concise"
            rightLabel="Thorough & detailed"
            value={settings.detailLevel}
            onChange={(value) => handleChange('detailLevel', value)}
          />
        </div>

        <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
          <div className="flex items-start gap-3">
            <EyeIcon size={16} className="mt-0.5 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-blue-200">Bidirectional sync</p>
              <p className="mt-1 text-sm leading-6 text-blue-100/80">
                Quick Settings represent a structured view of your instructions. Direct
                edits in program.md take precedence when the two conflict.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
