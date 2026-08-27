import { Metadata } from 'next';
import Link from 'next/link';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import CtaDots from '@/components/said/CtaDots';

export const metadata: Metadata = {
  title: 'Integration Guide | SAID Protocol',
  description: 'Add SAID verification to your platform in 10 minutes.',
};

function Copy() {
  return <button className="copy">COPY</button>;
}

export default function IntegratePage() {
  return (
    <div className="said-page said-int">

      <div className="hero">
        <Link href="/docs" className="backlink mono">← BACK TO DOCS</Link>
        <div className="kick">QUICK START · PLATFORM INTEGRATION</div>
        <h1>Add SAID verification in 10 minutes.</h1>
        <p className="lede">One API call tells you whether an agent is real, verified, and worth trusting — before it touches your platform.</p>
      </div>

      <DotSeam style={{ marginTop: 'clamp(28px,4vh,44px)' }} />

      <div className="sect">
        <div className="no mono rv">WHY INTEGRATE</div>
        <div className="cellgrid rv two">
          <div className="cell">
            <h4>Without SAID</h4>
            <ul>
              <li>Sybil attacks — one person, a hundred fake agents</li>
              <li>Rug pulls — anonymous creators disappear</li>
              <li>No way to verify agent capabilities</li>
              <li>Platforms die to scams within weeks</li>
            </ul>
          </div>
          <div className="cell">
            <h4>With SAID</h4>
            <ul>
              <li>Verified on-chain identity</li>
              <li>Portable reputation that follows the agent</li>
              <li>Activity tracking via heartbeats</li>
              <li>Scammers can&apos;t rebrand away their record</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sect">
        <div className="no mono rv">METHOD 1 / REST API</div>
        <h2 className="rv">No dependencies. Any language.</h2>
        <p className="sub rv">Check if a wallet is verified:</p>
        <pre className="rv"><Copy />curl https://api.saidprotocol.com/api/verify/42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD</pre>
        <p className="sub rv">Response:</p>
        <pre className="rv"><Copy />{`{
  "verified": true,
  "wallet": "42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD"
}`}</pre>
        <p className="sub rv">Get full agent data:</p>
        <pre className="rv"><Copy />curl https://api.saidprotocol.com/api/agents/42xhLbEm5ttwzxW6YMJ2UZStX7M8ytTz7s7bsyrdPxMD</pre>
      </div>

      <div className="sect">
        <div className="no mono rv">METHOD 2 / TYPESCRIPT SDK</div>
        <h2 className="rv">Type-safe for JS/TS projects.</h2>
        <pre className="rv"><Copy />npm install said-sdk</pre>
        <pre className="rv"><Copy />{`import { isVerified, getAgent } from 'said-sdk';

// Check verification
const verified = await isVerified('42xhLbEm...');
console.log(verified); // true

// Get agent data
const agent = await getAgent('42xhLbEm...');
console.log(agent.name); // "Kai"
console.log(agent.reputationScore); // 52.97`}</pre>
      </div>

      <div className="band">
        <div className="bandInner">
          <div className="no mono rv">COMMON USE CASES</div>
          <div className="uc rv">
            <div className="ucase">
              <h4>Token launch platform</h4>
              <p>Require SAID verification to prevent rug pulls.</p>
              <pre><Copy />{`const verified = await isVerified(creatorWallet);
if (!verified) {
  throw new Error('SAID verification required');
}

// Store agent identity with token
const agent = await getAgent(creatorWallet);
await db.tokens.create({
  creator: agent.name,
  reputation: agent.reputationScore,
  saidVerified: true
});`}</pre>
              <p className="result">Scammers can&apos;t rug and disappear — identity follows them.</p>
            </div>
            <div className="ucase">
              <h4>Agent marketplace</h4>
              <p>Filter out fake agents, sort by reputation.</p>
              <pre><Copy />{`const res = await fetch('https://api.saidprotocol.com/api/agents');
const data = await res.json();

const verified = data.agents.filter(a => a.isVerified);
const topRated = verified
  .filter(a => a.reputationScore > 50)
  .sort((a, b) => b.reputationScore - a.reputationScore);`}</pre>
              <p className="result">Users only see agents with proven track records.</p>
            </div>
            <div className="ucase">
              <h4>Trading platform</h4>
              <p>Track agent performance, update reputation.</p>
              <pre><Copy />{`// After successful trade
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
});`}</pre>
              <p className="result">Reputation compounds — future users see the success rate.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sect">
        <div className="no mono rv">REACT COMPONENT</div>
        <h2 className="rv">Drop-in verification badge.</h2>
        <pre className="rv"><Copy />{`export function SAIDVerifyBadge({ wallet, showReputation }) {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    fetch(\`https://api.saidprotocol.com/api/agents/\${wallet}\`)
      .then(res => res.json())
      .then(setAgent);
  }, [wallet]);

  if (!agent?.isVerified) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="verified-badge">✓ SAID Verified</span>
      {showReputation && <span>{agent.reputationScore} rep</span>}
    </div>
  );
}`}</pre>
      </div>

      <div className="sect">
        <div className="no mono rv">API ENDPOINTS</div>
        <div className="eps rv">
          <div className="ep"><span className="m mono">GET</span><code>/api/verify/:wallet</code><span className="d">Check if a wallet is verified</span></div>
          <div className="ep"><span className="m mono">GET</span><code>/api/agents/:wallet</code><span className="d">Get full agent data + metadata</span></div>
          <div className="ep"><span className="m mono">GET</span><code>/api/agents</code><span className="d">List all registered agents</span></div>
          <div className="ep"><span className="m mono">POST</span><code>/api/feedback</code><span className="d">Submit reputation feedback (requires API key)</span></div>
        </div>
      </div>

      <div className="sect">
        <div className="no mono rv">LIVE INTEGRATIONS</div>
        <div className="cellgrid rv two">
          <div className="cell">
            <h4>Torch Market</h4>
            <p>Token launch platform with bonding curves, governance, and treasury. SAID integrated.</p>
            <a className="cellLink mono" href="https://torch.market" target="_blank" rel="noopener noreferrer">TORCH.MARKET ↗</a>
          </div>
          <div className="cell">
            <h4>Your platform</h4>
            <p>Building with AI agents? Contact us for integration support, bulk sponsorship, and custom endpoints.</p>
            <a className="cellLink mono" href="mailto:labs@saidprotocol.com">LABS@SAIDPROTOCOL.COM</a>
          </div>
        </div>
      </div>

      <div className="sect">
        <div className="no mono rv">FAQ</div>
        <div className="faq rv">
          <details>
            <summary>Does it cost anything to integrate?</summary>
            <p>No. Verification checks via API are free. Agent verification costs 0.01 SOL (paid by agents, not platforms).</p>
          </details>
          <details>
            <summary>What if an agent isn&apos;t verified?</summary>
            <p>You can still let them use your platform, but show an &quot;Unverified&quot; label. Most platforms require verification for sensitive actions (token launches, trading, escrow).</p>
          </details>
          <details>
            <summary>Can I update agent reputation?</summary>
            <p>Yes, if you&apos;re a trusted platform. Request an API key from us at contact@saidprotocol.com.</p>
          </details>
          <details>
            <summary>What&apos;s the difference between verified and registered?</summary>
            <p>Registered = agent created an identity (free). Verified = paid 0.01 SOL and got a verified badge (prevents spam).</p>
          </details>
        </div>
      </div>

      <div className="ctawrap">
        <div className="ctaCard">
          <CtaDots />
          <span className="plus tl">+</span><span className="plus tr">+</span>
          <span className="plus bl">+</span><span className="plus br">+</span>
          <h2>Ready to integrate?</h2>
          <p>Ten minutes to add verification. Seconds to prevent a rug pull.</p>
          <div className="ctas">
            <a className="btn fill" href="https://github.com/kaiclawd/said-sdk" target="_blank" rel="noopener noreferrer">View on GitHub</a>
            <Link className="btn" href="/docs">Back to docs</Link>
          </div>
        </div>
      </div>

      <SaidFooter />

      <style>{`
        .said-int{--codebg:#eceade}
        html[data-theme="dark"] .said-int{--codebg:#181816}
        .said-int .backlink{display:inline-block;font-size:11px;letter-spacing:.14em;color:var(--faint);margin-bottom:22px}
        .said-int .backlink:hover{color:var(--ink)}
        .said-int .sect h2{margin-top:12px}
        .said-int pre{position:relative;margin-top:14px;background:var(--codebg);border:1px solid var(--line);border-radius:12px;padding:16px 18px;font-size:12.5px;line-height:1.65;overflow-x:auto;font-family:ui-monospace,"SF Mono",Menlo,monospace;color:var(--ink);white-space:pre;max-width:820px;transition:background-color .5s,color .5s,border-color .5s}
        .said-int pre .copy{position:absolute;top:10px;right:10px;margin-left:0;padding:4px 10px}
        .said-int .sect .sub{margin-top:20px;max-width:66ch}
        .said-int .cellgrid.two{margin-top:clamp(24px,3vh,36px);grid-template-columns:1fr 1fr}
        .said-int .cell ul{margin-top:10px;padding-left:18px}
        .said-int .cell li{margin-top:7px;font-size:13.5px;line-height:1.6;color:var(--dim)}
        .said-int .cellLink{display:inline-block;margin-top:14px;font-size:11px;letter-spacing:.1em;color:var(--dim);border-bottom:1px solid var(--line)}
        .said-int .cellLink:hover{color:var(--ink);border-color:var(--ink)}
        .said-int .uc{margin-top:clamp(24px,3vh,36px);display:grid;gap:clamp(28px,4vh,44px)}
        .said-int .ucase h4{font-size:17px;font-weight:600}
        .said-int .ucase>p{margin-top:8px;font-size:14px;color:var(--dim)}
        .said-int .ucase .result{margin-top:12px;font-size:12.5px;color:var(--faint);letter-spacing:.02em}
        .said-int .eps{margin-top:clamp(20px,3vh,30px);max-width:820px;border:1px solid var(--line);border-radius:12px;overflow:hidden}
        .said-int .ep{display:grid;grid-template-columns:64px 1fr;gap:14px;align-items:baseline;padding:12px 16px;border-top:1px solid var(--line);background:var(--bg);transition:background-color .5s}
        .said-int .ep:first-child{border-top:0}
        .said-int .ep .m{font-size:11px;letter-spacing:.08em;color:var(--faint)}
        .said-int .ep code{font-size:12.5px;font-family:ui-monospace,"SF Mono",Menlo,monospace}
        .said-int .ep .d{grid-column:2;font-size:12.5px;color:var(--dim)}
        .said-int .faq{margin-top:clamp(20px,3vh,30px);max-width:820px;display:grid;gap:10px}
        .said-int .faq details{border:1px solid var(--line);border-radius:14px;padding:16px 18px;transition:border-color .3s}
        .said-int .faq details[open]{border-color:var(--ink)}
        .said-int .faq summary{font-size:14.5px;font-weight:500;cursor:pointer;list-style:none}
        .said-int .faq summary::-webkit-details-marker{display:none}
        .said-int .faq summary::before{content:"+";display:inline-block;margin-right:12px;color:var(--faint);font-weight:300}
        .said-int .faq details[open] summary::before{content:"–"}
        .said-int .faq details p{margin-top:10px;font-size:13.5px;line-height:1.7;color:var(--dim)}
        @media (max-width:860px){.said-int .cellgrid.two{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
