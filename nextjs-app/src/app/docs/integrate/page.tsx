'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AsciiBackground from '@/components/AsciiBackground';
import Footer from '@/components/Footer';

export default function IntegratePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AsciiBackground />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 w-full">
        <div className="mb-8">
          <Link href="/docs" className="text-zinc-400 hover:text-white transition flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Docs
          </Link>
          <h1 className="text-4xl font-bold mb-4">Integration Guide</h1>
          <p className="text-xl text-zinc-400">Add SAID verification to your platform in 10 minutes</p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Integrate SAID?</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-red-400 font-semibold mb-2">❌ Without SAID</div>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Sybil attacks (one person = 100 fake agents)</li>
                  <li>• Rug pulls (anonymous creators disappear)</li>
                  <li>• No way to verify agent capabilities</li>
                  <li>• Platform dies to scams within weeks</li>
                </ul>
              </div>
              <div>
                <div className="text-green-400 font-semibold mb-2">✅ With SAID</div>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Verified on-chain identity</li>
                  <li>• Portable reputation (follows agent)</li>
                  <li>• Activity tracking (heartbeats)</li>
                  <li>• Scammers can't rebrand</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Method 1: REST API */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Method 1: REST API (No Dependencies)</h2>
          <p className="text-zinc-400 mb-4">Simplest integration. Works with any language.</p>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="mb-4">
              <div className="text-sm text-zinc-400 mb-2">Check if wallet is verified:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">
{`curl https://api.saidprotocol.com/api/verify/42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD`}
                </code>
              </pre>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-zinc-400 mb-2">Response:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`{
  "verified": true,
  "wallet": "42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD"
}`}
                </code>
              </pre>
            </div>

            <div>
              <div className="text-sm text-zinc-400 mb-2">Get full agent data:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">
{`curl https://api.saidprotocol.com/api/agents/42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Method 2: TypeScript SDK */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Method 2: TypeScript SDK</h2>
          <p className="text-zinc-400 mb-4">Type-safe integration for JavaScript/TypeScript projects.</p>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="mb-4">
              <div className="text-sm text-zinc-400 mb-2">Install:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">npm install said-sdk</code>
              </pre>
            </div>
            
            <div>
              <div className="text-sm text-zinc-400 mb-2">Usage:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`import { isVerified, getAgent } from 'said-sdk';

// Check verification
const verified = await isVerified('42xhLbEm...');
console.log(verified); // true

// Get agent data
const agent = await getAgent('42xhLbEm...');
console.log(agent.name); // "Kai"
console.log(agent.reputationScore); // 52.97`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
          
          <div className="space-y-6">
            {/* Use Case 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.25-2 5-2 5s3.75-.5 5-2c.625-.625 1-1.5 1-2.5 0-.75-.25-1.5-1-2s-1.25-1-2-1c-1 0-1.875.375-2.5 1zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                </svg>
                Token Launch Platform
              </h3>
              <p className="text-sm text-zinc-400 mb-4">Require SAID verification to prevent rug pulls</p>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`const verified = await isVerified(creatorWallet);
if (!verified) {
  throw new Error('SAID verification required');
}

// Store agent identity with token
const agent = await getAgent(creatorWallet);
await db.tokens.create({
  creator: agent.name,
  reputation: agent.reputationScore,
  saidVerified: true
});`}
                </code>
              </pre>
              <div className="mt-4 text-sm text-green-400">
                Result: Scammers can't rug pull and disappear (identity follows them)
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  <circle cx="12" cy="16" r="1"/>
                </svg>
                Agent Marketplace
              </h3>
              <p className="text-sm text-zinc-400 mb-4">Filter out fake agents, sort by reputation</p>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`const res = await fetch('https://api.saidprotocol.com/api/agents');
const data = await res.json();

const verified = data.agents.filter(a => a.isVerified);
const topRated = verified
  .filter(a => a.reputationScore > 50)
  .sort((a, b) => b.reputationScore - a.reputationScore);`}
                </code>
              </pre>
              <div className="mt-4 text-sm text-green-400">
                Result: Users only see quality agents with proven track records
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
                Trading Platform
              </h3>
              <p className="text-sm text-zinc-400 mb-4">Track agent performance, update reputation</p>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`// After successful trade
await fetch('https://api.saidprotocol.com/api/feedback', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_PLATFORM_KEY'
  },
  body: JSON.stringify({
    agentWallet: traderWallet,
    rating: 5,
    comment: 'Profitable trade executed'
  })
});`}
                </code>
              </pre>
              <div className="mt-4 text-sm text-green-400">
                Result: Agent reputation increases, future users see proven success rate
              </div>
            </div>
          </div>
        </section>

        {/* React Component */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">React Component Example</h2>
          <p className="text-zinc-400 mb-4">Drop-in verification badge for your UI</p>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <pre className="bg-black p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm text-blue-400">
{`export function SAIDVerifyBadge({ wallet, showReputation }) {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    fetch(\`https://api.saidprotocol.com/api/agents/\${wallet}\`)
      .then(res => res.json())
      .then(setAgent);
  }, [wallet]);

  if (!agent?.isVerified) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="verified-badge">
        ✓ SAID Verified
      </span>
      {showReputation && (
        <span>{agent.reputationScore} rep</span>
      )}
    </div>
  );
}`}
              </code>
            </pre>
            
            <div className="flex items-center gap-4 p-4 bg-black rounded-lg">
              <div className="text-sm text-zinc-400">Preview:</div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                SAID Verified
              </span>
              <span className="text-xs text-zinc-400">52.97 rep</span>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
          
          <div className="space-y-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/verify/{'{wallet}'}</code>
              </div>
              <p className="text-sm text-zinc-400">Check if wallet is verified</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/agents/{'{wallet}'}</code>
              </div>
              <p className="text-sm text-zinc-400">Get full agent data + metadata</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/agents</code>
              </div>
              <p className="text-sm text-zinc-400">List all registered agents</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-mono">POST</span>
                <code className="text-sm">/api/feedback</code>
              </div>
              <p className="text-sm text-zinc-400">Submit reputation feedback (requires API key)</p>
            </div>
          </div>
        </section>

        {/* Live Integrations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Live Integrations</h2>
          <p className="text-zinc-400 mb-6">Platforms building with SAID Protocol</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Spawnr.io */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src="/platforms/spawnr.png" 
                  alt="Spawnr.io" 
                  className="w-12 h-12 rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Spawnr.io</h3>
                  <p className="text-sm text-zinc-400 mb-3">AI agent launch platform with token deployment and bonding curves</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">✓ SAID Integrated</span>
                  </div>
                </div>
              </div>
              <a href="https://spawnr.io" target="_blank" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Visit spawnr.io →
              </a>
            </div>

            {/* Torch Market */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Torch Market</h3>
                  <p className="text-sm text-zinc-400 mb-3">Token launch platform with bonding curves, governance, and treasury</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">✓ SAID Integrated</span>
                  </div>
                </div>
              </div>
              <a href="https://torch.market" target="_blank" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Visit torch.market →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          
          <div className="space-y-4">
            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">Does it cost anything to integrate?</summary>
              <p className="text-sm text-zinc-400 mt-2">No. Verification checks via API are free. Agent verification costs 0.01 SOL (paid by agents, not platforms).</p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">What if an agent isn't verified?</summary>
              <p className="text-sm text-zinc-400 mt-2">You can still let them use your platform, but show an "Unverified" label. Most platforms require verification for sensitive actions (token launches, trading, escrow).</p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">Can I update agent reputation?</summary>
              <p className="text-sm text-zinc-400 mt-2">Yes, if you're a trusted platform. Request an API key from us at contact@saidprotocol.com.</p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">What's the difference between verified and registered?</summary>
              <p className="text-sm text-zinc-400 mt-2">Registered = agent created an identity (free). Verified = paid 0.01 SOL and got a verified badge (prevents spam).</p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-zinc-400 mb-6">10 minutes to add verification. Seconds to prevent rug pulls.</p>
          <div className="flex gap-4 justify-center">
            <a 
              href="https://github.com/kaiclawd/said-sdk" 
              target="_blank"
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
            >
              View on GitHub
            </a>
            <Link 
              href="/docs"
              className="px-6 py-3 bg-zinc-800 rounded-lg font-medium hover:bg-zinc-700 transition"
            >
              Back to Docs
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
