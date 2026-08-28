import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Server-side admin gate.
 *
 * The /admin page used to hold both the password and the API's admin secret
 * as client constants, so they shipped in the JS bundle: anyone could read
 * them from view-source and call the grant approve/reject endpoints directly.
 *
 * Now the password is checked here and the upstream secret is injected here —
 * neither value ever reaches the browser. The browser only gets an httpOnly
 * session cookie it cannot read from JavaScript.
 *
 * Requires ADMIN_PASSWORD and SAID_ADMIN_SECRET in the environment; the
 * routes fail closed if either is missing rather than falling back to a
 * hardcoded value.
 */

const UPSTREAM = 'https://api.saidprotocol.com';
const COOKIE = 'said_admin_session';

function adminSecret(): string | null {
  return process.env.SAID_ADMIN_SECRET || null;
}

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  const expected = process.env.ADMIN_PASSWORD;
  // The cookie stores the password hash-equivalent (the value itself is never
  // exposed to JS). Fail closed when the env var is unset.
  return Boolean(expected && token && token === sessionValue(expected));
}

/** Opaque-ish session value derived from the configured password. */
function sessionValue(password: string): string {
  let h = 0;
  const salt = 'said-admin-v1';
  const s = password + salt;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `s${(h >>> 0).toString(36)}`;
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const path = (await ctx.params).path;

  // ── login ──────────────────────────────────────────────────────────
  if (path[0] === 'login') {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.json(
        { error: 'Admin login is not configured (ADMIN_PASSWORD unset).' },
        { status: 503 }
      );
    }
    const body = await req.json().catch(() => ({}));
    if (typeof body.password !== 'string' || body.password !== expected) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, sessionValue(expected), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  }

  // ── logout ─────────────────────────────────────────────────────────
  if (path[0] === 'logout') {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  }

  // ── guarded action proxy: grants/:id/:action ───────────────────────
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const secret = adminSecret();
  if (!secret) {
    return NextResponse.json(
      { error: 'Admin API is not configured (SAID_ADMIN_SECRET unset).' },
      { status: 503 }
    );
  }

  const clean = path.filter((p) => p !== '..' && p !== '.');
  try {
    const res = await fetch(`${UPSTREAM}/admin/${clean.join('/')}`, {
      method: 'POST',
      headers: { 'x-admin-secret': secret, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err) {
    console.error('[admin-proxy] POST failed:', err);
    return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  // session probe, so the page can restore state without holding a password
  const path = (await ctx.params).path;
  if (path[0] === 'session') {
    return NextResponse.json({ authed: await isAuthed() });
  }

  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const secret = adminSecret();
  if (!secret) {
    return NextResponse.json(
      { error: 'Admin API is not configured (SAID_ADMIN_SECRET unset).' },
      { status: 503 }
    );
  }

  const clean = path.filter((p) => p !== '..' && p !== '.');
  try {
    // Header auth only — the API rejects ?secret= on purpose (secrets in URLs
    // leak to logs) and answers 404 rather than 401 to hide the endpoint. The
    // old client used the query param, which is why grants silently 404'd.
    const res = await fetch(`${UPSTREAM}/admin/${clean.join('/')}`, {
      headers: { 'x-admin-secret': secret },
      cache: 'no-store',
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (err) {
    console.error('[admin-proxy] GET failed:', err);
    return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 });
  }
}
