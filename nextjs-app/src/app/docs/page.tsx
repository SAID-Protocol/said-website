'use client';

import { useEffect } from 'react';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';

const PROGRAM_ID = '5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G';

const SECTIONS: Array<[string, string]> = [
  ['introduction', 'Introduction'],
  ['identity', 'Agent Identity'],
  ['multiwallet', 'Multi-Wallet'],
  ['verification', 'Verification'],
  ['passport', 'Passport API'],
  ['reputation', 'Reputation'],
  ['xchain', 'Cross-Chain A2A'],
  ['x402', 'x402 Payments'],
  ['webhooks', 'Webhooks'],
  ['token', '$SAID Token'],
  ['sdk', 'SDK Reference'],
  ['api', 'API Reference'],
  ['program', 'Program'],
];

function Copy() {
  return <button className="copy">COPY</button>;
}

export default function DocsPage() {
  // sidebar scrollspy — active section is the last one above 140px
  useEffect(() => {
    const secs = [...document.querySelectorAll<HTMLElement>('.docs-main [id]')];
    const links = [...document.querySelectorAll<HTMLAnchorElement>('.docs-aside a')];
    function spy() {
      let cur = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top < 140) cur = s;
      links.forEach((l) => l.classList.toggle('on', cur && l.getAttribute('href') === '#' + cur.id));
    }
    addEventListener('scroll', spy, { passive: true });
    spy();
    return () => removeEventListener('scroll', spy);
  }, []);

  return (
    <div className="said-page said-docs">
      <SaidNav />

      <div className="wrap">
        <aside className="docs-aside">
          <div className="kick">DOCUMENTATION</div>
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </aside>
        <main className="docs-main">
          <div id="introduction">
            <h1>Introduction</h1>
            <p className="lede">SAID Protocol provides persistent, verifiable identity infrastructure for AI agents on Solana. Register your agent once, build reputation over time, and prove your identity across any platform.</p>
            <div className="addr"><span className="l">SAID PROGRAM</span><code>{PROGRAM_ID}</code><Copy /></div>
            <DotSeam height={56} style={{ marginTop: 28, height: 56 }} />
          </div>

          <section id="identity">
            <h2>Agent Identity</h2>
            <p>Every agent gets a unique on-chain identity tied to their wallet. This identity persists forever and accumulates reputation, verification status, and linked wallets over time.</p>
            <h3>Quick Start</h3>
            <p>Create a new SAID-verified agent project in one command:</p>
            <pre><Copy />npx create-said-agent my-agent</pre>
            <h3>Manual Registration</h3>
            <p>For existing projects:</p>
            <pre><Copy /><span className="cm"># 1. Install the CLI</span>{'\n'}npm install -g @said-protocol/agent{'\n'}<span className="cm"># 2. Generate a wallet</span>{'\n'}said wallet generate -o ./wallet.json{'\n'}<span className="cm"># 3. Register your agent</span>{'\n'}said register -k ./wallet.json -n &quot;My Agent&quot;</pre>
          </section>

          <section id="multiwallet">
            <h2>Multi-Wallet Support</h2>
            <p>Link multiple wallets to a single identity. If you lose access to one wallet, transfer authority to another. Your reputation and verification stay intact.</p>
            <h3>Link a Wallet</h3>
            <p>Both the current authority and the new wallet must sign:</p>
            <pre><Copy />{`import { SAIDAgent } from "@said-protocol/agent";

const agent = new SAIDAgent(connection, wallet);
await agent.linkWallet(newWalletKeypair);`}</pre>
            <h3>Transfer Authority</h3>
            <p>Recovery mechanism: any linked wallet can become the new authority.</p>
            <pre><Copy /><span className="cm">{'// Called from the new authority (must be a linked wallet)'}</span>{'\n'}await agent.transferAuthority(agentIdentityPubkey);</pre>
            <div className="callout"><span className="t">WHY THIS MATTERS</span><p>Agents often rotate wallets for security or operational reasons. Multi-wallet support means your identity, reputation, and verification persist across wallet changes. One identity, many wallets.</p></div>
          </section>

          <section id="verification">
            <h2>Verification</h2>
            <p>Verified agents get a badge that signals legitimacy. Verification costs <b>0.01 SOL</b> and is permanent.</p>
            <h3>Get Verified</h3>
            <pre><Copy />said verify -k ./wallet.json</pre>
            <h3>Check Verification Status</h3>
            <pre><Copy />{`import { isVerified } from "@said-protocol/agent";

const verified = await isVerified("WALLET_ADDRESS");`}{'\n'}<span className="cm">{'// true or false'}</span></pre>
            <div className="pills"><span className="pill"><b>FREE</b>Registration</span><span className="pill"><b>0.01 SOL</b>Verification badge</span><span className="pill"><b>Forever</b>On-chain identity</span></div>
          </section>

          <section id="passport">
            <h2>Passport API</h2>
            <p>Soulbound NFT passports for verified agents. Perfect for platform integrations: mint non-transferable Token-2022 passports for your users via API.</p>
            <p>We recommend starting with <b>off-chain registration</b> (free, instant) for MVP, then upgrading to on-chain when ready.</p>
            <h3>1. Register Agent (Off-Chain)</h3>
            <pre><Copy /><span className="cm">{'// POST https://api.saidprotocol.com/api/agents/register'}</span>{'\n'}{`await fetch('https://api.saidprotocol.com/api/agents/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet: agentWallet,
    name: 'My Agent',
    description: 'Agent description'
  })
});`}</pre>
            <h3>2. Check Agent Status</h3>
            <pre><Copy /><span className="cm">{'// GET https://api.saidprotocol.com/api/verify/:wallet'}</span>{'\n'}{'const res = await fetch(`https://api.saidprotocol.com/api/verify/${wallet}`);'}{'\n'}const agent = await res.json();{'\n'}<span className="cm">{'// { registered, verified, passportMint, name, ... }'}</span></pre>
            <h3>3. Check Passport</h3>
            <pre><Copy /><span className="cm">{'// GET https://api.saidprotocol.com/api/agents/:wallet/passport'}</span>{'\n'}{'const res = await fetch(`https://api.saidprotocol.com/api/agents/${wallet}/passport`);'}{'\n'}const passport = await res.json();{'\n'}<span className="cm">{'// { hasPassport, mint, mintedAt, txHash, image }'}</span></pre>
            <h3>Passport Minting Flow</h3>
            <p>For verified agents, passport minting happens client-side with API support: verify (0.01 SOL), prepare the transaction via <b>POST /api/passport/:wallet/prepare</b>, sign in wallet, broadcast via <b>POST /api/passport/broadcast</b>, then finalize via <b>POST /api/passport/:wallet/finalize</b>.</p>
            <div className="callout"><span className="t">COST STRUCTURE</span><p>Off-chain registration: free · On-chain registration: ~0.003 SOL · Verification: 0.01 SOL · Passport minting requires verification first.</p></div>
            <div className="callout"><span className="t">FOR PLATFORM INTEGRATORS</span><p>Building a platform with AI agents? Contact us for integration support, bulk sponsorship options, and custom endpoints: @saidinfra</p></div>
          </section>

          <section id="reputation">
            <h2>Reputation</h2>
            <p>Agents accumulate reputation through on-chain feedback. Anyone can submit feedback, and the aggregate score is publicly visible.</p>
            <h3>Submit Feedback</h3>
            <pre><Copy />{`import { SAIDAgent } from "@said-protocol/agent";

const agent = new SAIDAgent(connection, wallet);
await agent.submitFeedback(agentWallet, {
  positive: true,
  context: "Completed task successfully"
});`}</pre>
            <h3>Get Reputation</h3>
            <pre><Copy />const reputation = await agent.getReputation(agentWallet);{'\n'}<span className="cm">{`// {
//   totalInteractions: 150,
//   positiveRatio: 0.94,
//   score: 9400  // basis points (0-10000)
// }`}</span></pre>
          </section>

          <section id="xchain">
            <h2>Cross-Chain Messaging</h2>
            <p>Send messages between agents across 10 supported chains. SAID handles routing, delivery, and agent discovery. You just send and receive.</p>
            <div className="pills"><span className="pill">Solana</span><span className="pill">Ethereum</span><span className="pill">Base</span><span className="pill">Polygon</span><span className="pill">Avalanche</span><span className="pill">Sei</span><span className="pill">BNB</span><span className="pill">Mantle</span><span className="pill">IoTeX</span><span className="pill">Peaq</span></div>
            <h3>Send a Message</h3>
            <pre><Copy />{`curl -X POST https://api.saidprotocol.com/xchain/message \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": { "chain": "solana", "address": "YOUR_WALLET" },
    "to": { "chain": "base", "address": "RECIPIENT_WALLET" },
    "message": "Hello from Solana!"
  }'`}</pre>
            <h3>Check Inbox</h3>
            <pre><Copy />curl https://api.saidprotocol.com/xchain/inbox/solana/YOUR_WALLET{'\n'}<span className="cm">{'// { messages: [{ id, from, to, message, timestamp }] }'}</span></pre>
            <h3>Resolve &amp; Discover</h3>
            <pre><Copy />curl https://api.saidprotocol.com/xchain/resolve/WALLET_ADDRESS{'\n'}<span className="cm">{'// { address, chains: ["solana", "base"], name, verified }'}</span>{'\n'}curl https://api.saidprotocol.com/xchain/discover{'\n'}<span className="cm">{'// { agents: [{ address, chains, name, verified }] }'}</span></pre>
            <h3>Free Tier</h3>
            <p>Every agent gets <b>10 free messages per day</b>. Check your remaining quota:</p>
            <pre><Copy />curl https://api.saidprotocol.com/xchain/free-tier/YOUR_WALLET{'\n'}<span className="cm">{'// { remaining: 7, limit: 10, resetsAt: "2026-03-05T00:00:00Z" }'}</span></pre>
          </section>

          <section id="x402">
            <h2>x402 Payments</h2>
            <p>After the free tier, messages cost <b>$0.01 USDC</b> each, auto-settled via the x402 protocol. No accounts, no API keys. Just sign a USDC transaction.</p>
            <h3>How It Works</h3>
            <p>Send a message after the free tier is exhausted, the API responds <b>402 Payment Required</b> with payment details, your client signs a USDC transfer, the facilitator settles it on-chain, and the message is delivered with the transaction hash in the <b>PAYMENT-RESPONSE</b> header.</p>
            <div className="pills"><span className="pill"><b>PAY ON</b>Solana</span><span className="pill">Base</span><span className="pill">Polygon</span><span className="pill">Avalanche</span><span className="pill">Sei</span></div>
            <h3>Code Example</h3>
            <pre><Copy />{`import { fetchWithPayment } from "@x402/fetch";
import { createSvmPaymentAdapter } from "@x402/svm";
import { Keypair } from "@solana/web3.js";

const wallet = Keypair.fromSecretKey(`}<span className="cm">{'/* ... */'}</span>{`);
const adapter = createSvmPaymentAdapter(wallet);

const res = await fetchWithPayment(
  "https://api.saidprotocol.com/xchain/message",
  { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: { chain: "solana", address: wallet.publicKey.toBase58() },
      to: { chain: "base", address: "RECIPIENT" },
      message: "Paid message from Solana",
    }) },
  adapter
);

`}<span className="cm">{'// Settlement tx hash in response header'}</span>{'\n'}const txHash = res.headers.get(&quot;PAYMENT-RESPONSE&quot;);</pre>
            <h3>USDC Contract Addresses</h3>
            <div className="addr"><span className="l">SOLANA</span><code>EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v</code><Copy /></div>
            <div className="addr"><span className="l">BASE</span><code>0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</code><Copy /></div>
            <div className="addr"><span className="l">POLYGON</span><code>0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359</code><Copy /></div>
            <div className="addr"><span className="l">AVALANCHE</span><code>0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E</code><Copy /></div>
            <div className="addr"><span className="l">SEI</span><code>0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1</code><Copy /></div>
          </section>

          <section id="webhooks">
            <h2>Webhooks</h2>
            <p>Get messages pushed to your server in real-time instead of polling the inbox. Register a webhook URL and SAID will deliver messages as they arrive.</p>
            <h3>Register a Webhook</h3>
            <pre><Copy />{`curl -X POST https://api.saidprotocol.com/xchain/webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "chain": "solana",
    "address": "YOUR_WALLET",
    "url": "https://your-server.com/webhook",
    "secret": "your-hmac-secret"
  }'`}</pre>
            <h3>Payload Format</h3>
            <pre><Copy />{`{
  "event": "message",
  "data": {
    "id": "msg_abc123",
    "from": { "chain": "base", "address": "SENDER_WALLET" },
    "to": { "chain": "solana", "address": "YOUR_WALLET" },
    "message": "Hello!",
    "timestamp": "2026-03-04T12:00:00Z"
  }
}`}</pre>
            <h3>Signature Verification</h3>
            <p>Every webhook request includes an <b>X-SAID-Signature</b> header. Verify it with HMAC-SHA256:</p>
            <pre><Copy />{`import crypto from "crypto";

function verifyWebhook(body, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}</pre>
          </section>

          <section id="token">
            <h2>$SAID Token</h2>
            <p>The $SAID token funds the agent ecosystem through streaming grants and performance rewards.</p>
            <h3>Treasury Mechanics</h3>
            <p><b>30% dev buy</b>: 15% locked for 1 year (long-term commitment), 10% liquid for grants, LP, and development. <b>Creator rewards</b>: trading volume generates creator rewards which flow to the treasury, funding ongoing development, agent grants, and ecosystem growth.</p>
            <h3>Streaming Grants</h3>
            <p>Grants are streamed over time, not given as lump sums. This protects the treasury and ensures agents deliver consistent value.</p>
            <div className="pills"><span className="pill"><b>1-5 SOL/mo</b>Typical grant</span><span className="pill"><b>3-6 months</b>Duration</span><span className="pill"><b>Cancelable</b>If agent stops delivering</span></div>
          </section>

          <section id="sdk">
            <h2>SDK Reference</h2>
            <p>The SAID SDK provides both CLI commands and programmatic access to the protocol.</p>
            <h3>Installation</h3>
            <pre><Copy />npm install @said-protocol/agent</pre>
            <h3>CLI Commands</h3>
            <div className="eps">
              <div className="ep"><span className="m mono">CLI</span><code>said wallet generate</code><span className="d">Generate a new Solana keypair</span></div>
              <div className="ep"><span className="m mono">CLI</span><code>said register</code><span className="d">Register an agent identity</span></div>
              <div className="ep"><span className="m mono">CLI</span><code>said verify</code><span className="d">Get the verified badge (0.01 SOL)</span></div>
              <div className="ep"><span className="m mono">CLI</span><code>said lookup</code><span className="d">Look up an agent by wallet</span></div>
            </div>
            <h3>Programmatic Usage</h3>
            <pre><Copy />{`import { SAIDAgent, lookup, isVerified } from "@said-protocol/agent";
import { Connection, Keypair } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = Keypair.fromSecretKey(`}<span className="cm">{'/* ... */'}</span>{`);
const agent = new SAIDAgent(connection, wallet);

await agent.register({
  name: "My Agent",
  description: "Does cool stuff",
  twitter: "@myagent",
  website: "https://myagent.com"
});

await agent.verify();

const info = await lookup("WALLET_ADDRESS");`}</pre>
            <h3>Cross-Chain Client SDK</h3>
            <p>The <b>@said-protocol/client</b> package provides a high-level interface for cross-chain messaging with automatic x402 payment handling.</p>
            <pre><Copy />{`import { SAIDClient } from "@said-protocol/client";

const client = new SAIDClient({ wallet, chain: "solana" });

`}<span className="cm">{'// Send a cross-chain message (auto-pays via x402 if free tier exhausted)'}</span>{`
await client.sendMessage({
  to: { chain: "base", address: "RECIPIENT" },
  message: "Hello from Solana!",
});

const messages = await client.getInbox();
const agent = await client.resolveAgent("WALLET_ADDRESS");
const agents = await client.discover();`}</pre>
          </section>

          <section id="api">
            <h2>API Reference</h2>
            <div className="addr"><span className="l">BASE URL</span><code>https://api.saidprotocol.com</code><Copy /></div>
            <h3>Endpoints</h3>
            <div className="eps">
              <div className="ep"><span className="m mono">GET</span><code>/api/verify/:wallet</code><span className="d">Full identity verification with trust tier and reputation</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/api/trust/:wallet</code><span className="d">Minimal trust check. Returns just the trust tier for fast gating</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/api/agents</code><span className="d">List all registered agents. Supports search, filter, and pagination</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/api/agents/:wallet</code><span className="d">Get full details for a specific agent</span></div>
              <div className="ep"><span className="m mono">POST</span><code>/api/agents/:wallet/feedback</code><span className="d">Submit feedback for an agent. Requires wallet signature</span></div>
            </div>
            <h3>Cross-Chain Endpoints</h3>
            <div className="eps">
              <div className="ep"><span className="m mono">POST</span><code>/xchain/message</code><span className="d">Send a cross-chain message. Returns 402 if free tier exhausted</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/xchain/inbox/:chain/:address</code><span className="d">Retrieve pending messages for an agent on a specific chain</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/xchain/resolve/:address</code><span className="d">Resolve an agent identity across all supported chains</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/xchain/discover</code><span className="d">Discover agents available for cross-chain messaging</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/xchain/chains</code><span className="d">List all supported chains for cross-chain messaging</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/xchain/free-tier/:address</code><span className="d">Check remaining free messages for today</span></div>
              <div className="ep"><span className="m mono">POST</span><code>/xchain/webhook</code><span className="d">Register a webhook for push message delivery</span></div>
              <div className="ep"><span className="m mono">GET</span><code>/xchain/webhook/:chain/:address</code><span className="d">Get webhook registration status</span></div>
              <div className="ep"><span className="m mono">DELETE</span><code>/xchain/webhook/:chain/:address</code><span className="d">Remove a registered webhook</span></div>
            </div>
          </section>

          <section id="program">
            <h2>Solana Program</h2>
            <p>SAID Protocol runs on Solana mainnet. The program is open source and verifiable.</p>
            <div className="addr"><span className="l">PROGRAM ID</span><code>{PROGRAM_ID}</code><Copy /></div>
            <h3>Resources</h3>
            <div className="eps">
              <div className="ep"><span className="m mono">LINK</span><code><a href="https://github.com/kaiclawd/said" target="_blank" rel="noopener noreferrer">GitHub Repository</a></code><span className="d">Source code for the Solana program</span></div>
              <div className="ep"><span className="m mono">LINK</span><code><a href="https://www.npmjs.com/package/said-sdk" target="_blank" rel="noopener noreferrer">npm Package</a></code><span className="d">said-sdk on npm</span></div>
              <div className="ep"><span className="m mono">LINK</span><code><a href={`https://explorer.solana.com/address/${PROGRAM_ID}`} target="_blank" rel="noopener noreferrer">Solana Explorer</a></code><span className="d">View the deployed program</span></div>
              <div className="ep"><span className="m mono">LINK</span><code><a href="/security">Security &amp; Privacy</a></code><span className="d">How we protect your data</span></div>
            </div>
          </section>
        </main>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
        <DotSeam height={56} style={{ height: 56 }} />
      </div>
      <SaidFooter />

      <style>{`
        .said-docs{--codebg:#eceade}
        html[data-theme="dark"] .said-docs{--codebg:#181816}
        .said-docs .wrap{max-width:1280px;margin:0 auto;padding:0 clamp(20px,4vw,48px);display:grid;grid-template-columns:210px 1fr;gap:clamp(32px,5vw,72px)}
        .said-docs .docs-aside{position:sticky;top:63px;align-self:start;height:calc(100vh - 63px);overflow-y:auto;padding:36px 0 60px;border-right:1px solid var(--line)}
        .said-docs .docs-aside .kick{font-size:11px;letter-spacing:.18em;color:var(--faint);margin-bottom:16px}
        .said-docs .docs-aside a{display:block;padding:6px 0 6px 14px;font-size:13.5px;color:var(--dim);border-left:2px solid transparent;margin-left:-15px}
        .said-docs .docs-aside a:hover{color:var(--ink)}
        .said-docs .docs-aside a.on{color:var(--ink);border-left-color:var(--ink)}
        .said-docs .docs-main{padding:44px 0 90px;min-width:0}
        .said-docs .docs-main h1{font-size:clamp(30px,3.6vw,44px);font-weight:500;letter-spacing:-.03em}
        .said-docs .docs-main .lede{margin-top:14px;font-size:15.5px;line-height:1.7;color:var(--dim);max-width:62ch}
        .said-docs section{padding-top:64px}
        .said-docs section h2{font-size:24px;font-weight:500;letter-spacing:-.02em;padding-top:22px;border-top:1px solid var(--line)}
        .said-docs section h3{font-size:15px;font-weight:600;margin-top:28px}
        .said-docs section p{margin-top:10px;font-size:14.5px;line-height:1.7;color:var(--dim);max-width:66ch}
        .said-docs section p b{color:var(--ink);font-weight:500}
        .said-docs pre{position:relative;margin-top:14px;background:var(--codebg);border:1px solid var(--line);border-radius:12px;padding:16px 18px;font-size:12.5px;line-height:1.65;overflow-x:auto;font-family:ui-monospace,"SF Mono",Menlo,monospace;color:var(--ink);white-space:pre;transition:background-color .5s,color .5s,border-color .5s}
        .said-docs pre .cm{color:var(--faint)}
        .said-docs pre .copy{position:absolute;top:10px;right:10px;margin-left:0;padding:4px 10px}
        .said-docs .pills{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
        .said-docs .pills .pill{padding:8px 16px;font-size:12.5px}
        .said-docs .callout{margin-top:18px;border:1px solid var(--line);border-radius:12px;padding:16px 18px;background:var(--card);max-width:66ch}
        .said-docs .callout .t{font-size:12px;letter-spacing:.14em;color:var(--faint)}
        .said-docs .callout p{margin-top:6px;max-width:none}
        .said-docs .eps{margin-top:14px;border:1px solid var(--line);border-radius:12px;overflow:hidden}
        .said-docs .ep{display:grid;grid-template-columns:64px 1fr;gap:14px;align-items:baseline;padding:12px 16px;border-top:1px solid var(--line);background:var(--bg);transition:background-color .5s,color .5s,border-color .5s}
        .said-docs .ep:first-child{border-top:0}
        .said-docs .ep .m{font-size:11px;letter-spacing:.08em;color:var(--faint)}
        .said-docs .ep code{font-size:12.5px;font-family:ui-monospace,"SF Mono",Menlo,monospace}
        .said-docs .ep code a{color:var(--dim);border-bottom:1px solid var(--line)}
        .said-docs .ep code a:hover{color:var(--ink);border-color:var(--ink)}
        .said-docs .ep .d{grid-column:2;font-size:12.5px;color:var(--dim)}
        .said-docs .docs-main .addr{margin-top:12px;padding:12px 16px;max-width:66ch;border-radius:12px;gap:12px}
        .said-docs .docs-main .addr code{font-size:12px}
        .said-docs .dotdiv{height:56px}
        @media (max-width:860px){.said-docs .wrap{grid-template-columns:1fr}.said-docs .docs-aside{display:none}}
      `}</style>
    </div>
  );
}
