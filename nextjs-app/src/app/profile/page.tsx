'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { authenticated, user, login } = usePrivy();
  const { sessionToken } = useAuth();
  const [agentCount, setAgentCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(0);
  const [memberSince, setMemberSince] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionToken) {
      fetchAgentStats();
    } else {
      setLoading(false);
    }
  }, [sessionToken]);

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
        
        // Set member since from first agent registration or current date
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
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <div className="max-w-xl mx-auto px-8 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <button
            onClick={login}
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const email = user?.email?.address;
  const wallet = user?.wallet?.address;
  const displayName = email ? email.split('@')[0] : 'Anonymous';
  const username = email ? `@${email.split('@')[0]}` : '@anonymous';

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* Left: User Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 text-center h-fit lg:sticky lg:top-24">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-[var(--border)]">
                {displayName[0].toUpperCase()}
              </div>
              <button 
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--bg)] border-2 border-[var(--bg)] flex items-center justify-center hover:scale-110 transition"
                title="Change avatar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
            
            <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
            <p className="text-[var(--text-secondary)] mb-2">{username}</p>
            
            {wallet && (
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 mt-4 flex items-center justify-between font-mono text-sm text-[var(--text-secondary)]">
                <span>{wallet.substring(0, 4)}...{wallet.substring(wallet.length - 4)}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(wallet);
                    alert('Wallet copied!');
                  }}
                  className="hover:text-[var(--text)] transition"
                  title="Copy wallet"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            )}
            
            <button className="w-full mt-6 px-4 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            
            {/* Activity Stats */}
            <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">Activity Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{loading ? '-' : agentCount}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Agents Created</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-xl">
                    💬
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{feedbackGiven}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Feedback Given</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-xl">
                    📅
                  </div>
                  <div>
                    <div className="text-lg font-bold">{memberSince || 'Feb 2026'}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Member Since</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No recent activity
              </div>
            </section>

            {/* API Keys - Coming Soon */}
            <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--bg-secondary)] backdrop-blur-sm z-10 opacity-95"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-[var(--accent)] text-[var(--bg)] px-8 py-4 rounded-full font-bold text-lg tracking-wide">
                Coming Soon
              </div>
              <div className="relative z-0 blur-sm opacity-40">
                <h2 className="text-xl font-bold mb-6">API Keys</h2>
                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 font-mono text-sm mb-4">
                  said_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                </div>
                <button className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-xl font-semibold">
                  + Create Key
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
