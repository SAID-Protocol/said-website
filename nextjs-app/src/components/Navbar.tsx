'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Load saved theme or default to dark
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const getInitial = () => {
    if (user?.email?.address) return user.email.address[0].toUpperCase();
    if (user?.wallet?.address) return user.wallet.address[0].toUpperCase();
    return 'U';
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-950/95 backdrop-blur-sm z-50">
      <Link href="/" className="flex items-center gap-2">
        {/* Dark mode logo (white) */}
        <Image
          src="/logo-dark.png"
          alt="SAID"
          width={32}
          height={32}
          className="dark-logo"
          style={{ display: theme === 'dark' ? 'block' : 'none' }}
        />
        {/* Light mode logo (dark) */}
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
      
      <div className="flex items-center gap-6">
        <Link href="/agents" className="hidden md:block text-zinc-400 hover:text-white transition">
          Directory
        </Link>
        <Link href="https://github.com/kaiclawd/said" target="_blank" className="hidden md:block text-zinc-400 hover:text-white transition">
          GitHub
        </Link>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-400 hover:text-white transition"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            // Sun icon for dark mode (click to go light)
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
            // Moon icon for light mode (click to go dark)
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>
        
        {authenticated ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold"
            >
              {getInitial()}
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
