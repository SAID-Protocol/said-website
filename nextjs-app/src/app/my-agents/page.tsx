'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function MyAgentsPage() {
  const { authenticated, user, login } = usePrivy();

  if (!authenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-xl mx-auto px-8 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your agents</h1>
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

  // TODO: Fetch user's agents from API based on their wallet/email
  const agents: any[] = [];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Agents</h1>
          <Link
            href="/create-agent"
            className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
          >
            + Create Agent
          </Link>
        </div>
        
        {agents.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
            <p className="text-zinc-400 mb-6">Register your first agent to get started</p>
            <Link
              href="/create-agent"
              className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              Create Agent
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <div
                key={agent.wallet}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {agent.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-zinc-500 font-mono text-sm">
                        {agent.wallet.substring(0, 8)}...{agent.wallet.substring(agent.wallet.length - 8)}
                      </p>
                    </div>
                  </div>
                  {agent.isVerified && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
