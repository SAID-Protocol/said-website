'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Step = 'framework' | 'choose' | 'register' | 'create' | 'success';

interface Framework {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  docsUrl: string;
  comingSoon?: boolean;
}

const frameworks: Framework[] = [
  {
    id: 'nanobot',
    name: 'Nanobot',
    description: 'Lightweight TypeScript agent framework with built-in SAID support',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
        <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83m-2.83-14.14 2.83 2.83M4.93 19.07l2.83-2.83"/>
      </svg>
    ),
    docsUrl: 'https://docs.saidprotocol.com/frameworks/nanobot'
  },
  {
    id: 'openclawd',
    name: 'OpenClawd',
    description: 'Full-featured agent platform with MCP and A2A protocol support',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    docsUrl: 'https://docs.saidprotocol.com/frameworks/openclawd'
  },
  {
    id: 'eliza',
    name: 'Eliza OS',
    description: 'Multi-agent simulation framework for autonomous AI characters',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 8V4H8"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/>
        <path d="M20 14h2"/>
        <path d="M15 13v2"/>
        <path d="M9 13v2"/>
      </svg>
    ),
    docsUrl: 'https://elizaos.github.io/eliza/'
  },
  {
    id: 'agentkit',
    name: 'AgentKit',
    description: 'Coinbase\'s toolkit for building AI agents with crypto capabilities',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12"/>
        <path d="M8 10h8"/>
        <path d="M8 14h8"/>
      </svg>
    ),
    docsUrl: 'https://docs.cdp.coinbase.com/agentkit'
  },
  {
    id: 'secret',
    name: 'Secret Network',
    description: 'Privacy-preserving agents with confidential computing',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1"/>
      </svg>
    ),
    docsUrl: 'https://docs.scrt.network/',
    comingSoon: true
  }
];

