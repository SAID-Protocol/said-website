const API_BASE = process.env.NEXT_PUBLIC_SAID_API_URL || 'https://app.saidprotocol.com';
const API_KEY = process.env.NEXT_PUBLIC_SAID_API_KEY || '';

export interface Agent {
  id: string;
  userId: string;
  name: string;
  flyMachineId: string | null;
  flyAppName: string | null;
  status: 'creating' | 'running' | 'paused' | 'stopped' | 'error';
  tier: 'free' | 'trial' | 'starter' | 'pro' | 'power';
  saidIdentity: string | null;  // Legacy — use walletAddress/saidPda instead
  walletAddress: string | null;
  saidPda: string | null;
  programMd: string | null;
  config: string | null;
  gatewayTokenHash: string | null;
  gatewayToken?: string; // Only present on creation response
  aiCreditsUsed: number;
  aiCreditsLimit: number;
  openrouterKeyHash: string | null;
  createdAt: string;
  updatedAt: string;
}

// Gateway token storage (localStorage)
const GATEWAY_TOKENS_KEY = 'said_gateway_tokens';

function getGatewayToken(agentId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const tokens = JSON.parse(localStorage.getItem(GATEWAY_TOKENS_KEY) || '{}');
    return tokens[agentId] || null;
  } catch {
    return null;
  }
}

function setGatewayToken(agentId: string, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    const tokens = JSON.parse(localStorage.getItem(GATEWAY_TOKENS_KEY) || '{}');
    tokens[agentId] = token;
    localStorage.setItem(GATEWAY_TOKENS_KEY, JSON.stringify(tokens));
  } catch (err) {
    console.error('Failed to store gateway token:', err);
  }
}

function removeGatewayToken(agentId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const tokens = JSON.parse(localStorage.getItem(GATEWAY_TOKENS_KEY) || '{}');
    delete tokens[agentId];
    localStorage.setItem(GATEWAY_TOKENS_KEY, JSON.stringify(tokens));
  } catch (err) {
    console.error('Failed to remove gateway token:', err);
  }
}

export interface BillingInfo {
  tier: string;
  billingStatus: string;
  billingMode: string;
  trialEndsAt: string | null;
  nextBillingDate: string | null;
  lastPaymentAt: string | null;
  monthlyAmountUsd: number | null;
  privyWalletAddress: string | null;
  paymentToken: string;
  walletBalance: number;
  solBalance: number;
  recentPayments: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  amountUsd: number;
  token: string;
  tokenAmount: number;
  txSignature: string | null;
  status: string;
  type: string;
  createdAt: string;
}

export interface PricingData {
  all_inclusive: { starter: number; pro: number; power: number };
  byok: { starter: number; pro: number; power: number };
}

export interface ActivityItem {
  id: number;
  agent_id: string;
  type: string;
  data: string | null;
  created_at: string;
}

// Store the access token getter globally
let getAccessTokenFn: (() => Promise<string | null>) | null = null;

