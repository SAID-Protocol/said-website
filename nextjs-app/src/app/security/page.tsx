'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecurityRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    window.location.href = '/security.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-zinc-400">Redirecting to security...</p>
    </div>
  );
}
