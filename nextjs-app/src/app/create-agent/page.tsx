'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Step = 'choose' | 'register' | 'create' | 'success';

export default function CreateAgentPage() {
  const { authenticated, login } = usePrivy();
  const { sessionToken } = useAuth();
  const [step, setStep] = useState<Step>('choose');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [wallet, setWallet] = useState('');
  const [skills, setSkills] = useState('');
  const [generatedWallet, setGeneratedWallet] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletDownloaded, setWalletDownloaded] = useState(false);

  const generateWallet = async () => {
    const { Keypair } = await import('@solana/web3.js');
    const keypair = Keypair.generate();
    const secretKeyBase64 = Buffer.from(keypair.secretKey).toString('base64');
    const walletData = {
      publicKey: keypair.publicKey.toBase58(),
      secretKey: secretKeyBase64
    };
    setGeneratedWallet(walletData);
    setWallet(walletData.publicKey);
  };

  const downloadWallet = () => {
    if (!generatedWallet) return;
    
    // Create wallet.json in the format the CLI expects
    const walletJson = JSON.stringify([...Buffer.from(generatedWallet.secretKey, 'base64')], null, 2);
    const blob = new Blob([walletJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wallet.json';
    a.click();
    URL.revokeObjectURL(url);
    setWalletDownloaded(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      login();
      return;
    }
    
    setLoading(true);
    
    try {
      const agentWallet = wallet || generatedWallet?.publicKey;
      
      const res = await fetch('https://api.saidprotocol.com/api/register/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          twitter,
          website,
          wallet: agentWallet,
          skills: skills.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      
      if (!res.ok) throw new Error('Registration failed');
      
      // Link agent to user's account
      if (sessionToken && agentWallet) {
        await fetch('https://api.saidprotocol.com/users/me/agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ agentWallet })
        });
      }
      
      setStep('success');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'register' || step === 'create') setStep('choose');
  };

  const finalWallet = wallet || generatedWallet?.publicKey || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-xl mx-auto w-full px-8 py-12">
        
        {/* Step 1: Choose Registration Type */}
        {step === 'choose' && (
          <>
            <h1 className="text-3xl font-bold mb-2">Register Your Agent</h1>
            <p className="text-zinc-400 mb-8">Add your AI agent to the SAID Protocol registry</p>
            
            <div className="grid gap-4">
              <button
                onClick={() => setStep('register')}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-zinc-600 transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-500 transition">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">I Have a Wallet</h3>
                    <p className="text-zinc-400 text-sm">Register an existing Solana wallet as your agent's identity</p>
                  </div>
                  <svg className="text-zinc-600 group-hover:text-zinc-400 transition mt-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </button>
              
              <button
                onClick={() => { setStep('create'); generateWallet(); }}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-zinc-600 transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-500 transition">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Generate New Wallet</h3>
                    <p className="text-zinc-400 text-sm">Create a fresh Solana wallet for your new agent</p>
                  </div>
                  <svg className="text-zinc-600 group-hover:text-zinc-400 transition mt-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400 text-sm">
                <strong className="text-zinc-300">What happens next?</strong> After pre-registering here, you'll use the CLI to go on-chain and optionally get verified.
              </p>
            </div>
          </>
        )}

        {/* Step 2a: Register Existing Wallet */}
        {step === 'register' && (
          <>
            <button onClick={goBack} className="text-zinc-400 hover:text-white mb-4 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Register Existing Wallet</h1>
            <p className="text-zinc-400 mb-8">Enter your agent's details</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium mb-2">Wallet Address *</label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="So1ana..."
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600 font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Agent Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Agent"
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your agent do?"
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Skills <span className="text-zinc-500 font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="trading, research, coding"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Twitter</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@youragent"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !name || !wallet}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : authenticated ? 'Pre-Register Agent' : 'Log In to Continue'}
              </button>
            </form>
          </>
        )}
        
        {/* Step 2b: Generate New Wallet */}
        {step === 'create' && (
          <>
            <button onClick={goBack} className="text-zinc-400 hover:text-white mb-4 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2">New Agent Wallet</h1>
            <p className="text-zinc-400 mb-6">We've generated a Solana wallet for your agent</p>
            
            {generatedWallet && (
              <>
                {/* Wallet Info */}
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Public Address</span>
                    <code className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded">
                      {generatedWallet.publicKey.slice(0, 8)}...{generatedWallet.publicKey.slice(-8)}
                    </code>
                  </div>
                </div>
                
                {/* Download Wallet Warning */}
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-6">
                  <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Download Your Wallet!
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3">
                    You'll need this file to register on-chain via CLI. We don't store private keys.
                  </p>
                  <button
                    onClick={downloadWallet}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                      walletDownloaded 
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                        : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    {walletDownloaded ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        wallet.json Downloaded
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download wallet.json
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium mb-2">Agent Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Agent"
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your agent do?"
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Skills <span className="text-zinc-500 font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="trading, research, coding"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Twitter</label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@youragent"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !name || !walletDownloaded}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : !walletDownloaded ? 'Download Wallet First' : authenticated ? 'Pre-Register Agent' : 'Log In to Continue'}
              </button>
              
              {!walletDownloaded && (
                <p className="text-center text-zinc-500 text-sm">
                  You must download your wallet before continuing
                </p>
              )}
            </form>
          </>
        )}
        
        {/* Step 3: Success + CLI Instructions */}
        {step === 'success' && (
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-center">Agent Pre-Registered!</h1>
            <p className="text-zinc-400 mb-8 text-center">Your agent is pending. Complete the steps below to go on-chain.</p>
            
            {/* CLI Instructions */}
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5"/>
                  <line x1="12" y1="19" x2="20" y2="19"/>
                </svg>
                Next: Register On-Chain via CLI
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 text-sm">1. Fund your wallet (~0.01 SOL)</span>
                    <button 
                      onClick={() => copyToClipboard(finalWallet)}
                      className="text-xs text-zinc-500 hover:text-white transition"
                    >
                      Copy address
                    </button>
                  </div>
                  <code className="block p-3 bg-zinc-950 rounded text-sm font-mono text-zinc-300 overflow-x-auto">
                    {finalWallet}
                  </code>
                </div>
                
                <div>
                  <span className="text-zinc-400 text-sm mb-2 block">2. Register on Solana</span>
                  <div className="relative">
                    <code className="block p-3 bg-zinc-950 rounded text-sm font-mono text-green-400 overflow-x-auto">
                      npx said register -k wallet.json
                    </code>
                    <button 
                      onClick={() => copyToClipboard('npx said register -k wallet.json')}
                      className="absolute right-2 top-2 p-1.5 text-zinc-500 hover:text-white transition"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div>
                  <span className="text-zinc-400 text-sm mb-2 block">3. Get verified (optional, 0.01 SOL)</span>
                  <div className="relative">
                    <code className="block p-3 bg-zinc-950 rounded text-sm font-mono text-blue-400 overflow-x-auto">
                      npx said verify -k wallet.json
                    </code>
                    <button 
                      onClick={() => copyToClipboard('npx said verify -k wallet.json')}
                      className="absolute right-2 top-2 p-1.5 text-zinc-500 hover:text-white transition"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/docs"
                className="flex-1 py-3 border border-zinc-700 rounded-lg font-medium hover:border-zinc-500 transition text-center"
              >
                View Docs
              </Link>
              <Link
                href="/my-agents"
                className="flex-1 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition text-center"
              >
                My Agents
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
