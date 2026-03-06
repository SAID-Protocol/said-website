'use client';

import { useState, useEffect } from 'react';

interface PageLoaderProps {
  ready: boolean;
}

export default function PageLoader({ ready }: PageLoaderProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('said-loaded');
    }
    return true;
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (ready) {
      sessionStorage.setItem('said-loaded', '1');
      setFading(true);
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [ready, visible]);

  // Safety timeout — never block longer than 3 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('said-loaded', '1');
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <img src="/logo-dark.png" alt="SAID" width={40} height={40} className="animate-pulse" />
      </div>
    </div>
  );
}
