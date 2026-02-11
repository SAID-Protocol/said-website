'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-8 py-12">
        <div className="flex items-center gap-3 mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
          <h1 className="text-4xl font-bold">Documentation</h1>
        </div>
        <p className="text-xl text-zinc-400 mb-12">API reference and SDK guide for integrating with SAID Protocol.</p>

        {/* Creating an Agent */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">Creating an Agent</h2>
          <p className="text-zinc-300 mb-4">Get your AI agent registered on Solana in minutes. Two options:</p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Option A: Interactive Wizard (Recommended)</h3>
          <p className="text-zinc-400 mb-3">The fastest way to scaffold a new SAID-verified agent project:</p>
          <pre className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto text-zinc-900 dark:text-zinc-100">
            <code>npx create-said-agent my-agent</code>
          </pre>
          <p className="text-zinc-400 mb-2">This will:</p>
          <ul className="list-disc list-inside text-zinc-400 space-y-1 mb-6">
            <li>Create a new project directory</li>
            <li>Generate a Solana wallet for your agent</li>
            <li>Register your agent on SAID Protocol</li>
            <li>Set up a ready-to-run agent template</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Option B: Manual Setup</h3>
          <p className="text-zinc-400 mb-4">For existing projects or custom setups:</p>
          
          <h4 className="font-medium mt-4 mb-2">1. Install the CLI</h4>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>npm install -g said-sdk</code>
          </pre>

          <h4 className="font-medium mt-4 mb-2">2. Generate a Wallet</h4>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-2 overflow-x-auto">
            <code>said wallet generate -o ./wallet.json</code>
          </pre>
          <p className="text-zinc-500 text-sm mb-4">⚠️ Back up this file! Lose it = lose your identity forever.</p>

          <h4 className="font-medium mt-4 mb-2">3. Fund Your Wallet</h4>
          <p className="text-zinc-400 mb-2">Send ~0.01 SOL to your wallet address for registration fees:</p>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>said wallet show -k ./wallet.json</code>
          </pre>

          <h4 className="font-medium mt-4 mb-2">4. Register Your Agent</h4>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>{`said register \\
  -k ./wallet.json \\
  -n "My Agent Name" \\
  -d "Agent description" \\
  -t "@twitterhandle" \\
  -w "https://myagent.com"`}</code>
          </pre>

          <h4 className="font-medium mt-4 mb-2">5. Verify (Optional)</h4>
          <p className="text-zinc-400 mb-2">Verification costs 0.01 SOL and gives your agent a verified badge:</p>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>said verify -k ./wallet.json</code>
          </pre>

          <div className="bg-white dark:bg-zinc-900 border-l-4 border-zinc-900 dark:border-white rounded-r-lg p-4 mt-6">
            <p className="text-zinc-700 dark:text-zinc-300">
              <strong>🔒 Privacy Note:</strong> Your private key never leaves your machine. We only see your public wallet address. <a href="/security" className="text-zinc-900 dark:text-white underline">Learn more →</a>
            </p>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">Quick Start</h2>
          <p className="text-zinc-400 mb-4">Already registered? Here's how to integrate SAID into your code:</p>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Install the SDK</h3>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>npm install said-sdk</code>
          </pre>

          <h3 className="text-lg font-semibold mt-6 mb-3">Check if an Agent is Verified</h3>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>{`import { isVerified } from "said-sdk";

const verified = await isVerified("WALLET_ADDRESS");
console.log(verified); // true or false`}</code>
          </pre>

          <h3 className="text-lg font-semibold mt-6 mb-3">Get Full Agent Identity</h3>
          <pre className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>{`import { lookup } from "said-sdk";

const agent = await lookup("WALLET_ADDRESS");
console.log(agent);
// {
//   pubkey: "...",
//   owner: "...",
//   metadataUri: "...",
//   registeredAt: 1706745600,
//   isVerified: true,
//   verifiedAt: 1706745700
// }`}</code>
          </pre>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">API Reference</h2>
          <p className="text-zinc-400 mb-6">Base URL: <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-2 py-1 rounded">https://api.saidprotocol.com</code></p>

          <h3 className="text-lg font-semibold mt-6 mb-4">Verification & Trust</h3>
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-4 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
              <code className="text-sm">/api/verify/:wallet</code>
            </div>
            <div className="p-4">
              <p className="text-zinc-400 text-sm mb-3">Full identity verification. Returns identity, reputation, trust tier, and useful URLs.</p>
              <pre className="bg-zinc-50 dark:bg-zinc-950 rounded p-3 text-zinc-900 dark:text-zinc-100 text-sm overflow-x-auto">
                <code>curl https://api.saidprotocol.com/api/verify/WALLET_ADDRESS</code>
              </pre>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-4 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
              <code className="text-sm">/api/trust/:wallet</code>
            </div>
            <div className="p-4">
              <p className="text-zinc-400 text-sm mb-3">Minimal trust check. Returns just the trust tier for fast gating decisions.</p>
              <pre className="bg-zinc-50 dark:bg-zinc-950 rounded p-3 text-zinc-900 dark:text-zinc-100 text-sm overflow-x-auto">
                <code>curl https://api.saidprotocol.com/api/trust/WALLET_ADDRESS</code>
              </pre>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4">Agents</h3>
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-4 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
              <code className="text-sm">/api/agents</code>
            </div>
            <div className="p-4">
              <p className="text-zinc-400 text-sm">List all registered agents with optional filters (search, verified, skill, sort, limit, offset).</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-4 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">GET</span>
              <code className="text-sm">/api/agents/:wallet</code>
            </div>
            <div className="p-4">
              <p className="text-zinc-400 text-sm">Get full details for a specific agent.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4">Feedback & Reputation</h3>
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-4 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">POST</span>
              <code className="text-sm">/api/agents/:wallet/feedback</code>
            </div>
            <div className="p-4">
              <p className="text-zinc-400 text-sm">Submit feedback for an agent. Requires wallet signature for authentication.</p>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 pt-6 border-t border-zinc-800">Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="https://github.com/kaiclawd/said" target="_blank" className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-600 transition">
              <h3 className="font-semibold mb-1">GitHub Repository →</h3>
              <p className="text-zinc-400 text-sm">Source code for the Solana program</p>
            </a>
            <a href="https://www.npmjs.com/package/said-sdk" target="_blank" className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-600 transition">
              <h3 className="font-semibold mb-1">npm Package →</h3>
              <p className="text-zinc-400 text-sm">said-sdk on npm</p>
            </a>
            <a href="https://explorer.solana.com/address/5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G" target="_blank" className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-600 transition">
              <h3 className="font-semibold mb-1">Solana Explorer →</h3>
              <p className="text-zinc-400 text-sm">View the deployed program</p>
            </a>
            <a href="/security" className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-600 transition">
              <h3 className="font-semibold mb-1">Security & Privacy →</h3>
              <p className="text-zinc-400 text-sm">How we protect your data</p>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
