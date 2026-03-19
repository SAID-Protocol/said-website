'use client';

interface PersonalitySliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PersonalitySlider({ label, leftLabel, rightLabel, value, onChange }: PersonalitySliderProps) {
  return (
    <div className="space-y-3">
      <label className="block font-medium text-sm">{label}</label>
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(255 255 255 / 0.2) 0%, rgb(255 255 255 / 0.2) ${value}%, rgb(39 39 42) ${value}%, rgb(39 39 42) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}
