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
    console.error(error);
  }, [error]);

  return (
    <div className="said-page said-err">
      <div className="hero" style={{ textAlign: 'center' }}>
        <div className="kick mono">SOMETHING WENT WRONG</div>
        <h1>That didn&apos;t work.</h1>
        <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          An unexpected error occurred. Trying again usually clears it.
        </p>
        {error?.digest && <p className="digest mono">REF {error.digest}</p>}
        <div className="ctas">
          <button className="btn fill" onClick={reset}>Try again</button>
          <Link className="btn" href="/">Go home</Link>
        </div>
      </div>
      <style>{`
        .said-err .hero{min-height:62vh;display:flex;flex-direction:column;justify-content:center}
        .said-err .kick{font-size:11px;letter-spacing:.2em}
        .said-err .digest{margin-top:18px;font-size:10.5px;letter-spacing:.12em;color:var(--faint)}
        .said-err .ctas{display:flex;gap:12px;justify-content:center;margin-top:30px;flex-wrap:wrap}
      `}</style>
    </div>
  );
}
