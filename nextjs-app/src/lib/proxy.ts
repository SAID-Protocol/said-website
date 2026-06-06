import { NextResponse } from 'next/server';

const UPSTREAM_BASE = 'https://api.saidprotocol.com';

/**
 * Forwards a GET to api.saidprotocol.com. Exists so the browser hits a
 * same-origin /api/* path (avoiding CORS) and we do the cross-origin
 * fetch server-side, where CORS doesn't apply.
 */
export async function proxyGet(upstreamPath: string, search?: string): Promise<NextResponse> {
  const url = `${UPSTREAM_BASE}${upstreamPath}${search ?? ''}`;
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'upstream fetch failed' },
      { status: 502 },
    );
  }
}