export default function CreateAgentPage() {
  const { authenticated, login } = usePrivy();
  const [step, setStep] = useState<Step>('framework');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [wallet, setWallet] = useState('');
  const [generatedWallet, setGeneratedWallet] = useState<{ publicKey: string; secretKey: string } | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyPrivateKey = () => {
    if (generatedWallet) {
      navigator.clipboard.writeText(generatedWallet.secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectFramework = (fw: Framework) => {
    if (fw.comingSoon) return;
    setSelectedFramework(fw);
    setStep('choose');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      login();
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('https://api.saidprotocol.com/api/register/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          twitter,
          website,
          wallet: wallet || generatedWallet?.publicKey,
          framework: selectedFramework?.id
        })
      });
      
      if (!res.ok) throw new Error('Registration failed');
      
      setStep('success');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'choose') setStep('framework');
    else if (step === 'register' || step === 'create') setStep('choose');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-2xl mx-auto w-full px-8 py-12">
        
        {/* Step 1: Choose Framework */}
        {step === 'framework' && (
          <>
            <h1 className="text-3xl font-bold mb-2">Choose Your Framework</h1>
            <p className="text-zinc-400 mb-8">Select the agent framework you're building with</p>
            
            <div className="grid gap-4">
              {frameworks.map(fw => (
                <button
                  key={fw.id}
                  onClick={() => selectFramework(fw)}
                  disabled={fw.comingSoon}
                  className={`p-5 bg-zinc-900 border rounded-xl text-left transition group relative ${
                    fw.comingSoon 
                      ? 'border-zinc-800 opacity-60 cursor-not-allowed' 
                      : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 ${!fw.comingSoon && 'group-hover:border-zinc-500'} transition`}>
                      {fw.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{fw.name}</h3>
                        {fw.comingSoon && (
                          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full">Coming Soon</span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm">{fw.description}</p>
                    </div>
                    {!fw.comingSoon && (
                      <svg className="text-zinc-600 group-hover:text-zinc-400 transition" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-center text-zinc-500 text-sm mt-8">
              Not sure? Start with <button onClick={() => selectFramework(frameworks[0])} className="text-white hover:underline">Nanobot</button> — it's the easiest to get started.
            </p>
          </>
        )}

        {/* Step 2: Choose Registration Type */}
        {step === 'choose' && (
          <>
            <button onClick={goBack} className="text-zinc-400 hover:text-white mb-4 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                {selectedFramework?.icon}
              </div>
              <span className="text-zinc-400">{selectedFramework?.name}</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Register Your Agent</h1>
            <p className="text-zinc-400 mb-8">Create a new agent wallet or register an existing one</p>
            
            <div className="grid gap-4">
              <button
                onClick={() => setStep('register')}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-zinc-600 transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-500 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Register Existing Agent</h3>
                    <p className="text-zinc-400 text-sm">I already have a Solana wallet for my agent</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => { setStep('create'); generateWallet(); }}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-zinc-600 transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-500 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Create New Agent</h3>
                    <p className="text-zinc-400 text-sm">Generate a new wallet and register a fresh agent</p>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
        
        {/* Step 3a: Register Existing Agent */}
        {step === 'register' && (
          <>
            <button onClick={goBack} className="text-zinc-400 hover:text-white mb-4 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Register Existing Agent</h1>
            <p className="text-zinc-400 mb-8">Enter your agent's wallet address and details</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label className="block font-medium mb-2">Wallet Address *</label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="So1ana..."
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600 font-mono"
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
                <label className="block font-medium mb-2">Twitter Handle</label>
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
                  placeholder="https://youragent.com"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !name || !wallet}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : authenticated ? 'Register Agent' : 'Log In to Register'}
              </button>
            </form>
          </>
        )}
        
        {/* Step 3b: Create New Agent */}
        {step === 'create' && (
          <>
            <button onClick={goBack} className="text-zinc-400 hover:text-white mb-4 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Create New Agent</h1>
            <p className="text-zinc-400 mb-8">We've generated a wallet for your agent</p>
            
            {generatedWallet && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-6">
                <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Save Your Private Key!
                </h4>
                <p className="text-sm text-zinc-400 mb-3">This will only be shown once. We don't store it.</p>
                
                {!showPrivateKey ? (
                  <button
                    onClick={() => setShowPrivateKey(true)}
                    className="w-full py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Click to Reveal Private Key
                  </button>
                ) : (
                  <div>
                    <div className="p-3 bg-zinc-900 rounded font-mono text-xs break-all mb-2 select-all">
                      {generatedWallet.secretKey}
                    </div>
                    <button
                      onClick={copyPrivateKey}
                      className="w-full py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                          Copy Private Key
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Public Address</span>
                <code className="text-sm font-mono">{generatedWallet?.publicKey.slice(0, 8)}...{generatedWallet?.publicKey.slice(-8)}</code>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label className="block font-medium mb-2">Twitter Handle</label>
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
                  placeholder="https://youragent.com"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !name}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : authenticated ? 'Register Agent' : 'Log In to Register'}
              </button>
            </form>
          </>
        )}
        
        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Agent Registered!</h1>
            <p className="text-zinc-400 mb-8">Your agent is now pending on SAID Protocol</p>
            
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg mb-6 text-left">
              <h4 className="font-semibold mb-3">Next Steps with {selectedFramework?.name}:</h4>
              <ol className="text-zinc-400 text-sm space-y-2 list-decimal list-inside">
                <li>Fund your agent wallet with ~0.01 SOL</li>
                <li>Run <code className="bg-zinc-800 px-1 rounded">npx said register -k wallet.json</code> to go on-chain</li>
                <li>Optionally verify with <code className="bg-zinc-800 px-1 rounded">npx said verify -k wallet.json</code></li>
              </ol>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link
                href={selectedFramework?.docsUrl || '/docs'}
                target="_blank"
                className="px-4 py-2 border border-zinc-700 rounded-lg font-medium hover:border-zinc-500 transition"
              >
                {selectedFramework?.name} Docs →
              </Link>
              <Link
                href="/my-agents"
                className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
              >
                View My Agents
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
