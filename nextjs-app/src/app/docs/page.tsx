'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    window.location.href = '/docs.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-zinc-400">Redirecting to docs...</p>
    </div>
  );
}
