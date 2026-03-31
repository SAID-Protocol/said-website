'use client';

import { useEffect, useState } from 'react';
import { Agent, api } from '@/lib/api';

interface OverviewPanelProps {
  agent: Agent;
}

function StatusCard({ label, value, status, detail }: { 
  label: string; 
  value: string; 
  status: 'connected' | 'disconnected' | 'pending' | 'none';
  detail?: string;
}) {
  const statusColors = {
    connected: 'bg-emerald-500',
    disconnected: 'bg-red-500',
    pending: 'bg-amber-500',
    none: 'bg-zinc-600',
  };
  const statusLabels = {
    connected: 'Connected',
    disconnected: 'Not connected',
    pending: 'Pending',
    none: '—',
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${statusColors[status]}`} />
          <span className="text-xs text-zinc-400">{statusLabels[status]}</span>
        </div>
      </div>
      <div className="text-sm font-medium text-white truncate">{value}</div>
      {detail && <div className="text-xs text-zinc-500 mt-1 truncate">{detail}</div>}
    </div>
  );
}

// SVG Icons for quick actions
function BeakerIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" />
    </svg>
  );
}

function SendIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  );
}

function LinkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CogIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function QuickAction({ icon, label, description, onClick, variant = 'default' }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
  variant?: 'default' | 'primary';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
        variant === 'primary'
          ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className={`mt-0.5 flex-shrink-0 ${variant === 'primary' ? 'text-amber-400' : 'text-zinc-400'}`}>
        {icon}
      </div>
      <div>
        <div className={`text-sm font-medium ${variant === 'primary' ? 'text-amber-300' : 'text-white'}`}>
          {label}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5">{description}</div>
      </div>
    </button>
  );
}

export default function OverviewPanel({ agent }: OverviewPanelProps) {
  const [usage, setUsage] = useState<{ llm: { used: number; limit: number; unit?: string } | null } | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    api.getAgentUsage(agent.id).then(setUsage).catch(() => {});
    const interval = setInterval(() => {
      api.getAgentUsage(agent.id).then(setUsage).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [agent.id]);

  const isPrompts = usage?.llm?.unit === 'prompts';
  const used = usage?.llm?.used ?? agent.aiCreditsUsed;
  const limit = usage?.llm?.limit ?? agent.aiCreditsLimit;
  const pct = limit > 0 ? (used / limit) * 100 : 0;

  // Determine connection statuses from agent data
  const hasTelegram = agent.config ? (() => {
    try { 
      const c = JSON.parse(agent.config);
      return !!(c.telegram_token || c.telegramToken);
    } catch { return false; }
  })() : false;
  
  const walletAddress = agent.walletAddress ?? agent.saidIdentity;
  const hasWallet = !!walletAddress;
  const saidPda = agent.saidPda;
  const saidRegistered = agent.saidRegistered;
  const saidVerified = agent.saidVerified;

  const handleTestAgent = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await api.chatWithAgent(agent.id, 'Hello! Please respond with a brief greeting.');
      setTestResult('✓ Agent responded successfully');
    } catch (err) {
      setTestResult(`✗ ${err instanceof Error ? err.message : 'Failed to reach agent'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="p-5 space-y-6">
        
        {/* Agent Status Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-3 w-3 rounded-full ${agent.status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
            <span className="text-sm font-medium text-white">
              {agent.status === 'running' ? 'Agent is running' : 'Agent is offline'}
            </span>
          </div>
        </div>

        {/* Connections Grid */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">Connections</h3>
          <div className={`grid grid-cols-1 gap-3 ${hasTelegram ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            <StatusCard 
              label="Wallet" 
              value={walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Creating...'}
              status={hasWallet ? 'connected' : 'pending'}
              detail={hasWallet ? 'Solana mainnet' : 'Generated on first boot'}
            />
            <StatusCard 
              label="SAID Identity" 
              value={
                saidVerified ? `${saidPda!.slice(0, 4)}...${saidPda!.slice(-4)} ✓` 
                : saidRegistered ? `${saidPda!.slice(0, 4)}...${saidPda!.slice(-4)}`
                : saidPda ? 'Not registered'
                : 'Pending'
              }
              status={saidVerified ? 'connected' : saidRegistered ? 'connected' : 'pending'}
              detail={
                saidVerified ? 'Verified on Solana mainnet'
                : saidRegistered ? 'Registered (not yet verified)'
                : 'On-chain identity pending'
              }
            />
            {hasTelegram && (
              <StatusCard 
                label="Telegram" 
                value="Bot connected"
                status="connected"
                detail="Receiving messages"
              />
            )}
          </div>
        </div>

        {/* Usage */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">Usage</h3>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-zinc-400">{isPrompts ? 'Prompts used' : 'Credits used'}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-semibold text-white">
                  {isPrompts ? used : used.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-500">/ {isPrompts ? limit : limit.toFixed(1)}</span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div 
                className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(pct, 100)}%` }} 
              />
            </div>
            {isPrompts && (
              <div className="mt-2 text-xs text-zinc-500">
                {limit - used} prompts remaining in your 7-day trial
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <QuickAction
              icon={<BeakerIcon />}
              label="Test Agent" 
              description={testing ? 'Sending test message...' : testResult || 'Send a test message to verify your agent is responding'}
              onClick={handleTestAgent}
              variant="primary"
            />
            {hasTelegram && (
              <QuickAction
                icon={<SendIcon />}
                label="Open in Telegram"
                description="Chat with your agent on Telegram"
                onClick={() => window.open('https://t.me/', '_blank')}
              />
            )}
            {hasWallet && (
              <QuickAction
                icon={<LinkIcon />}
                label="View On-Chain Identity"
                description={`View your agent's SAID profile`}
                onClick={() => window.open(`https://www.saidprotocol.com/agents/${walletAddress}`, '_blank')}
              />
            )}
            <QuickAction
              icon={<CogIcon />}
              label="Configure Agent"
              description="Set your agent's mission, personality, and tools"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('dashboard-tab', { detail: 'configure' }));
              }}
            />
          </div>
        </div>

        {/* Agent Details */}
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">Details</h3>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Tier</span>
              <span className="text-white">{agent.tier.charAt(0).toUpperCase() + agent.tier.slice(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Created</span>
              <span className="text-white">{new Date(agent.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Agent ID</span>
              <span className="font-mono text-xs text-zinc-400">{agent.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
