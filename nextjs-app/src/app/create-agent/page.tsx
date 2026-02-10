'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Step = 'choose' | 'register' | 'create' | 'success';

export default function CreateAgentPage() {
  const { authenticated, login } = usePrivy();
  const [step, setStep] = useState<Step>('choose');
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
    
    // Convert secretKey to base64
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      login();
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('https://api.saidprotocol.com/api/agents/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          twitter,
          website,
          wallet: wallet || generatedWallet?.publicKey
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-xl mx-auto w-full px-8 py-12">
        {/* Choose Step */}
        {step === 'choose' && (
          <>
            <h1 className="text-3xl font-bold mb-2">Get Started with SAID</h1>
            <p className="text-zinc-400 mb-8">Register your agent on the Solana identity registry</p>
            
            <div className="grid gap-4">
              <button
                onClick={() => setStep('register')}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-zinc-600 transition"
              >
                <h3 className="text-lg font-semibold mb-1">🔗 Register Existing Agent</h3>
                <p className="text-zinc-400 text-sm">I already have a Solana wallet for my agent</p>
              </button>
              
              <button
                onClick={() => { setStep('create'); generateWallet(); }}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-zinc-600 transition"
              >
                <h3 className="text-lg font-semibold mb-1">✨ Create New Agent</h3>
                <p className="text-zinc-400 text-sm">Generate a new wallet and register a fresh agent</p>
              </button>
            </div>
          </>
        )}
        
        {/* Register Existing Agent */}
        {step === 'register' && (
          <>
            <button onClick={() => setStep('choose')} className="text-zinc-400 hover:text-white mb-4">
              ← Back
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
        
        {/* Create New Agent */}
        {step === 'create' && (
          <>
            <button onClick={() => setStep('choose')} className="text-zinc-400 hover:text-white mb-4">
              ← Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Create New Agent</h1>
            <p className="text-zinc-400 mb-8">We've generated a wallet for your agent</p>
            
            {generatedWallet && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-6">
                <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Save Your Private Key!</h4>
                <p className="text-sm text-zinc-400 mb-3">This will only be shown once. We don't store it.</p>
                
                {!showPrivateKey ? (
                  <button
                    onClick={() => setShowPrivateKey(true)}
                    className="w-full py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
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
                      className="text-sm text-yellow-400 hover:underline flex items-center gap-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-2">Wallet Address</label>
                <div className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg font-mono text-sm">
                  {generatedWallet?.publicKey || 'Generating...'}
                </div>
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
                <label className="block font-medium mb-2">Twitter Handle</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@youragent"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !name || !generatedWallet}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : authenticated ? 'Create & Register Agent' : 'Log In to Register'}
              </button>
            </form>
          </>
        )}
        
        {/* Success */}
        {step === 'success' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Agent Registered!</h1>
            <p className="text-zinc-400 mb-8">Your agent is now on SAID Protocol</p>
            <div className="flex gap-4 justify-center">
              <Link href="/agents" className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition">
                View Directory
              </Link>
              <Link href="/my-agents" className="px-6 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition">
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
