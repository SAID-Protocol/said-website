/**
 * Base for calls the browser makes on behalf of a signed-in user.
 *
 * Same-origin on purpose: /api/said/* proxies to api.saidprotocol.com
 * server-side. The upstream CORS allowlist only holds the production web
 * origins, so hitting it directly from the browser fails with "Failed to
 * fetch" on localhost and preview domains. Going through the proxy makes
 * every environment behave like production.
 *
 * Use UPSTREAM_URL only for things CORS doesn't apply to (images) or for
 * documentation text.
 */
const API_URL = '/api/said';          // → api.saidprotocol.com (protocol)
const HOSTING_URL = '/api/hosting';   // → app.saidprotocol.com (hosting)
const UPSTREAM_URL = 'https://api.saidprotocol.com';

export { API_URL, HOSTING_URL, UPSTREAM_URL };

/**
 * Fetch with exponential backoff. Stops retrying on 429/5xx after maxRetries.
 * On 4xx (not 429), returns immediately (those are client errors, not transient).
 */
export async function fetchWithBackoff(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);

      // Only retry on 429 or 5xx
      if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(`[fetchWithBackoff] ${res.status} on attempt ${attempt + 1}, retrying in ${Math.round(delay)}ms: ${url}`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      return res;
    } catch (err) {
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(`[fetchWithBackoff] Network error on attempt ${attempt + 1}, retrying in ${Math.round(delay)}ms:`, err);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }

  // Shouldn't reach here, but just in case
  throw new Error('Max retries exceeded');
}
