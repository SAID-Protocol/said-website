'use client';

import DotGridBackground from './DotGridBackground';

interface AsciiBackgroundProps {
  agentThemed?: boolean;
  className?: string;
  onReady?: () => void;
}

export default function AsciiBackground({ onReady }: AsciiBackgroundProps) {
  // Fire onReady immediately since DotGridBackground renders synchronously
  if (onReady) {
    setTimeout(onReady, 0);
  }
  return <DotGridBackground />;
}
