const API_BASE = process.env.NEXT_PUBLIC_SAID_API_URL || 'https://said-platform-api.fly.dev';
const API_KEY = process.env.NEXT_PUBLIC_SAID_API_KEY || '';

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  fly_machine_id: string | null;
  fly_app_name: string | null;
  status: 'creating' | 'running' | 'paused' | 'stopped' | 'error';
  tier: 'starter' | 'pro' | 'power';
  said_identity: string | null;
  program_md: string | null;
  config: string | null;
  gateway_token: string | null;
  ai_credits_used: number;
  ai_credits_limit: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityItem {
  id: number;
  agent_id: string;
  type: string;
  data: string | null;
  created_at: string;
}

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...opts.headers,
    },
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
  
  createAgent: (data: { name: string; tier?: string; program_md?: string }) =>
    apiFetch<Agent>('/api/agents', { method: 'POST', body: JSON.stringify(data) }),
  
  updateAgent: (id: string, data: { program_md?: string; config?: Record<string, unknown> }) =>
    apiFetch<Agent>(`/api/agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  startAgent: (id: string) => apiFetch<Agent>(`/api/agents/${id}/start`, { method: 'POST' }),
  
  stopAgent: (id: string) => apiFetch<Agent>(`/api/agents/${id}/stop`, { method: 'POST' }),
  
  deleteAgent: (id: string) => apiFetch<void>(`/api/agents/${id}`, { method: 'DELETE' }),
  
  getAgentLogs: (id: string) => apiFetch<ActivityItem[]>(`/api/agents/${id}/logs`),
  
  chatWithAgent: (id: string, message: string) =>
    apiFetch<{ ok: boolean; data: unknown }>(`/api/agents/${id}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};
