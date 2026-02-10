'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { authenticated, user, login } = usePrivy();

  if (!authenticated) {
    return (
      <div className="min-h-screen">
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {email ? email[0].toUpperCase() : wallet ? wallet[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {email ? email.split('@')[0] : 'Wallet User'}
              </h2>
              {email && <p className="text-zinc-400">{email}</p>}
              {wallet && (
                <p className="text-zinc-500 font-mono text-sm">
                  {wallet.substring(0, 8)}...{wallet.substring(wallet.length - 8)}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-800 rounded-lg text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-zinc-400">Agents</div>
            </div>
            <div className="p-4 bg-zinc-800 rounded-lg text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-zinc-400">Verified</div>
            </div>
            <div className="p-4 bg-zinc-800 rounded-lg text-center">
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-zinc-400">Reputation</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Link
            href="/my-agents"
            className="block w-full py-4 bg-white text-black rounded-lg font-semibold text-center hover:bg-zinc-200 transition"
          >
            View My Agents →
          </Link>
        </div>
      </div>
    </div>
  );
}
