'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import ShimmerDots from '@/components/said/ShimmerDots';
import { useAuth } from '@/hooks/useAuth';
import { HOSTING_URL } from '@/lib/api';
import { fetchMyAgents, fetchAgentKey, rotateAgentKey, type MyAgent } from '@/lib/my-agents';
import { readCache, writeCache } from '@/lib/cache';

export default function MyAgentsPage() {
  const { authenticated, login } = usePrivy();
  const { sessionToken, privyAccessToken, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<MyAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [showKeyForId, setShowKeyForId] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const fetchApiKey = async (agentId: string) => {
    if (apiKeys[agentId]) return;
    const privyToken = privyAccessToken ? await privyAccessToken() : null;
    const key = await fetchAgentKey(agentId, privyToken);
    if (key) setApiKeys((prev) => ({ ...prev, [agentId]: key }));
  };

  const generateWallet = async (agentId: string) => {
    if (!privyAccessToken) return;
    try {
      const privyToken = await privyAccessToken();
      const res = await fetch(`${HOSTING_URL}/api/agents/${agentId}/provision-wallet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${privyToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.apiKey) {
          setApiKeys((prev) => ({ ...prev, [agentId]: data.apiKey }));
          setShowKeyForId(agentId);
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to generate wallet');
      }
    } catch (err) {
      console.error('[generateWallet] Error', err);
      alert('Failed to generate wallet');
    }
  };

  const rotateKey = async (agentId: string) => {
    if (!confirm('This will invalidate the old API key. Any integrations using it will stop working. Continue?')) return;
    setRotatingId(agentId);
    const privyToken = privyAccessToken ? await privyAccessToken() : null;
    const rotated = await rotateAgentKey(agentId, privyToken);
    if (rotated) setApiKeys((prev) => ({ ...prev, [agentId]: rotated }));
    setRotatingId(null);
  };

  const copyKey = (agentId: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(agentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (!sessionToken) { setLoading(false); return; }

    // Paint last-known agents on the first frame, then revalidate behind it.
    const cached = readCache<MyAgent[]>('my-agents', sessionToken);
    if (cached?.length) {
      setAgents(cached);
      for (const a of cached) {
        if (a.gatewayToken) setApiKeys((prev) => ({ ...prev, [a.id]: a.gatewayToken as string }));
      }
      setLoading(false);
    }
    loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  const loadAgents = async () => {
    const privyToken = privyAccessToken ? await privyAccessToken() : null;
    const list = await fetchMyAgents(sessionToken, privyToken);
    for (const a of list) {
      if (a.gatewayToken) setApiKeys((prev) => ({ ...prev, [a.id]: a.gatewayToken as string }));
    }
    setAgents(list);
    writeCache('my-agents', sessionToken, list);
    setLoading(false);
  };

  const shell = (children: React.ReactNode) => (
    <div className="said-page said-mine">
      {children}
      <SaidFooter />
      <style>{mineStyles}</style>
    </div>
  );

  if (!authenticated) {
    return shell(
      <div className="hero" style={{ textAlign: 'center', minHeight: '52vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="kick">YOUR AGENTS</div>
        <h1>Sign in to view your agents.</h1>
        <div style={{ marginTop: 28 }}>
          <button className="btn fill" onClick={login}>Log in</button>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return shell(
      <div className="hero" style={{ textAlign: 'center', minHeight: '52vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="mono" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--faint)' }}>LOADING YOUR AGENTS…</p>
      </div>
    );
  }

  return shell(
    <main className="minewrap">
      <div className="minehead">
        <div>
          <div className="kick">YOUR AGENTS</div>
          <h1>My agents</h1>
        </div>
        <Link className="btn fill" href="/create-agent">Register an agent</Link>
      </div>

      <DotSeam style={{ marginBottom: 'clamp(20px,3vh,30px)' }} />

      {agents.length === 0 ? (
        <div className="emptycard">
          <ShimmerDots />
          <h3>No agents yet</h3>
          <p>Register your first agent to get an on-chain identity and an API key.</p>
          <Link className="btn fill" style={{ marginTop: 22 }} href="/create-agent">Register an agent</Link>
        </div>
      ) : (
        <div className="agentlist">
          {agents.map((agent) => {
            const key = apiKeys[agent.id];
            const shown = showKeyForId === agent.id;
            const walletShort = agent.wallet
              ? `${agent.wallet.substring(0, 8)}…${agent.wallet.substring(agent.wallet.length - 8)}`
              : '—';
            return (
              <div key={agent.id} className={`agentcard${agent.source === 'hosted' ? ' hosted' : ''}`}>
                {/* live-wallet agents get the breathing field — same signal as
                    the trust card: this one is active */}
                {(agent.source === 'hosted' || key) && <ShimmerDots />}
                <div className="ahead">
                  <span className="aav">{(agent.name || '?')[0].toUpperCase()}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="anamerow">
                      <h3>{agent.name}</h3>
                      {agent.isVerified && <span className="vbadge">✓</span>}
                      {(agent.source === 'hosted' || key) && (
                        <span className="chip live mono"><i className="dot" />WALLET ACTIVE</span>
                      )}
                      {agent.source === 'protocol' && <span className="chip mono">REGISTRY</span>}
                    </div>
                    {agent.wallet && (
                      <Link className="awallet mono" href={`/agents/${agent.wallet}`} title="View public profile">
                        {walletShort}
                      </Link>
                    )}
                    {agent.description && <p className="adesc">{agent.description}</p>}
                  </div>
                  {agent.twitter && (
                    <a className="pill" href={`https://twitter.com/${agent.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      @{agent.twitter.replace('@', '')}
                    </a>
                  )}
                </div>

                <div className="akey">
                  <div className="akeyhead">
                    <span className="seclabel mono">{agent.source === 'hosted' ? 'API KEY' : 'TRANSACTIONS'}</span>
                    <div className="akeyacts">
                      {key ? (
                        <>
                          <button className="minibtn" onClick={() => copyKey(agent.id, key)}>
                            {copiedId === agent.id ? 'COPIED' : 'COPY'}
                          </button>
                          <button className="minibtn" onClick={() => setShowKeyForId(shown ? null : agent.id)}>
                            {shown ? 'HIDE' : 'SHOW'}
                          </button>
                          {agent.source === 'hosted' && (
                            <button
                              className="minibtn danger"
                              onClick={() => rotateKey(agent.id)}
                              disabled={rotatingId === agent.id}
                            >
                              {rotatingId === agent.id ? 'ROTATING…' : 'ROTATE'}
                            </button>
                          )}
                        </>
                      ) : agent.source === 'hosted' ? (
                        <button
                          className="minibtn"
                          onClick={() => { fetchApiKey(agent.id); setShowKeyForId(shown ? null : agent.id); }}
                        >
                          {shown ? 'HIDE' : 'SHOW'}
                        </button>
                      ) : (
                        <button className="btn" onClick={() => generateWallet(agent.id)}>Get an API key</button>
                      )}
                    </div>
                  </div>
                  {shown && <code className="akeyval mono">{key || 'Loading…'}</code>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

const mineStyles = `
  .said-mine .minewrap{max-width:960px;margin:0 auto;padding:clamp(32px,5vh,52px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
  .said-mine .minehead{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:clamp(24px,4vh,36px)}
  .said-mine .minehead h1{margin-top:12px;font-size:clamp(28px,3.4vw,42px);font-weight:500;letter-spacing:-.03em}
  .said-mine .seclabel{font-size:10.5px;letter-spacing:.16em;color:var(--faint)}
  .said-mine .emptycard{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:20px;padding:64px 30px;text-align:center;background:var(--card)}
  .said-mine .emptycard>*:not(canvas){position:relative}
  .said-mine .emptycard h3{font-size:18px;font-weight:500}
  .said-mine .emptycard p{margin:10px auto 0;font-size:14px;color:var(--dim);max-width:40ch;line-height:1.65}
  .said-mine .agentlist{display:grid;gap:14px}
  .said-mine .agentcard{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:18px;padding:22px 24px;background:var(--card)}
  .said-mine .agentcard>*:not(canvas){position:relative}
  .said-mine .agentcard.hosted{border-color:var(--ink)}
  .said-mine .ahead{display:flex;gap:16px;align-items:flex-start}
  .said-mine .aav{width:44px;height:44px;flex:none;border-radius:12px;border:1px solid var(--line);background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:600}
  .said-mine .anamerow{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .said-mine .anamerow h3{font-size:17px;font-weight:600;letter-spacing:-.01em}
  .said-mine .vbadge{flex:none;width:16px;height:16px;border-radius:50%;background:var(--ink);color:var(--bg);display:inline-flex;align-items:center;justify-content:center;font-size:9px}
  .said-mine .chip{display:inline-flex;align-items:center;gap:6px;font-size:9.5px;letter-spacing:.1em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:4px 10px}
  .said-mine .chip .dot{width:5px;height:5px;border-radius:50%;background:var(--good)}
  .said-mine .chip.live{color:var(--good);border-color:var(--good)}
  .said-mine .awallet{display:inline-block;margin-top:6px;font-size:12px;color:var(--faint);border-bottom:1px solid transparent}
  .said-mine .awallet:hover{color:var(--ink);border-bottom-color:var(--line)}
  .said-mine .adesc{margin-top:8px;font-size:13.5px;line-height:1.6;color:var(--dim);max-width:56ch}
  .said-mine .pill{font-size:12px;padding:6px 13px;flex:none}
  .said-mine .akey{margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}
  .said-mine .akeyhead{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .said-mine .akeyacts{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .said-mine .minibtn{font-size:10px;letter-spacing:.08em;font-family:ui-monospace,"SF Mono",Menlo,monospace;color:var(--dim);background:none;border:1px solid var(--line);border-radius:99px;padding:5px 11px;cursor:pointer}
  .said-mine .minibtn:hover{color:var(--ink);border-color:var(--ink)}
  .said-mine .minibtn:disabled{opacity:.5;cursor:default}
  .said-mine .minibtn.danger:hover{color:#c0392b;border-color:#c0392b}
  .said-mine .akeyacts .btn{padding:9px 18px;font-size:12.5px}
  .said-mine .akeyval{display:block;margin-top:12px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:var(--bg);font-size:11.5px;color:var(--dim);word-break:break-all}
  @media (max-width:700px){
    .said-mine .minehead{align-items:flex-start;flex-direction:column}
    .said-mine .ahead{flex-wrap:wrap}
  }
`;
