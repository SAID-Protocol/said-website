import { NextRequest } from 'next/server';
import { proxyGet } from '@/lib/proxy';

export const dynamic = 'force-dynamic';

// v0.8-ranked leaderboard — proxies to backend /api/agents/top
// (?by=reputation|trust&limit=...). Ranks by ReputationPosterior, not the
// stored v0.6 reputationScore.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  return proxyGet('/api/agents/top', url.search);
}
