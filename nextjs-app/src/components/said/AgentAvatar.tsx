'use client';

import { useState } from 'react';
import { UPSTREAM_URL } from '@/lib/api';

/**
 * An agent's picture, resolved the same way everywhere — and the same way the
 * embed badge does it.
 *
 * The API's badge renderer (resolveBadgeAvatar in said-api) resolves in this
 * order, so the site matches it exactly:
 *
 *   1. agent.image
 *   2. https://unavatar.io/x/<handle>   — many agents publish no image but do
 *                                         have an X handle (Xona, for one)
 *   3. the generated identicon
 *
 * Without step 2 an agent could show its real face on its embed badge while
 * the leaderboard drew a random identicon for the same agent.
 */

/** Same handle parsing as the API's badgeTwitterHandle. */
function twitterHandle(t?: string | null): string | null {
  if (!t) return null;
  const m = t.match(/(?:x\.com\/|twitter\.com\/|@)?([A-Za-z0-9_]{2,30})\/?$/);
  return m ? m[1] : null;
}

export default function AgentAvatar({
  wallet,
  image,
  twitter,
  name,
  className,
  rounded = '50%',
}: {
  wallet: string;
  image?: string | null;
  twitter?: string | null;
  name?: string;
  className?: string;
  rounded?: string;
}) {
  // Track which URLs failed rather than mirroring the resolved src in state:
  // a recycled row (pagination) picks up its new agent without an effect, and
  // each source falls through exactly once.
  const [failed, setFailed] = useState<string[]>([]);

  const handle = twitterHandle(twitter);
  const chain = [
    image || null,
    handle ? `https://unavatar.io/x/${handle}` : null,
    `${UPSTREAM_URL}/api/avatar/${wallet}.svg`,
  ].filter(Boolean) as string[];

  const src = chain.find((u) => !failed.includes(u)) ?? chain[chain.length - 1];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt={name ? `${name} avatar` : ''}
      loading="lazy"
      onError={() => setFailed((f) => (f.includes(src) ? f : [...f, src]))}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: rounded, display: 'block' }}
    />
  );
}
