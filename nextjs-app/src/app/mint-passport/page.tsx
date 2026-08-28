'use client';

import { useState } from 'react';
import { VersionedTransaction } from '@solana/web3.js';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import { API_URL, UPSTREAM_URL } from '@/lib/api';

type Step = 1 | 2 | 3;
type MintStatus = 'idle' | 'connecting' | 'building' | 'signing' | 'confirming' | 'complete';

interface AgentLookup {
  registered?: boolean;
  verified?: boolean;
  passportMint?: string;
  name?: string;
  identity?: { name?: string };
}

const STEPS: Array<[Step, string]> = [
  [1, 'Lookup agent'],
  [2, 'Connect & mint'],
  [3, 'Verify on-chain'],
];

export default function MintPassportPage() {
  const [agentWallet, setAgentWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [agent, setAgent] = useState<AgentLookup | null>(null);
  const [error, setError] = useState('');
  const [mintStatus, setMintStatus] = useState<MintStatus>('idle');
  const [txSignature, setTxSignature] = useState('');
  const [mintAddressState, setMintAddressState] = useState('');

  const lookupAgent = async () => {
    if (!agentWallet.trim()) {
      setError('Please enter a wallet address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/verify/${agentWallet}`);
      const data = await res.json();

      if (!res.ok || !data.registered) {
        setError('Agent not found. Make sure the wallet is registered on SAID Protocol.');
        setAgent(null);
        return;
      }
      if (!data.verified) {
        setError('Agent must be verified (L1) before minting a passport.');
        setAgent(null);
        return;
      }

      setAgent(data);
      setStep(data.passportMint ? 3 : 2);
    } catch {
      setError('Failed to lookup agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const mintPassport = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const provider = w.phantom?.solana || w.solflare;
    if (!provider) {
      setError('Please install Phantom or Solflare wallet');
      return;
    }

    try {
      setMintStatus('connecting');
      if (!provider.isConnected) await provider.connect();

      const connectedWallet = provider.publicKey?.toString();
      if (!connectedWallet) throw new Error('Failed to read wallet public key');
      if (connectedWallet !== agentWallet) {
        throw new Error(
          `Wallet mismatch. Connected: ${connectedWallet.slice(0, 4)}…${connectedWallet.slice(-4)}. Expected: ${agentWallet.slice(0, 4)}…${agentWallet.slice(-4)}`
        );
      }

      setMintStatus('building');
      const res = await fetch(`${API_URL}/api/passport/${agentWallet}/prepare`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to prepare transaction');

      const txBytes = Uint8Array.from(atob(data.transaction), (c) => c.charCodeAt(0));

      setMintStatus('signing');
      const tx = VersionedTransaction.deserialize(txBytes);
      const signedTx = await provider.signTransaction(tx);

      setMintStatus('confirming');
      // Broadcast via the API (uses the server's private RPC)
      const broadcastRes = await fetch(`${API_URL}/api/passport/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTransaction: Buffer.from(signedTx.serialize()).toString('base64'),
        }),
      });
      const broadcastData = await broadcastRes.json();
      if (!broadcastRes.ok) throw new Error(broadcastData.error || 'Broadcast failed');

      // let the transaction land before finalizing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTxSignature(broadcastData.signature);
      setMintAddressState(data.mintAddress);
      await finalize(broadcastData.signature, data.mintAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Minting failed');
      setMintStatus('idle');
    }
  };

  const finalize = async (txHash: string, mintAddress: string) => {
    try {
      const res = await fetch(`${API_URL}/api/passport/${agentWallet}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, mintAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Finalize failed');
      setMintStatus('complete');
      setStep(3);
    } catch {
      setError('Passport minted but failed to record. TX: ' + txHash);
      setMintStatus('idle');
    }
  };

  const mint = mintAddressState || agent?.passportMint;

  return (
    <div className="said-page said-mint">
      <div className="hero" style={{ textAlign: 'center' }}>
        <div className="kick">SOULBOUND IDENTITY</div>
        <h1>Mint an agent passport</h1>
        <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          A non-transferable Token-2022 passport binds an agent identity to its wallet and makes
          verification portable across ecosystems.
        </p>
      </div>

      <div className="steps mono">
        {STEPS.map(([n, label]) => (
          <span key={n} className={`stepitem${step >= n ? ' on' : ''}`}>
            <i>{step > n ? '✓' : n}</i>{label}
          </span>
        ))}
      </div>

      <DotSeam style={{ marginTop: 'clamp(20px,3vh,30px)' }} />

      <div className="mintwrap">
        <div className="card">
          <h2 className="seclabel mono">PASSPORT MINT CONTROL</h2>

          <label>AGENT PUBLIC KEY</label>
          <input
            type="text"
            className="mono"
            placeholder="Paste the agent public key"
            value={agentWallet}
            onChange={(e) => setAgentWallet(e.target.value)}
            disabled={step > 1}
          />

          {error && <div className="errbox">{error}</div>}

          {step === 1 && (
            <>
              <button className="btn fill full" onClick={lookupAgent} disabled={loading}>
                {loading ? 'Looking up…' : 'Lookup agent'}
              </button>
              <div className="note">
                <b>Flow:</b> sign the issue challenge, sign the Token-2022 mint transaction, sign
                the finalize challenge, then verify on-chain state.
              </div>
            </>
          )}

          {step === 2 && (
            <button className="btn fill full" onClick={mintPassport} disabled={mintStatus !== 'idle'}>
              {mintStatus === 'idle' && 'Mint on-chain'}
              {mintStatus === 'connecting' && 'Connecting wallet…'}
              {mintStatus === 'building' && 'Building transaction…'}
              {mintStatus === 'signing' && 'Sign in wallet…'}
              {mintStatus === 'confirming' && 'Confirming…'}
            </button>
          )}

          {step === 3 && (
            <div className="done">
              <span className="doneMark">✓</span>
              <h3>Passport minted</h3>
              <p>This identity is now permanent and portable.</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="seclabel mono">PASSPORT STATE</h2>

          {!agent ? (
            <p className="emptynote">Enter an agent wallet to view passport state.</p>
          ) : (
            <div className="rows">
              <div className="krow">
                <span className="seclabel mono">STATUS</span>
                <span className={`chip${step === 3 ? ' live' : ''}`}>
                  <i className="dot" />{step === 3 ? 'MINTED' : 'NOT MINTED'}
                </span>
              </div>
              <div className="krow">
                <span className="seclabel mono">OWNER</span>
                <span className="kval mono">{agentWallet.slice(0, 8)}…{agentWallet.slice(-8)}</span>
              </div>
              <div className="krow">
                <span className="seclabel mono">AGENT</span>
                <span className="kval">{agent.identity?.name || agent.name || 'Unknown'}</span>
              </div>

              {step === 3 && (
                <>
                  {txSignature && (
                    <div className="krow">
                      <span className="seclabel mono">TRANSACTION</span>
                      <a className="kval mono link" href={`https://solscan.io/tx/${txSignature}`} target="_blank" rel="noopener noreferrer">
                        {txSignature.slice(0, 12)}…{txSignature.slice(-8)} ↗
                      </a>
                    </div>
                  )}
                  {mint && (
                    <div className="krow">
                      <span className="seclabel mono">MINT ADDRESS</span>
                      <a className="kval mono link" href={`https://solscan.io/token/${mint}`} target="_blank" rel="noopener noreferrer">
                        {mint.slice(0, 8)}…{mint.slice(-8)} ↗
                      </a>
                    </div>
                  )}
                  <div className="krow">
                    <span className="seclabel mono">METADATA</span>
                    <a className="kval link" href={`${UPSTREAM_URL}/api/passport/${agentWallet}/metadata`} target="_blank" rel="noopener noreferrer">
                      View metadata ↗
                    </a>
                  </div>
                  {mint && (
                    <div className="krow">
                      <span className="seclabel mono">EXPLORER</span>
                      <a className="kval link" href={`https://explorer.solana.com/address/${mint}`} target="_blank" rel="noopener noreferrer">
                        View on Solana Explorer ↗
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <SaidFooter />

      <style>{`
        .said-mint .steps{display:flex;justify-content:center;gap:clamp(16px,4vw,44px);flex-wrap:wrap;margin-top:clamp(24px,4vh,36px);padding:0 clamp(20px,4vw,48px)}
        .said-mint .stepitem{display:inline-flex;align-items:center;gap:9px;font-size:11px;letter-spacing:.1em;color:var(--faint);text-transform:uppercase}
        .said-mint .stepitem i{width:24px;height:24px;border-radius:50%;border:1px solid var(--line);display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:11px}
        .said-mint .stepitem.on{color:var(--ink)}
        .said-mint .stepitem.on i{background:var(--ink);color:var(--bg);border-color:var(--ink)}
        .said-mint .mintwrap{max-width:1000px;margin:0 auto;padding:clamp(20px,3vh,30px) clamp(20px,4vw,48px) clamp(56px,9vh,90px);display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
        .said-mint .card{border:1px solid var(--line);border-radius:18px;padding:24px 26px;background:var(--card);min-width:0}
        .said-mint .seclabel{font-size:10.5px;letter-spacing:.16em;color:var(--faint);display:block}
        .said-mint .card h2{margin-bottom:6px}
        .said-mint .full{width:100%;margin-top:20px;text-align:center}
        .said-mint .errbox{margin-top:16px;border:1px solid #c0392b;border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.6;color:#c0392b}
        .said-mint .note{margin-top:18px;border:1px solid var(--line);border-radius:12px;padding:14px 16px;font-size:12.5px;line-height:1.65;color:var(--dim);background:var(--bg)}
        .said-mint .note b{color:var(--ink);font-weight:500}
        .said-mint .emptynote{margin-top:16px;font-size:13px;color:var(--faint);line-height:1.7}
        .said-mint .rows{margin-top:16px;display:grid;gap:2px}
        .said-mint .krow{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:11px 0;border-top:1px solid var(--line);flex-wrap:wrap}
        .said-mint .krow:first-child{border-top:0}
        .said-mint .kval{font-size:13px;color:var(--dim);word-break:break-all;text-align:right}
        .said-mint .link{color:var(--ink);border-bottom:1px solid var(--line)}
        .said-mint .link:hover{border-color:var(--ink)}
        .said-mint .chip{display:inline-flex;align-items:center;gap:7px;font-size:10px;letter-spacing:.1em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:5px 11px;font-family:ui-monospace,"SF Mono",Menlo,monospace}
        .said-mint .chip .dot{width:5px;height:5px;border-radius:50%;background:var(--faint)}
        .said-mint .chip.live{color:var(--good);border-color:var(--good)}
        .said-mint .chip.live .dot{background:var(--good)}
        .said-mint .done{text-align:center;padding:22px 0 6px}
        .said-mint .doneMark{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;background:var(--good);color:#fff;font-size:20px}
        .said-mint .done h3{margin-top:14px;font-size:17px;font-weight:600}
        .said-mint .done p{margin-top:6px;font-size:13px;color:var(--dim)}
        @media (max-width:820px){.said-mint .mintwrap{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
