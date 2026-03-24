'use client';

import { useState } from 'react';
import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import Navbar from '@/components/Navbar';
import AsciiBackground from '@/components/AsciiBackground';
import Footer from '@/components/Footer';

export default function MintPassportPage() {
  const [agentWallet, setAgentWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agent, setAgent] = useState<any>(null);
  const [error, setError] = useState('');
  const [mintStatus, setMintStatus] = useState<'idle' | 'connecting' | 'building' | 'signing' | 'confirming' | 'complete'>('idle');
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
      const res = await fetch(`https://api.saidprotocol.com/api/verify/${agentWallet}`);
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
      
      if (data.passportMint) {
        // Already minted - show completion state
        setStep(3);
        return;
      }

      setStep(2);
    } catch (err) {
      setError('Failed to lookup agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const mintPassport = async () => {
    const provider = (window as any).phantom?.solana || (window as any).solflare;
    if (!provider) {
      setError('Please install Phantom or Solflare wallet');
      return;
    }

    try {
      setMintStatus('connecting');
      if (!provider.isConnected) await provider.connect();

      const connectedWallet = provider.publicKey?.toString();
      if (!connectedWallet) {
        throw new Error('Failed to read wallet public key');
      }

      if (connectedWallet !== agentWallet) {
        throw new Error(`Wallet mismatch. Connected: ${connectedWallet.slice(0,4)}...${connectedWallet.slice(-4)}. Expected: ${agentWallet.slice(0,4)}...${agentWallet.slice(-4)}`);
      }

      setMintStatus('building');
      const res = await fetch(`https://api.saidprotocol.com/api/passport/${agentWallet}/prepare`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to prepare transaction');

      const txBytes = Uint8Array.from(atob(data.transaction), c => c.charCodeAt(0));

      setMintStatus('signing');
      
      const tx = VersionedTransaction.deserialize(txBytes);
      const signedTx = await provider.signTransaction(tx);

      setMintStatus('confirming');
      
      // Broadcast via API proxy (uses server's private QuickNode RPC)
      const broadcastRes = await fetch('https://api.saidprotocol.com/api/passport/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTransaction: Buffer.from(signedTx.serialize()).toString('base64'),
        }),
      });
      
      const broadcastData = await broadcastRes.json();
      if (!broadcastRes.ok) throw new Error(broadcastData.error || 'Broadcast failed');

      // Wait a moment for transaction to land on-chain before finalizing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store signature and mint address for display
      setTxSignature(broadcastData.signature);
      setMintAddressState(data.mintAddress);

      await finalize(broadcastData.signature, data.mintAddress);
    } catch (err: any) {
      setError(err.message || 'Minting failed');
      setMintStatus('idle');
    }
  };

  const finalize = async (txHash: string, mintAddress: string) => {
    try {
      const res = await fetch(`https://api.saidprotocol.com/api/passport/${agentWallet}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, mintAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Finalize failed');

      setMintStatus('complete');
      setStep(3);
    } catch (err: any) {
      setError('Passport minted but failed to record. TX: ' + txHash);
      setMintStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AsciiBackground />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 w-full relative z-10">
        <div className="text-center mb-8">
          <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Soulbound Identity</p>
          <h1 className="text-4xl font-bold mb-4">Mint Agent Passport</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Issue a Token-2022 non-transferable passport to bind an agent identity to a wallet owner and make verification portable across ecosystems.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center gap-8 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-zinc-600'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${step >= 1 ? 'border-white bg-white text-black' : 'border-zinc-600'}`}>
              1
            </div>
            <span className="text-sm font-medium">Lookup Agent</span>
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-zinc-600'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${step >= 2 ? 'border-white bg-white text-black' : 'border-zinc-600'}`}>
              2
            </div>
            <span className="text-sm font-medium">Connect & Mint</span>
          </div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-white' : 'text-zinc-600'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${step >= 3 ? 'border-white bg-white text-black' : 'border-zinc-600'}`}>
              3
            </div>
            <span className="text-sm font-medium">Verify On-Chain</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Mint Control */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Passport Mint Control</h2>
            
            <div className="mb-6">
              <label className="block text-sm text-zinc-400 mb-2 uppercase tracking-wide">Agent Public Key</label>
              <input
                type="text"
                placeholder="Paste the agent public key"
                value={agentWallet}
                onChange={(e) => setAgentWallet(e.target.value)}
                disabled={step > 1}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 disabled:opacity-50 font-mono text-sm"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <button
                onClick={lookupAgent}
                disabled={loading}
                className="w-full px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {loading ? 'Looking up...' : 'Lookup Agent'}
              </button>
            )}

            {step === 2 && (
              <button
                onClick={mintPassport}
                disabled={mintStatus !== 'idle'}
                className="w-full px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {mintStatus === 'idle' && 'Mint On-Chain'}
                {mintStatus === 'connecting' && 'Connecting wallet...'}
                {mintStatus === 'building' && 'Building transaction...'}
                {mintStatus === 'signing' && 'Sign in wallet...'}
                {mintStatus === 'confirming' && 'Confirming...'}
              </button>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white font-semibold mb-2">Passport Minted!</p>
                <p className="text-sm text-zinc-400">Your on-chain identity is now permanent and portable.</p>
              </div>
            )}

            {step === 1 && (
              <div className="mt-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-400">
                <p className="font-semibold text-white mb-2">Flow:</p>
                <p>Sign issue challenge → Sign Token-2022 mint transaction → Sign finalize challenge → Verify on-chain state.</p>
              </div>
            )}
          </div>

          {/* Right: Passport State */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Passport State</h2>
            
            {!agent && (
              <div className="text-center py-12 text-zinc-500">
                Enter an agent wallet to view passport state
              </div>
            )}

            {agent && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Status</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    {step === 3 ? (
                      <>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Minted
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Not Minted
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Owner</p>
                  <p className="text-white font-mono text-sm">{agentWallet.slice(0,8)}...{agentWallet.slice(-8)}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Agent Name</p>
                  <p className="text-white">{agent.identity?.name || agent.name || 'Unknown'}</p>
                </div>

                {step === 3 && (
                  <>
                    {txSignature && (
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Transaction Signature</p>
                        <a
                          href={`https://solscan.io/tx/${txSignature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-mono break-all"
                        >
                          {txSignature.slice(0, 20)}...{txSignature.slice(-8)} ↗
                        </a>
                      </div>
                    )}

                    {(mintAddressState || agent.passportMint) && (
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Mint Address</p>
                        <a
                          href={`https://solscan.io/token/${mintAddressState || agent.passportMint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-mono"
                        >
                          {(mintAddressState || agent.passportMint).slice(0, 8)}...{(mintAddressState || agent.passportMint).slice(-8)} ↗
                        </a>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Metadata</p>
                      <a
                        href={`https://api.saidprotocol.com/api/passport/${agentWallet}/metadata`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Metadata ↗
                      </a>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Explorer</p>
                      <a
                        href={`https://explorer.solana.com/address/${mintAddressState || agent.passportMint}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View on Solana Explorer ↗
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
