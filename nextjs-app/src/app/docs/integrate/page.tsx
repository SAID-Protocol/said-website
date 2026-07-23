'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AsciiBackground from '@/components/AsciiBackground';
import Footer from '@/components/Footer';

export default function IntegratePage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AsciiBackground />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 pt-28 sm:pt-32 pb-12 w-full relative z-10">
        <div className="mb-8">
          <Link href="/docs" className="text-zinc-400 hover:text-white transition flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Docs
          </Link>
          <h1 className="text-4xl font-bold mb-4">Integration Guide</h1>
          <p className="text-xl text-zinc-400">Add SAID trust scoring and enforcement to your platform in 5 minutes</p>
        </div>

        {/* Why SAID */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Integrate SAID?</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-red-400 font-semibold mb-2">❌ Without SAID</div>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Any agent can pay for anything</li>
                  <li>• No way to verify agent identity</li>
                  <li>• Scammers create new wallets freely</li>
                  <li>• No economic consequences for bad behavior</li>
                  <li>• Every marketplace rebuilds trust from scratch</li>
                </ul>
              </div>
              <div>
                <div className="text-green-400 font-semibold mb-2">✅ With SAID</div>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• On-chain verified identity (6,700+ agents)</li>
                  <li>• Multi-dimensional trust scoring</li>
                  <li>• Real economic enforcement (staking/slashing)</li>
                  <li>• Gate payments by reputation</li>
                  <li>• Risk-based escrow terms and spend limits</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-sm text-amber-200">
              <strong>SAID is the only agent trust protocol with on-chain staking and slashing.</strong>{' '}
              Other systems tell you an agent is untrustworthy. SAID makes the agent pay for being untrustworthy.
            </p>
          </div>
        </section>

        {/* Method 1: REST API */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Method 1: REST API</h2>
          <p className="text-zinc-400 mb-4">No dependencies. Works with any language. Free for verification reads.</p>
          
          <div className="space-y-6">
            {/* Verify + Trust Score */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold mb-3 text-lg">Get Agent Trust Score &amp; Enforcement Status</h3>
              <div className="mb-3 relative">
                <pre className="bg-black p-4 rounded-lg overflow-x-auto pr-20">
                  <code className="text-sm text-green-400">
{`# Trust score + enforcement data in one call
curl https://api.saidprotocol.com/api/verify/42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD`}
                  </code>
                </pre>
                <button
                  onClick={() => copy('curl https://api.saidprotocol.com/api/verify/42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD', 'verify')}
                  className="absolute top-3 right-3 px-2 py-1 text-xs bg-zinc-800 rounded hover:bg-zinc-700 transition"
                >
                  {copied === 'verify' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="relative">
                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-blue-400">
{`{
  "verified": true,
  "wallet": "42xhLbEm5...",
  "trustScore": {
    "score": 72,
    "tier": "trusted",
    "components": {
      "identity": 15,
      "activity": 12,
      "economic": 18,
      "ecosystem": 10,
      "longevity": 8,
      "fairscale": 9
    }
  },
  "enforcement": {
    "staked": true,
    "stakeAmountSol": 5.0,
    "isSlashed": false,
    "slashCount": 0,
    "riskLevel": "low",
    "enforcementTier": "economic"
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Enforcement endpoint */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold mb-3 text-lg">Check Enforcement (Staking &amp; Slashing)</h3>
              <p className="text-sm text-zinc-400 mb-3">
                SAID&apos;s unique differentiator. Query whether an agent has real economic collateral locked on-chain.
              </p>
              <div className="relative">
                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-green-400">
{`# Full enforcement status
curl https://api.saidprotocol.com/api/enforcement/42xhLbEm5...

# Batch check up to 25 wallets
curl -X POST https://api.saidprotocol.com/api/enforcement/batch \\
  -H "Content-Type: application/json" \\
  -d '{"wallets": ["wallet1...", "wallet2..."]}'`}
                  </code>
                </pre>
                <button
                  onClick={() => copy('curl https://api.saidprotocol.com/api/enforcement/42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD', 'enforcement')}
                  className="absolute top-3 right-3 px-2 py-1 text-xs bg-zinc-800 rounded hover:bg-zinc-700 transition"
                >
                  {copied === 'enforcement' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold mb-3 text-lg">Get Risk Assessment</h3>
              <p className="text-sm text-zinc-400 mb-3">
                Returns risk level, recommended escrow %, max spend caps, and accept/reject verdict for marketplaces.
              </p>
              <div className="relative">
                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-green-400">
{`# Risk assessment with escrow recommendations
curl https://api.saidprotocol.com/api/enforcement/42xhLbEm5.../risk`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Method 2: TypeScript SDK */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Method 2: TypeScript SDK</h2>
          <p className="text-zinc-400 mb-4">Full-featured SDK with caching, retry, trust scoring, and enforcement queries.</p>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="mb-4 relative">
              <div className="text-sm text-zinc-400 mb-2">Install:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">npm install @said-protocol/client</code>
              </pre>
              <button
                onClick={() => copy('npm install @said-protocol/client', 'install')}
                className="absolute top-3 right-3 px-2 py-1 text-xs bg-zinc-800 rounded hover:bg-zinc-700 transition"
              >
                {copied === 'install' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="mb-4 relative">
              <div className="text-sm text-zinc-400 mb-2">Check trust score and enforcement:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`import { SAIDClient } from "@said-protocol/client";

const said = new SAIDClient({
  baseUrl: "https://api.saidprotocol.com",
});

// Get trust score + enforcement data
const trust = await said.getTrustSummary("42xhLbEm5...");

if (trust.enforcement.staked && !trust.enforcement.isSlashed) {
  console.log(\`✓ Trusted agent (\${trust.trustScore.score}/100)\`);
  console.log(\`  Stake: \${trust.enforcement.stakeAmountSol} SOL\`);
} else if (trust.enforcement.isSlashed) {
  console.log(\`✗ SLASHED \${trust.enforcement.slashCount}x — DO NOT TRUST\`);
}

// Get SACRS credit score (300-850, FICO-compatible)
const credit = await said.getSACRS("42xhLbEm5...");
console.log(\`Credit score: \${credit.score}\`);`}
                </code>
              </pre>
              <button
                onClick={() => copy(`import { SAIDClient } from "@said-protocol/client";

const said = new SAIDClient({
  baseUrl: "https://api.saidprotocol.com",
});

const trust = await said.getTrustSummary("42xhLbEm5...");

if (trust.enforcement.staked && !trust.enforcement.isSlashed) {
  console.log(\`✓ Trusted agent (\${trust.trustScore.score}/100)\`);
} else if (trust.enforcement.isSlashed) {
  console.log(\`✗ SLASHED — DO NOT TRUST\`);
}`, 'sdk1')}
                className="absolute top-3 right-3 px-2 py-1 text-xs bg-zinc-800 rounded hover:bg-zinc-700 transition"
              >
                {copied === 'sdk1' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="relative">
              <div className="text-sm text-zinc-400 mb-2">Filter agents by trust level:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`import { filterTrusted, assessRisk } from "@said-protocol/client";

// Filter a list of agents to only trusted ones
const trusted = await filterTrusted(allAgents, {
  minScore: 50,
  requireVerified: true,
  blockSlashed: true,
});

// Assess risk for marketplace integration
const risk = await assessRisk(wallet, {
  minScore: 30,
  minStakeSOL: 1,
  blockSlashed: true,
});
// Returns: { decision: "allow" | "review" | "deny", escrowPct, maxTxSOL }`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Method 3: x402 Middleware */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Method 3: x402 Payment Middleware</h2>
          <p className="text-zinc-400 mb-4">
            Gate x402 payments by agent reputation. The only middleware that checks economic enforcement before processing payments.
          </p>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="mb-4 relative">
              <div className="text-sm text-zinc-400 mb-2">Install:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">npm install @said-protocol/x402-middleware</code>
              </pre>
            </div>

            <div className="mb-4 relative">
              <div className="text-sm text-zinc-400 mb-2">Express — gate your API behind SAID trust:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`import express from "express";
import { expressTrustMiddleware } from "@said-protocol/x402-middleware";

const app = express();

// Only trusted, verified agents can access premium endpoints
app.use("/api/premium", expressTrustMiddleware({
  requireVerified: true,
  minTrustScore: 50,
  blockSlashed: true,
  minStakeSOL: 1,  // Require real economic collateral
}));

app.get("/api/premium/data", (req, res) => {
  // req.saidTrust contains full trust evaluation
  res.json({
    data: "premium content",
    agent: req.saidTrust.wallet,
    score: req.saidTrust.trustScore,
    tier: req.saidTrust.tier,
  });
});

app.listen(3000);`}
                </code>
              </pre>
            </div>

            <div className="relative">
              <div className="text-sm text-zinc-400 mb-2">Hono / Cloudflare Workers:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`import { Hono } from "hono";
import { honoTrustMiddleware } from "@said-protocol/x402-middleware";

const app = new Hono();

app.use("/api/*", honoTrustMiddleware({
  minTrustScore: 30,
  blockSlashed: true,
}));

app.get("/api/data", (c) => {
  const trust = c.get("saidTrust");
  return c.json({ score: trust.trustScore, tier: trust.tier });
});`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Method 4: Policy Engine */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Method 4: Spend Policy Engine</h2>
          <p className="text-zinc-400 mb-4">
            Dynamic spend limits based on agent reputation. New agents get $0/tx. Elite staked agents get $500/tx.
          </p>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="mb-4 relative">
              <div className="text-sm text-zinc-400 mb-2">Install:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-green-400">npm install @said-protocol/policy-engine</code>
              </pre>
            </div>

            <div className="relative">
              <div className="text-sm text-zinc-400 mb-2">Use a preset or configure custom rules:</div>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-blue-400">
{`import { createPolicy, POLICY_BALANCED } from "@said-protocol/policy-engine";

// Use a preset (strict / balanced / permissive / x402 / defi)
const policy = createPolicy(POLICY_BALANCED);

// Or customize
const custom = createPolicy({
  ...POLICY_BALANCED,
  minTrustScore: 40,
  minStakeSOL: 2,
  maxTxSOL: 100,     // Max 100 SOL per transaction
  maxDailySOL: 500,  // Max 500 SOL per day
  blockSlashed: true,
  allowlist: ["known_partner_wallet..."],
});

// Evaluate a wallet against the policy
const result = await policy.check(walletAddress);
// { allowed: true/false, reason: "...", tier: "...", limits: {...} }`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* API Endpoints Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
          
          <div className="space-y-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/verify/{'{wallet}'}</code>
              </div>
              <p className="text-sm text-zinc-400">Verify agent + trust score + enforcement status (all-in-one)</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/enforcement/{'{wallet}'}</code>
              </div>
              <p className="text-sm text-zinc-400">On-chain staking/slashing data — SAID&apos;s unique enforcement layer</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/enforcement/{'{wallet}'}/risk</code>
              </div>
              <p className="text-sm text-zinc-400">Risk assessment with escrow %, spend caps, and marketplace verdict</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-mono">POST</span>
                <code className="text-sm">/api/enforcement/batch</code>
              </div>
              <p className="text-sm text-zinc-400">Batch enforcement check (up to 25 wallets)</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/agents/{'{wallet}'}</code>
              </div>
              <p className="text-sm text-zinc-400">Full agent profile, metadata, and capabilities</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/leaderboard</code>
              </div>
              <p className="text-sm text-zinc-400">Top agents ranked by trust score</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-mono">GET</span>
                <code className="text-sm">/api/agents/top</code>
              </div>
              <p className="text-sm text-zinc-400">Top agents with trust dimensions and protocol capabilities</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-mono">POST</span>
                <code className="text-sm">/api/agents/{'{wallet}'}/feedback</code>
              </div>
              <p className="text-sm text-zinc-400">Submit reputation feedback (trusted platforms only)</p>
            </div>
          </div>
        </section>

        {/* SDK Ecosystem */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">SAID SDK Ecosystem</h2>
          <p className="text-zinc-400 mb-6">Pick the right tool for your stack</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold mb-1">@said-protocol/client</h3>
              <p className="text-sm text-zinc-400 mb-2">Core TypeScript SDK. Trust scores, enforcement, agent cards, credit scores, React hooks.</p>
              <div className="text-xs text-zinc-500">Dual CJS/ESM · 198 tests · v0.13.0</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-semibold mb-1">@said-protocol/x402-middleware</h3>
              <p className="text-sm text-zinc-400 mb-2">Trust middleware for x402 payment servers. Gate payments by reputation.</p>
              <div className="text-xs text-zinc-500">Express · Hono · Workers · v1.1.0</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">@said-protocol/policy-engine</h3>
              <p className="text-sm text-zinc-400 mb-2">Reputation-dynamic spend policy engine. 5 tiers, 11-rule pipeline, presets.</p>
              <div className="text-xs text-zinc-500">5 presets · batch eval · v0.1.0</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">🔌</div>
              <h3 className="font-semibold mb-1">plugin-said (ElizaOS)</h3>
              <p className="text-sm text-zinc-400 mb-2">ElizaOS plugin with 9 actions. Full trust infrastructure toolkit for Eliza agents.</p>
              <div className="text-xs text-zinc-500">9 actions · caching · retry · v3.0.0</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold mb-1">@said-protocol/framework</h3>
              <p className="text-sm text-zinc-400 mb-2">Agent framework with trust-gated A2A, escrow terms, and memory systems.</p>
              <div className="text-xs text-zinc-500">Trust-gated A2A · escrow · v0.2.0</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold mb-1">@said-protocol/bond</h3>
              <p className="text-sm text-zinc-400 mb-2">Performance bonds for AI agents. 6-tier underwriting, premium pricing engine.</p>
              <div className="text-xs text-zinc-500">First in market · v0.1.0</div>
            </div>
          </div>
        </section>

        {/* Live Integrations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Live Integrations</h2>
          <p className="text-zinc-400 mb-6">16+ platforms building with SAID Protocol</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <img src="/platforms/spawnr.png" alt="Spawnr.io" className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Spawnr.io</h3>
                  <p className="text-sm text-zinc-400 mb-3">AI agent launch platform with token deployment and bonding curves</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">✓ SAID Integrated</span>
                  </div>
                </div>
              </div>
              <a href="https://spawnr.io" target="_blank" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Visit spawnr.io →
              </a>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Torch Market</h3>
                  <p className="text-sm text-zinc-400 mb-3">Token launch platform with bonding curves, governance, and treasury</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">✓ SAID Integrated</span>
                  </div>
                </div>
              </div>
              <a href="https://torch.market" target="_blank" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Visit torch.market →
              </a>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">ClawPump</h3>
                  <p className="text-sm text-zinc-400 mb-3">Agent-powered token launch platform on Solana. 15+ tokens launched.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">✓ SAID Integrated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-2xl">
                  🛠️
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">DAEMON</h3>
                  <p className="text-sm text-zinc-400 mb-3">Solana IDE for AI agent development. 17.7K target developers.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">✓ SAID Integrated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          
          <div className="space-y-4">
            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">Does it cost anything to integrate?</summary>
              <p className="text-sm text-zinc-400 mt-2">No. All verification reads (trust scores, enforcement status, agent data) are free via the public API. Agent verification costs 0.01 SOL (paid by agents, not platforms).</p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">What makes SAID different from other agent reputation systems?</summary>
              <p className="text-sm text-zinc-400 mt-2">
                SAID is the only protocol with on-chain staking and slashing. Other systems (AgentScore, RNWY, ChainAware) surface reputation signals — but none can enforce economic consequences. SAID agents stake real SOL as collateral. If they act maliciously, they get slashed and lose funds. This creates real accountability, not just badges.
              </p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">What is the enforcement API?</summary>
              <p className="text-sm text-zinc-400 mt-2">
                The enforcement API reads staking and slashing data directly from the SAID on-chain program (Program ID: <code className="text-xs bg-zinc-800 px-1 rounded">5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G</code>). You can query whether an agent has staked SOL, whether they&apos;ve been slashed, and get risk assessments with escrow recommendations — all via simple HTTP endpoints.
              </p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">Can I gate payments by reputation?</summary>
              <p className="text-sm text-zinc-400 mt-2">
                Yes. The <code className="text-xs bg-zinc-800 px-1 rounded">@said-protocol/x402-middleware</code> package intercepts x402 payment requests, checks the agent&apos;s SAID trust score and enforcement status, and blocks/allows/surcharges based on your rules. Works with Express, Hono, and Cloudflare Workers.
              </p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">How do spend policy limits work?</summary>
              <p className="text-sm text-zinc-400 mt-2">
                The policy engine creates dynamic limits based on trust tier. New/anonymous agents get $0/tx. Verified agents get $50/tx. Elite staked agents get $500/tx. This means trusted agents can transact freely while untrusted agents are automatically constrained — all enforced via middleware, not manual review.
              </p>
            </details>

            <details className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <summary className="font-semibold cursor-pointer">What chains does SAID support?</summary>
              <p className="text-sm text-zinc-400 mt-2">
                SAID is Solana-native (identity, staking, slashing all on Solana mainnet). Cross-chain messaging works across 10+ networks including Ethereum, Base, Arbitrum, Optimism, BSC, Polygon, Avalanche, and more — powered by x402.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-zinc-400 mb-6">5 minutes to add trust scoring and enforcement. No Solana knowledge required.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="https://github.com/SAID-Protocol/said-sdk" 
              target="_blank"
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
            >
              SDK on GitHub
            </a>
            <a 
              href="https://github.com/SAID-Protocol/said-api" 
              target="_blank"
              className="px-6 py-3 bg-zinc-800 rounded-lg font-medium hover:bg-zinc-700 transition"
            >
              API Reference
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
