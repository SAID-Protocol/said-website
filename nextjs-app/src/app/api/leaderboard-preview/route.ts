import { NextResponse } from 'next/server';

const UPSTREAM_BASE = 'https://api.saidprotocol.com';
const LIMIT = 2000;
const TOP_N = 5;

export const revalidate = 300;

interface TrustScore {
  score: number;
  tier: string;
}

interface AgentLite {
  wallet: string;
  name: string;
  isVerified: boolean;
  reputationScore?: number;
  feedbackCount?: number;
  trustScore?: TrustScore | null;
}

interface PreviewEntry {
  wallet: string;
  name: string;
  isVerified: boolean;
  trustScore: number;
  tier: string;
  rank: number;
}

export async function GET() {
  try {
    const res = await fetch(`${UPSTREAM_BASE}/api/agents?limit=${LIMIT}&verified=true`, {
      next: { revalidate: 300 },
      headers: { accept: 'application/json' },
    });
    if (!res.ok) {
      return NextResponse.json({ leaderboard: [] }, { status: 502 });
    }
    const data = (await res.json()) as { agents?: AgentLite[] };
    const ranked = (data.agents ?? [])
      .filter((a) => (a.trustScore?.score ?? 0) > 0)
      .sort((a, b) => (b.trustScore?.score ?? 0) - (a.trustScore?.score ?? 0))
      .slice(0, TOP_N)
      .map<PreviewEntry>((a, idx) => ({
        wallet: a.wallet,
        name: a.name,
        isVerified: a.isVerified,
        trustScore: a.trustScore?.score ?? 0,
        tier: a.trustScore?.tier ?? 'unranked',
        rank: idx + 1,
      }));
    return NextResponse.json(
      { leaderboard: ranked },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { leaderboard: [], error: err instanceof Error ? err.message : 'fetch failed' },
      { status: 502 },
    );
  }
}
