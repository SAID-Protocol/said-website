/**
 * Tiny localStorage-backed stale-while-revalidate cache.
 *
 * The authenticated pages used to sit on a spinner every visit: mount →
 * effect reads the session token → re-render → fetch → render. Two render
 * cycles and a network round-trip before anything appeared, even for a
 * returning user whose data hadn't changed.
 *
 * With this, a page paints last-known data on the first frame and quietly
 * refreshes behind it. Cached payloads are per-user (keyed by a token
 * fingerprint) so switching accounts can't show the previous account's data.
 */

const PREFIX = 'said_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes — stale beyond this isn't shown

type Entry<T> = { v: T; t: number; who: string };

/** Short non-reversible fingerprint of the session token, to scope cache per user. */
function fingerprint(token: string | null): string {
  if (!token) return 'anon';
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) | 0;
  return String(h);
}

export function readCache<T>(key: string, token: string | null, ttl = DEFAULT_TTL): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    if (entry.who !== fingerprint(token)) return null;   // different account
    if (Date.now() - entry.t > ttl) return null;          // too stale to show
    return entry.v;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, token: string | null, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: Entry<T> = { v: value, t: Date.now(), who: fingerprint(token) };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // quota or private mode — caching is an optimisation, never required
  }
}

/** Drop every cached payload. Call on logout so nothing leaks to the next user. */
export function clearCache(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}
