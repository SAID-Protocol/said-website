'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';

type Step = 'choose' | 'register' | 'create' | 'success';

export default function CreateAgentPage() {
  const { authenticated, login, ready } = usePrivy();
  const { sessionToken, privyAccessToken } = useAuth();
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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const generateWallet = async () => {
    if (!privyAccessToken) return;
    try {
      setLoading(true);
      const privyToken = await privyAccessToken();
      // We'll create the wallet + agent together on submit
      // For now just set a flag that we want a new custodial wallet
      setWallet('new');
    } catch (err) {
      console.error('Failed to prepare wallet:', err);
    } finally {
      setLoading(false);
    }
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
      let agentWallet = wallet || generatedWallet?.publicKey;
      let platformAgentId: string | null = null;

      // If generating a new custodial wallet, create via Platform API first
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
        platformAgentId = createData.agentId;
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
          capabilities: skills.split(',').map(s => s.trim()).filter(Boolean)
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
      
      // Try to fetch API key for this agent
      if (sessionToken && agentWallet) {
        try {
          // Get user's agents from platform API
          const agentsRes = await fetch('https://api.saidprotocol.com/api/agents', {
            headers: { 'Authorization': `Bearer ${sessionToken}` },
          });
          if (agentsRes.ok) {
            const agents = await agentsRes.json();
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

  const goBack = () => {
    if (step === 'register' || step === 'create') setStep('choose');
  };

  const finalWallet = wallet || generatedWallet?.publicKey || '';

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-8 pt-28 sm:pt-32 pb-12">
        
        {/* Step 1: Choose Registration Type */}
        {step === 'choose' && (
          <>
            <h1 className="text-3xl font-bold mb-2">Register Your Agent</h1>
            <p className="text-zinc-400 mb-8">Add your AI agent to the SAID Protocol registry</p>
            
            <div className="grid gap-4">
              <button
                onClick={() => { if (!authenticated) { login(); return; } setStep('register'); }}
                className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-left hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group"
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
                onClick={() => { if (!authenticated) { login(); return; } setStep('create'); generateWallet(); }}
                className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-left hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 font-mono text-sm"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your agent do?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Skills <span className="text-zinc-500 font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="trading, research, coding"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
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
            <p className="text-zinc-400 mb-6">A custodial Solana wallet will be created for your agent</p>

            <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg mb-6">
              <p className="text-sm text-zinc-300">
                <strong className="text-zinc-300">Custodial wallet:</strong> We securely manage your agent's wallet. You'll get an API key to control it — no private keys to manage.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium mb-2">Agent Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Agent"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your agent do?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Skills <span className="text-zinc-500 font-normal">(comma-separated)</span></label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="trading, research, coding"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !name}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : authenticated ? 'Create Agent' : 'Log In to Continue'}
              </button>
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
            <div className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mb-6">
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
                    <code className="block p-3 bg-zinc-950 rounded text-sm font-mono text-green-400 overflow-x-auto">
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
            
            {/* API Key for SeekerClaw integration */}
            {apiKey && (
              <div className="p-5 bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-xl mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-zinc-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                  Your API Key
                </h3>
                <p className="text-zinc-400 text-sm mb-3">Copy this key into the SeekerClaw app to connect your agent.</p>
                <div className="flex gap-2">
                  <code className="flex-1 p-3 bg-zinc-950 rounded text-sm font-mono text-zinc-300 overflow-x-auto">
                    {apiKey}
                  </code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(apiKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000); }}
                    className="px-4 py-2 bg-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-600 transition"
                  >
                    {copiedKey ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

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
    </div>
  );
}
