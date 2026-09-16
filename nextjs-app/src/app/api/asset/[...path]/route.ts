import { NextRequest } from 'next/server';
import { proxyGet } from '@/lib/proxy';

export const dynamic = 'force-dynamic';

/** Asset passport: search, impersonators, issuers, stats, and /:mint. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const safe = path.map((p) => encodeURIComponent(p)).join('/');
  const url = new URL(req.url);
  return proxyGet(`/api/asset/${safe}`, url.search);
}