export function setAccessTokenGetter(fn: () => Promise<string | null>) {
  getAccessTokenFn = fn;
}

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...opts.headers as Record<string, string>,
  };
  
  // Try to get Privy access token first
  if (getAccessTokenFn) {
    try {
      const token = await getAccessTokenFn();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Failed to get access token:', err);
    }
  }
  
  // Fallback to x-api-key if no token (for backwards compatibility)
  if (!headers['Authorization'] && API_KEY) {
    headers['x-api-key'] = API_KEY;
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });
  
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export const api = {
  listAgents: () => apiFetch<Agent[]>('/api/agents'),
  
  getAgent: (id: string) => apiFetch<{ agent: Agent; fly: unknown }>(`/api/agents/${id}`),
  
  createAgent: async (data: { name: string; tier?: string; program_md?: string; config?: Record<string, unknown>; telegram_token?: string; custom_api_key?: string }) => {
    const agent = await apiFetch<Agent>('/api/agents', { method: 'POST', body: JSON.stringify(data) });
    
    // Save gateway token to localStorage if present in response
    if (agent.gatewayToken) {
      setGatewayToken(agent.id, agent.gatewayToken);
    }
    
    return agent;
  },
  
  updateAgent: (id: string, data: { program_md?: string; config?: Record<string, unknown> }) =>
    apiFetch<Agent>(`/api/agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  startAgent: (id: string) => apiFetch<Agent>(`/api/agents/${id}/start`, { method: 'POST' }),
  
  stopAgent: (id: string) => apiFetch<Agent>(`/api/agents/${id}/stop`, { method: 'POST' }),
  
  deleteAgent: async (id: string) => {
    await apiFetch<void>(`/api/agents/${id}`, { method: 'DELETE' });
    // Clean up stored gateway token
    removeGatewayToken(id);
  },
  
  getAgentLogs: (id: string) => apiFetch<ActivityItem[]>(`/api/agents/${id}/logs`),
  
  chatWithAgent: async (id: string, messagesOrString: Array<{ role: string; content: string }> | string) => {
    let gatewayToken = getGatewayToken(id);
    
    // If not in localStorage, fetch from API (supports cross-device access)
    if (!gatewayToken) {
      const data = await apiFetch<{ agent: Agent } | Agent>(`/api/agents/${id}`);
      const agent = 'agent' in data ? data.agent : data;
      if (agent.gatewayToken) {
        setGatewayToken(id, agent.gatewayToken);
        gatewayToken = agent.gatewayToken;
      }
    }
    
    if (!gatewayToken) {
      throw new Error('Gateway token not found. Please recreate this agent.');
    }
    
    // Support both message array (new) and single message string (backwards compat)
    const body = Array.isArray(messagesOrString)
      ? { messages: messagesOrString }
      : { message: messagesOrString };
    
    return apiFetch<{ ok: boolean; data: unknown }>(`/api/agents/${id}/chat`, {
      method: 'POST',
      headers: {
        'x-gateway-token': gatewayToken,
      },
      body: JSON.stringify(body),
    });
  },
  
  getAgentUsage: (id: string) =>
    apiFetch<{ llm: { provider: string; unit?: string; limit: number; used: number; remaining: number; disabled?: boolean } | null; tier: string }>(`/api/agents/${id}/usage`),
  
  // Billing
  getBilling: () => apiFetch<BillingInfo>('/api/billing'),
  
  getWalletBalance: () => apiFetch<{ balance: number; walletAddress: string | null }>('/api/billing/balance'),
  
  startTrial: (tier: string, billingMode: string = 'all_inclusive') =>
    apiFetch<{ billingStatus: string; tier: string; trialEndsAt: string; monthlyAmount: number }>('/api/billing/start-trial', {
      method: 'POST',
      body: JSON.stringify({ tier, billingMode }),
    }),
  
  updateTier: (tier: string, billingMode: string) =>
    apiFetch<{ tier: string; billingMode: string; monthlyAmount: number }>('/api/billing/update-tier', {
      method: 'POST',
      body: JSON.stringify({ tier, billingMode }),
    }),
  
  setWallet: (walletAddress: string) =>
    apiFetch<{ success: boolean; walletAddress: string }>('/api/billing/set-wallet', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    }),
  
  getPayments: (limit: number = 20) =>
    apiFetch<PaymentRecord[]>(`/api/billing/payments?limit=${limit}`),
  
  getPricing: () => apiFetch<PricingData>('/api/billing/pricing'),

  getSignerStatus: () =>
    apiFetch<{ consented: boolean }>('/api/billing/signer-status'),

  markSignerConsented: () =>
    apiFetch<{ success: boolean }>('/api/billing/signer-consented', { method: 'POST' }),

  payManually: (txSignature: string) =>
    apiFetch<{ success: boolean; message: string; txSignature: string }>('/api/billing/pay', {
      method: 'POST',
      body: JSON.stringify({ txSignature }),
    }),
};
