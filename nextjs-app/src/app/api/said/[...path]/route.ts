import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM_BASE = 'https://api.saidprotocol.com';

/**
 * Same-origin passthrough to api.saidprotocol.com for calls the browser makes
 * on behalf of a signed-in user.
 *
 * The upstream CORS allowlist only contains the production web origins, so
 * browser-direct auth calls fail with "Failed to fetch" anywhere else —
 * localhost, Railway preview domains, branch deploys. Routing them through
 * this route makes them same-origin, so CORS never applies and every
 * environment behaves like production.
 *
 * Only the Authorization and Content-Type headers are forwarded; nothing is
 * added server-side, so this grants no access the caller didn't already have.
 */
export const dynamic = 'force-dynamic';

async function forward(req: NextRequest, path: string[]) {
  // Guard against traversal out of the upstream base.
  const clean = path.filter((seg) => seg !== '..' && seg !== '.');
  const search = new URL(req.url).search;
  const url = `${UPSTREAM_BASE}/${clean.join('/')}${search}`;

  const headers: Record<string, string> = {};
  const auth = req.headers.get('authorization');
  const type = req.headers.get('content-type');
  if (auth) headers['Authorization'] = auth;
  if (type) headers['Content-Type'] = type;

  const method = req.method;
  const body = method === 'GET' || method === 'HEAD' ? undefined : await req.text();

  try {
    const res = await fetch(url, { method, headers, body, cache: 'no-store' });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err) {
    console.error(`[said-proxy] ${method} ${url} failed:`, err);
    return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
