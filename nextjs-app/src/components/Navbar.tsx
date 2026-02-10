'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitial = () => {
    if (user?.email?.address) return user.email.address[0].toUpperCase();
    if (user?.wallet?.address) return user.wallet.address[0].toUpperCase();
    return 'U';
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-zinc-800">
      <Link href="/" className="text-xl font-bold">
        SAID
      </Link>
      
      <div className="flex items-center gap-6">
        <Link href="/agents" className="text-zinc-400 hover:text-white transition">
          Directory
        </Link>
        <Link href="https://github.com/kaiclawd/said" target="_blank" className="text-zinc-400 hover:text-white transition">
          GitHub
        </Link>
        
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
