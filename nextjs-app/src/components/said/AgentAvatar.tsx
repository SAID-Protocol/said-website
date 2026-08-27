'use client';

import { useState } from 'react';
import { UPSTREAM_URL } from '@/lib/api';

/**
 * An agent's picture, resolved the same way everywhere.
 *
 * Agents publish a real image (`agent.image`) — the same one the embed badge
 * renders. The generated identicon at /api/avatar/:wallet.svg is only a
 * fallback for agents that have none, or whose image fails to load (plenty
 * are hotlinked to third-party hosts that go down).
 *
 * This lives in one component because the surfaces had already diverged: the
 * profile and directory used the real image while the leaderboard always drew
 * the identicon, so the same agent looked like two different agents.
 */
export default function AgentAvatar({
  wallet,
  image,
  name,
  className,
  rounded = '50%',
}: {
  wallet: string;
  image?: string | null;
  name?: string;
  className?: string;
  rounded?: string;
}) {
  // Track which URL failed rather than mirroring the resolved src in state —
  // that way a recycled row (pagination) picks up its new agent's image
  // without an effect, and a broken host still falls back exactly once.
  const [failed, setFailed] = useState<string | null>(null);

  const generated = `${UPSTREAM_URL}/api/avatar/${wallet}.svg`;
  const src = image && failed !== image ? image : generated;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt={name ? `${name} avatar` : ''}
      loading="lazy"
      onError={() => { if (image && failed !== image) setFailed(image); }}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: rounded, display: 'block' }}
    />
  );
}
