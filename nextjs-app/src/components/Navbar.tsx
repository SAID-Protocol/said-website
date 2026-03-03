'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();
  const { sessionToken } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    if (authenticated && sessionToken) {
      fetchUserProfile();
    }
  }, [authenticated, sessionToken]);

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
        setAvatarUrl(data.user?.avatarUrl || '');
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-950/95 backdrop-blur-sm z-50">
      {/* Left side: Logo + Nav Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-dark.png"
            alt="SAID"
            width={32}
            height={32}
            className="dark-logo"
            style={{ display: theme === 'dark' ? 'block' : 'none' }}
          />
          <Image
            src="/logo.png"
            alt="SAID"
            width={32}
            height={32}
            className="light-logo"
            style={{ display: theme === 'light' ? 'block' : 'none' }}
          />
          <span className="text-xl font-bold">SAID</span>
        </Link>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/#for-agents" className="text-zinc-400 hover:text-white transition">
            For Agents
          </Link>
          <Link href="/#quickstart" className="text-zinc-400 hover:text-white transition">
            Quick Start
          </Link>
          <Link href="/#features" className="text-zinc-400 hover:text-white transition">
            Features
          </Link>
          <Link href="/agents" className="text-zinc-400 hover:text-white transition">
            Directory
          </Link>
          <Link href="/token" className="text-zinc-400 hover:text-white transition">
            $SAID
          </Link>
        </div>
      </div>
      
      {/* Right side: Icons + Theme toggle + Auth */}
      <div className="flex items-center gap-4">
        {/* Docs Icon */}
        <Link href="/docs" className="p-2 text-zinc-400 hover:text-white transition" aria-label="Docs">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </Link>

        {/* Twitter/X Icon */}
        <a href="https://x.com/saidinfra" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-white transition" aria-label="X (Twitter)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        {/* Discord Icon */}
        <a href="https://discord.gg/saidprotocol" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-white transition" aria-label="Discord">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-400 hover:text-white transition"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>
        
        {authenticated ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-3 hover:bg-zinc-800 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/my-agents"
                  className="block px-4 py-3 hover:bg-zinc-800 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  My Agents
                </Link>
                <hr className="border-zinc-800" />
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-red-400 hover:bg-zinc-800 transition"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={login}
            className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  );
}
