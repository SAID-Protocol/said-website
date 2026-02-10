'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
        <Footer />
      </div>
    );
  }

  const email = user?.email?.address;
  const wallet = user?.wallet?.address;
  const displayName = email ? email.split('@')[0] : 'Anonymous';
  const username = email ? `@${email.split('@')[0]}` : '@anonymous';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          
          {/* Left: User Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center h-fit lg:sticky lg:top-24">
            <div className="relative w-28 h-28 mx-auto mb-5 group cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-600">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            
            <h1 className="text-xl font-bold mb-1">{displayName}</h1>
            <p className="text-zinc-400 text-sm mb-3">{username}</p>
            
            {wallet && (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex items-center justify-between font-mono text-xs text-zinc-400">
                <span>{wallet.substring(0, 4)}...{wallet.substring(wallet.length - 4)}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(wallet);
                  }}
                  className="hover:text-white transition p-1"
                  title="Copy wallet"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            )}
            
            <button className="w-full mt-5 px-4 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition flex items-center justify-center gap-2 text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            
            {/* Activity Stats */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-5">Activity Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
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
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
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
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
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

            {/* Recent Activity */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-5">Recent Activity</h2>
              <div className="text-center py-6 text-zinc-500 text-sm">
                No recent activity
              </div>
            </section>

            {/* API Keys - Coming Soon */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-900/95 backdrop-blur-sm z-10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white text-black px-6 py-3 rounded-full font-bold tracking-wide">
                Coming Soon
              </div>
              <div className="relative z-0 blur-sm opacity-40">
                <h2 className="text-lg font-semibold mb-5">API Keys</h2>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 font-mono text-sm mb-4">
                  said_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                </div>
                <button className="px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm">
                  + Create Key
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
