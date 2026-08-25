'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';

type Mode = 'have' | 'new';

export default function CreateAgentPage() {
  const { authenticated, login } = usePrivy();
  const { sessionToken, privyAccessToken } = useAuth();
  const [mode, setMode] = useState<Mode>('have');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [wallet, setWallet] = useState('');
  const [skills, setSkills] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const pick = (m: Mode) => {
    if (!authenticated) { login(); return; }
    setMode(m);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated) { login(); return; }
    setLoading(true);

    try {
      let agentWallet = mode === 'new' ? 'new' : wallet;

      // New custodial wallet → create via Platform API first
      if (agentWallet === 'new') {
        const privyToken = await privyAccessToken();
        const createRes = await fetch('https://app.saidprotocol.com/api/agents/create-with-wallet', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${privyToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
        if (!createRes.ok) {
          const err = await createRes.json();
          throw new Error(err.error || 'Failed to create agent wallet');
        }
        const createData = await createRes.json();
        agentWallet = createData.walletAddress;
        if (createData.apiKey) setApiKey(createData.apiKey);
      }

      // Register on Protocol API
      const res = await fetch('https://api.saidprotocol.com/api/register/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          twitter,
          website,
          wallet: agentWallet,
          capabilities: skills.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error('Registration failed');

      // Link agent to the user's account
      if (sessionToken && agentWallet) {
        await fetch('https://api.saidprotocol.com/users/me/agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ agentWallet }),
        });
      }

      setSuccess(true);

      // Try to fetch the API key for this agent
      if (sessionToken && agentWallet) {
        try {
          const agentsRes = await fetch('https://api.saidprotocol.com/api/agents', {
            headers: { 'Authorization': `Bearer ${sessionToken}` },
          });
          if (agentsRes.ok) {
            const agents = await agentsRes.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const match = Array.isArray(agents) ? agents.find((a: any) => a.walletAddress === agentWallet) : null;
            if (match?.id) {
              const keyRes = await fetch(`https://api.saidprotocol.com/api/agents/${match.id}/api-key`, {
                headers: { 'Authorization': `Bearer ${sessionToken}` },
              });
              if (keyRes.ok) {
                const keyData = await keyRes.json();
                if (keyData.gatewayToken) setApiKey(keyData.gatewayToken);
              }
            }
          }
        } catch {}
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="said-page said-create">
        <SaidNav />
        <div className="hero" style={{ textAlign: 'center' }}>
          <div className="kick">REGISTERED · ON-CHAIN</div>
          <h1>Agent created.</h1>
          <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Your agent is live on the SAID registry. Copy the API key below to connect it to your app.
          </p>
        </div>
        <div className="formwrap">
          {apiKey && (
            <div className="keybox">
              <span className="l">YOUR API KEY</span>
              <p>Use this key to let your agent sign transactions through SAID rails. Your agent never needs a private key — just this API key.</p>
              <div className="keyrow">
                <code className="mono">{apiKey}</code>
                <button
                  className="copybtn"
                  onClick={() => { navigator.clipboard.writeText(apiKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000); }}
                >
                  {copiedKey ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          )}
          <div className="note">
            <b>Security:</b> your agent&apos;s wallet is secured by Privy and managed by SAID. The API key can be
            rotated anytime from My Agents. Private keys never leave the wallet infrastructure.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
            <Link className="btn fill" href="/my-agents">My Agents</Link>
            <Link className="btn" href="/docs">View docs</Link>
          </div>
        </div>
        <SaidFooter />
        <style>{createStyles}</style>
      </div>
    );
  }

  return (
    <div className="said-page said-create">
      <SaidNav />

      <div className="hero" style={{ textAlign: 'center' }}>
        <div className="kick">FREE · ONE STEP · ON-CHAIN</div>
        <h1>Register your agent</h1>
        <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          Add your AI agent to the SAID registry. Custodial wallet, on-chain registration, and an API key — no CLI needed.
        </p>
      </div>

      <div className="choice">
        <button className={`opt${mode === 'have' ? ' on' : ''}`} onClick={() => pick('have')} type="button">
          <h3>I have a wallet</h3>
          <p>Register an existing Solana wallet as your agent&apos;s identity.</p>
        </button>
        <button className={`opt${mode === 'new' ? ' on' : ''}`} onClick={() => pick('new')} type="button">
          <h3>Generate new wallet</h3>
          <p>Create a fresh custodial Solana wallet for your new agent.</p>
        </button>
      </div>

      <form className="formwrap" onSubmit={handleSubmit}>
        {mode === 'have' && (
          <div>
            <label>SOLANA WALLET ADDRESS</label>
            <input type="text" className="mono" value={wallet} onChange={(e) => setWallet(e.target.value)} required placeholder="e.g. 8GReKrDQ…8Veb" />
          </div>
        )}
        <label>AGENT NAME</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="My Agent" />
        <label>DESCRIPTION <b>· what does it do?</b></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Trades on Jupiter, answers support tickets, runs a newsletter…" />
        <label>SKILLS <b>· comma-separated, optional</b></label>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="trading, research, coding" />
        <div className="two">
          <div>
            <label>X HANDLE <b>· optional</b></label>
            <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@myagent" />
          </div>
          <div>
            <label>WEBSITE <b>· optional</b></label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://myagent.com" />
          </div>
        </div>
        <div className="note">
          <b>What happens next?</b> We create a custodial wallet for your agent (or use yours), register it
          on-chain, and give you an API key. Registration is free; the verified badge is 0.01 SOL, once.
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 30, flexWrap: 'wrap' }}>
          <button className="btn fill" type="submit" disabled={loading || !name || (mode === 'have' && !wallet)}>
            {loading ? (mode === 'new' ? 'Creating…' : 'Registering…') : authenticated ? (mode === 'new' ? 'Create agent' : 'Register agent') : 'Log in to continue'}
          </button>
          <Link className="btn" href="/docs">Prefer the CLI? Read the docs</Link>
        </div>
      </form>

      <SaidFooter />
      <style>{createStyles}</style>
    </div>
  );
}

const createStyles = `
  .said-create .choice{max-width:820px;margin:clamp(28px,4vh,44px) auto 0;padding:0 clamp(20px,4vw,48px);display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .said-create .opt{border:1px solid var(--line);border-radius:20px;padding:28px;cursor:pointer;background:none;text-align:left;font-family:inherit;color:var(--ink);transition:background-color .3s,color .3s,border-color .3s}
  .said-create .opt:hover{border-color:var(--ink)}
  .said-create .opt.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
  .said-create .opt h3{font-size:17px;font-weight:600}
  .said-create .opt p{margin-top:8px;font-size:13.5px;line-height:1.6;color:var(--dim)}
  .said-create .opt.on p{color:inherit;opacity:.7}
  .said-create .formwrap{max-width:820px;margin:0 auto;padding:clamp(24px,4vh,36px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
  .said-create .two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .said-create .note{margin-top:26px;border:1px solid var(--line);border-radius:14px;padding:16px 18px;font-size:13px;line-height:1.65;color:var(--dim);background:var(--card)}
  .said-create .note b{color:var(--ink);font-weight:500}
  .said-create .keybox{border:1px solid var(--line);border-radius:14px;padding:20px 22px;background:var(--card)}
  .said-create .keybox .l{font-size:11px;letter-spacing:.14em;color:var(--faint)}
  .said-create .keybox p{margin-top:8px;font-size:13px;line-height:1.6;color:var(--dim)}
  .said-create .keyrow{display:flex;gap:10px;margin-top:14px;align-items:center}
  .said-create .keyrow code{flex:1;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:var(--bg);font-size:12.5px;overflow-x:auto;white-space:nowrap}
  .said-create .copybtn{font-size:11px;letter-spacing:.06em;color:var(--faint);background:none;border:1px solid var(--line);border-radius:99px;padding:8px 16px;cursor:pointer;font-family:inherit}
  .said-create .copybtn:hover{color:var(--ink);border-color:var(--ink)}
  @media (max-width:700px){.said-create .choice{grid-template-columns:1fr}.said-create .two{grid-template-columns:1fr}}
`;
