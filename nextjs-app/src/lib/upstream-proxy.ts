import { NextRequest, NextResponse } from 'next/server';

/**
 * Shared same-origin passthrough used by the /api/said and /api/hosting
 * routes.
 *
 * Both SAID backends (api.saidprotocol.com and app.saidprotocol.com) publish
 * CORS allowlists containing only the production web origins, so calls made
 * straight from the browser fail with "Failed to fetch" anywhere else —
 * localhost, Railway preview domains, branch deploys. Routing them through a
 * Next route makes them same-origin, so CORS never applies.
 *
 * Only Authorization and Content-Type are forwarded; nothing is added
 * server-side, so this grants no access the caller didn't already have.
 */
export async function forwardTo(
  upstreamBase: string,
  req: NextRequest,
  path: string[],
): Promise<NextResponse> {
  // Guard against traversal out of the upstream base.
  const clean = path.filter((seg) => seg !== '..' && seg !== '.');
  const search = new URL(req.url).search;
  const url = `${upstreamBase}/${clean.join('/')}${search}`;

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
    console.error(`[upstream-proxy] ${method} ${url} failed:`, err);
    return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });
  }
}

export type ProxyCtx = { params: Promise<{ path: string[] }> };
