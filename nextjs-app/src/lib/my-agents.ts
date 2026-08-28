import { API_URL, HOSTING_URL } from '@/lib/api';

/**
 * Shared "agents belonging to the signed-in user" logic.
 *
 * Two backends hold different halves of the picture and it is easy to get
 * wrong (the profile page previously did, on both counts):
 *
 *  - hosting API (app.saidprotocol.com) — agents with a managed wallet. This
 *    is the ONLY place gateway/API keys exist; the protocol API has no
 *    /api-key route at all (it 404s). Authenticates with the Privy token.
 *  - protocol API (api.saidprotocol.com) — the on-chain registry. Needs
 *    ?mine=true or it returns the entire public directory (8k+ agents).
 *    Authenticates with the backend session token.
 *
 * Keeping this in one place so every surface agrees.
 */

export type AgentSource = 'hosted' | 'protocol';

export interface MyAgent {
  id: string;
  wallet: string;
  name: string;
  description?: string;
  isVerified: boolean;
  twitter?: string;
  gatewayToken?: string;
  registeredAt?: string;
  source: AgentSource;
  hasApiKey?: boolean;
}

/** Hosted agents first, then registry-only ones, deduplicated by id + wallet. */
export async function fetchMyAgents(
  sessionToken: string | null,
  privyToken: string | null,
): Promise<MyAgent[]> {
  // Both backends are hit in parallel — they used to run one after the other,
  // which doubled the wait on a mobile connection for no reason.
  const [hostedRes, protocolRes] = await Promise.all([
    privyToken
      ? fetch(`${HOSTING_URL}/api/agents`, { headers: { Authorization: `Bearer ${privyToken}` } })
          .then((r) => (r.ok ? r.json() : null))
          .catch((err) => { console.error('[fetchMyAgents] hosted fetch failed:', err); return null; })
      : Promise.resolve(null),
    sessionToken
      ? fetch(`${API_URL}/api/agents?mine=true`, { headers: { Authorization: `Bearer ${sessionToken}` } })
          .then((r) => (r.ok ? r.json() : null))
          .catch((err) => { console.error('[fetchMyAgents] protocol fetch failed:', err); return null; })
      : Promise.resolve(null),
  ]);

  const hosted: MyAgent[] = [];
  const protocol: MyAgent[] = [];

  if (hostedRes) {
    const list = Array.isArray(hostedRes) ? hostedRes : (hostedRes.agents || []);
    for (const a of list) {
      hosted.push({
        id: a.id,
        wallet: a.walletAddress || a.wallet || '',
        name: a.name || 'Unnamed',
        description: a.description,
        isVerified: a.isVerified ?? false,
        twitter: a.twitter,
        gatewayToken: a.gatewayToken,
        registeredAt: a.registeredAt ?? a.createdAt,
        source: 'hosted',
        hasApiKey: true,
      });
    }
  }

  if (protocolRes) {
    const list = Array.isArray(protocolRes) ? protocolRes : (protocolRes.agents || []);
    const ids = new Set(hosted.map((a) => a.id));
    const wallets = new Set(hosted.map((a) => a.wallet));
    for (const a of list) {
      const wallet = a.wallet || a.walletAddress || '';
      if (ids.has(a.id) || wallets.has(wallet)) continue;
      protocol.push({
        id: a.id,
        wallet,
        name: a.name || 'Unnamed',
        description: a.description,
        isVerified: a.isVerified ?? false,
        twitter: a.twitter,
        registeredAt: a.registeredAt ?? a.createdAt,
        source: 'protocol',
        hasApiKey: false,
      });
    }
  }

  return [...hosted, ...protocol];
}

/** Gateway/API key for one agent. Hosting API only. */
export async function fetchAgentKey(agentId: string, privyToken: string | null): Promise<string | null> {
  if (!privyToken) return null;
  try {
    const res = await fetch(`${HOSTING_URL}/api/agents/${agentId}/api-key`, {
      headers: { Authorization: `Bearer ${privyToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.gatewayToken ?? null;
  } catch (err) {
    console.error('[fetchAgentKey] failed:', err);
    return null;
  }
}

/** Rotate an agent's key. Invalidates the old one immediately. */
export async function rotateAgentKey(agentId: string, privyToken: string | null): Promise<string | null> {
  if (!privyToken) return null;
  try {
    const res = await fetch(`${HOSTING_URL}/api/agents/${agentId}/rotate-key`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${privyToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.gatewayToken ?? null;
  } catch (err) {
    console.error('[rotateAgentKey] failed:', err);
    return null;
  }
}
