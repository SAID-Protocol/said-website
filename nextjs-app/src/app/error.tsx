'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center">
        <svg className="mx-auto mb-6 text-red-400" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
        </svg>
        <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
        <p className="text-zinc-400 mb-6">An unexpected error occurred. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
          >
            Try Again
          </button>
          <Link href="/" className="px-4 py-2 border border-zinc-700 rounded-lg font-medium hover:border-zinc-500 transition">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
