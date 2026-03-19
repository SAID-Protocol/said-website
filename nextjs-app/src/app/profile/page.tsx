'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import HostNavbar from '@/components/HostNavbar';
import AsciiBackground from '@/components/AsciiBackground';
import HostFooter from '@/components/HostFooter';
import { useAuth } from '@/hooks/useAuth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { useFundWallet } from '@privy-io/react-auth/solana';

export default function ProfilePage() {
  const { authenticated, user, login } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const { fundWallet } = useFundWallet();
  const { sessionToken } = useAuth();
  const [agentCount, setAgentCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(0);
  const [memberSince, setMemberSince] = useState('');
  const [loading, setLoading] = useState(true);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<string | null>(null);

  const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

  const fetchBalances = useCallback(async (address: string) => {
    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com';
    try {
      // Fetch USDC balance
      const tokenRes = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'getTokenAccountsByOwner',
          params: [address, { mint: USDC_MINT }, { encoding: 'jsonParsed' }],
        }),
      });
      const tokenData = await tokenRes.json();
      const accounts = tokenData?.result?.value;
      setUsdcBalance(accounts?.length > 0
        ? accounts[0].account.data.parsed.info.tokenAmount.uiAmount.toFixed(2)
        : '0.00');

      // Fetch SOL balance
      const solRes = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 2,
          method: 'getBalance',
          params: [address],
        }),
      });
      const solData = await solRes.json();
      setSolBalance(solData?.result?.value != null
        ? (solData.result.value / 1e9).toFixed(4)
        : '0.0000');
    } catch {
      setUsdcBalance(null);
      setSolBalance(null);
    }
  }, []);

  useEffect(() => {
    const embedded = solanaWallets.find(w => w.walletClientType === 'privy');
    if (embedded?.address) {
      fetchBalances(embedded.address);
      const interval = setInterval(() => fetchBalances(embedded.address), 30000);
      return () => clearInterval(interval);
    }
  }, [solanaWallets, fetchBalances]);
  
  // Profile data from database
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Profile picture
  const fileInputRef = useRef<HTMLInputElement>(null);

  const email = user?.email?.address;

  useEffect(() => {
    if (sessionToken) {
      loadProfileData();
    } else {
      setLoading(false);
    }
  }, [sessionToken]);

  const loadProfileData = async () => {
    await Promise.all([fetchUserProfile(), fetchAgentStats()]);
    setLoading(false);
  };

  const fetchUserProfile = async () => {
    if (!sessionToken) return;
    
    try {
      const res = await fetch('https://api.saidprotocol.com/auth/me', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        // Use database values, or fall back to email-derived defaults
        setDisplayName(user.displayName || email?.split('@')[0] || 'Anonymous');
        setUsername(user.username || email?.split('@')[0] || 'anonymous');
        setAvatarUrl(user.avatarUrl || '');
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      // Fall back to email-derived defaults
      setDisplayName(email?.split('@')[0] || 'Anonymous');
      setUsername(email?.split('@')[0] || 'anonymous');
    }
  };

  const fetchAgentStats = async () => {
    if (!sessionToken) return;
    
    try {
      const res = await fetch('https://api.saidprotocol.com/users/me/agents', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        const agents = data.agents || [];
        setAgentCount(agents.length);
        setVerifiedCount(agents.filter((a: any) => a.isVerified).length);
        
        if (agents.length > 0) {
          const oldest = agents.reduce((oldest: any, current: any) => {
            return new Date(current.registeredAt) < new Date(oldest.registeredAt) ? current : oldest;
          });
          const date = new Date(oldest.registeredAt);
          setMemberSince(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch agent stats:', err);
    }
  };

  const handleEditClick = () => {
    setEditDisplayName(displayName);
    setEditUsername(username);
    setIsEditing(true);
  };

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async () => {
    if (!sessionToken) {
      alert('Session expired. Please refresh and try again.');
      return;
    }
    
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('https://api.saidprotocol.com/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          displayName: editDisplayName,
          username: editUsername,
        }),
      });
      
      const data = await res.json();
      console.log('Profile save response:', data);
      
      if (res.ok) {
        // Update local state with new values
        setDisplayName(data.user?.displayName || editDisplayName);
        setUsername(data.user?.username || editUsername);
        setSaveSuccess(true);
        // Close modal after showing success
        setTimeout(() => {
          setIsEditing(false);
          setSaveSuccess(false);
        }, 1000);
      } else {
        console.error('Profile save failed:', data);
        if (data.error?.includes('username')) {
          alert('Username already taken. Please choose another.');
        } else if (data.error?.includes('Unique constraint')) {
          alert('Username already taken. Please choose another.');
        } else {
          alert(data.error || 'Failed to update profile');
        }
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionToken) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 500000) { // 500KB max
      alert('Image too large. Please select an image under 500KB.');
      return;
    }
    
    setUploadingAvatar(true);
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        
        // Upload to API
        const res = await fetch('https://api.saidprotocol.com/auth/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ avatarUrl: base64 }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setAvatarUrl(data.user.avatarUrl || base64);
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to upload avatar');
        }
        setUploadingAvatar(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      alert('Failed to upload avatar');
      setUploadingAvatar(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <HostNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-8">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
            <button
              onClick={login}
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              Log In
            </button>
          </div>
        </div>
        <HostFooter />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <HostNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400">Loading profile...</p>
          </div>
        </div>
        <HostFooter />
      </div>
    );
  }

  return (
    <>
      <HostNavbar />
      <AsciiBackground />
      <div className="relative z-10 min-h-screen flex flex-col pt-24">
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          
          {/* Left: User Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 text-center h-fit lg:sticky lg:top-24">
            {/* Avatar with hover edit */}
            <div 
              className="relative w-28 h-28 mx-auto mb-5 group cursor-pointer"
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-full object-cover border-2 border-zinc-600"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-600">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <h1 className="text-xl font-bold mb-1">{displayName}</h1>
            <p className="text-zinc-400 text-sm">@{username}</p>
            
            <button 
              onClick={handleEditClick}
              className="w-full mt-5 px-4 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition flex items-center justify-center gap-2 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Right: Content */}
          <div className="space-y-4">
            
            {/* Activity Stats */}
            <section className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">Activity Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{loading ? '-' : agentCount}</div>
                    <div className="text-xs text-zinc-400">Agents Created</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{feedbackGiven}</div>
                    <div className="text-xs text-zinc-400">Feedback Given</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold">{memberSince || 'Feb 2026'}</div>
                    <div className="text-xs text-zinc-400">Member Since</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Deposit Wallet */}
            {(() => {
              const embeddedWallet = solanaWallets.find(w => w.walletClientType === 'privy');
              if (!embeddedWallet?.address) return null;
              return (
                <section className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Deposit Wallet</h2>
                    <button
                      onClick={async () => {
                        try {
                          await fundWallet(embeddedWallet.address, {
                            cluster: { name: 'mainnet-beta' },
                            defaultFundingMethod: 'card',
                          });
                        } catch (err) {
                          console.error('Funding failed:', err);
                        }
                      }}
                      className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition"
                    >
                      + Add Funds
                    </button>
                  </div>

                  {/* Balances */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">USDC Balance</p>
                      <p className="text-xl font-bold text-white">${usdcBalance ?? '—'}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">SOL Balance</p>
                      <p className="text-xl font-bold text-white">{solBalance ?? '—'} <span className="text-sm font-normal text-zinc-500">SOL</span></p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5">Deposit Address (Solana)</p>
                    <div className="flex items-center gap-2">
                      <code className="text-[13px] text-zinc-300 font-mono break-all leading-relaxed">{embeddedWallet.address}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(embeddedWallet.address);
                          const btn = document.getElementById('copy-profile-wallet');
                          if (btn) { btn.textContent = '✓'; setTimeout(() => { btn.textContent = 'Copy'; }, 1500); }
                        }}
                        id="copy-profile-wallet"
                        className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 text-[12px] text-zinc-500">
                    <svg className="w-4 h-4 shrink-0 mt-0.5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <span>Send <strong className="text-zinc-400">USDC</strong> on Solana to this address to fund your hosting account. Deposits are credited automatically.</span>
                  </div>
                </section>
              );
            })()}
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500"
                  placeholder="Your display name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Username</label>
                <div className="flex">
                  <span className="px-4 py-3 bg-zinc-800 border border-r-0 border-zinc-700 rounded-l-lg text-zinc-500">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-r-lg focus:outline-none focus:border-zinc-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-3 border border-zinc-700 rounded-lg font-medium hover:border-zinc-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving || saveSuccess}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 ${
                  saveSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Saved
                  </>
                ) : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <HostFooter />
      </div>
    </>
  );
}
