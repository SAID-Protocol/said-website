import Link from 'next/link';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import CtaDots from '@/components/said/CtaDots';
import MarketCap from '@/components/MarketCap';

const TOKEN_ADDRESS = '4rWuWZei2iFNHYpnz5wjMeSvimsJcj5EgpSNvNS1pump';
const TREASURY = '2XfHTeNWTjNwUmgoXaafYuqHcAAXj8F5Kjw2Bnzi4FxH';

export default function TokenPage() {
  return (
    <div className="said-page said-token">
      <SaidNav />

      <div className="hero">
        <div className="kick">THE TOKEN · SOLANA</div>
        <h1>$SAID</h1>
        <p className="lede">Funding the AI agent ecosystem through streaming grants and sustainable treasury growth.</p>
        <div className="addr">
          <span className="l">TOKEN ADDRESS</span>
          <code>{TOKEN_ADDRESS}</code>
          <button className="copy">COPY</button>
        </div>
        <div style={{ marginTop: 16 }}><MarketCap tokenAddress={TOKEN_ADDRESS} /></div>
      </div>

      <DotSeam style={{ marginTop: 'clamp(32px,5vh,56px)' }} />

      <div className="sect">
        <div className="no mono rv">01 / TREASURY MECHANICS</div>
        <h2 className="rv">A treasury built to outlast the chart.</h2>
        <p className="sub rv">Funded by the initial <b>dev buy</b> and ongoing creator rewards from trading volume.</p>
        <div className="cellgrid rv tk">
          <div className="cell"><div className="pct">15%</div><h4>Locked for 1 year</h4><p>Long-term commitment. Cannot be sold or moved for 12 months.</p></div>
          <div className="cell"><div className="pct">10%</div><h4>Liquid treasury</h4><p>Immediate deployment for grants, LP provision, and development.</p></div>
          <div className="cell" style={{ gridColumn: '1/-1' }}>
            <h4>Ongoing creator rewards</h4>
            <p style={{ maxWidth: '64ch' }}>Trading volume generates creator rewards which flow to the treasury, funding ongoing development, agent grants, and ecosystem growth.</p>
          </div>
        </div>
        <p className="burnnote rv">
          <a href={`https://solscan.io/account/${TREASURY}`} target="_blank" rel="noopener noreferrer">
            Platform revenue on Solscan ↗
          </a>
        </p>
      </div>

      <div className="band">
        <div className="bandInner">
          <div className="no mono rv">02 / GRANTS PROGRAM</div>
          <h2 className="rv bandH2">Streamed, not lump sum.</h2>
          <p className="sub rv bandSub">
            Operational funding for verified AI agents. Streaming protects the treasury and
            ensures agents deliver consistent value.
          </p>
          <div className="gsteps rv">
            <div className="gstep"><div className="gno mono">1</div><h4>Get verified</h4><p>Register your agent and get the verified badge (0.01 SOL).</p></div>
            <div className="gstep"><div className="gno mono">2</div><h4>Apply</h4><p>Describe your agent, what it does, and your funding needs.</p></div>
            <div className="gstep"><div className="gno mono">3</div><h4>Review</h4><p>Selection based on quality, impact, and feasibility. Applications are free.</p></div>
            <div className="gstep"><div className="gno mono">4</div><h4>Stream activated</h4><p>SOL vests continuously over the grant period. Cancelable if delivery stops.</p></div>
          </div>
          <div className="gfacts rv">
            <span className="pill"><b>1–5 SOL/mo</b>Typical grant</span>
            <span className="pill"><b>3–6 months</b>Duration</span>
            <span className="pill"><b>Merit-based</b>No pay-to-win</span>
          </div>
          <Link className="btn fill rv" style={{ marginTop: 32 }} href="/grants/apply">Apply for a grant</Link>
        </div>
      </div>

      <div className="sect">
        <div className="no mono rv">03 / WHY THIS MATTERS</div>
        <div className="why rv">
          <div><h4>Lower barriers</h4><p>Operational funding removes financial friction. Build great agents without worrying about gas fees and RPC costs.</p></div>
          <div><h4>Self-sustaining</h4><p>More trading, bigger treasury, more funded agents, more adoption. The flywheel compounds.</p></div>
          <div><h4>Merit-based</h4><p>Applications are free. Selection is based on quality, impact, and what you&apos;re building.</p></div>
        </div>
      </div>

      <div className="ctawrap">
        <div className="ctaCard">
          <CtaDots />
          <span className="plus tl">+</span><span className="plus tr">+</span>
          <span className="plus bl">+</span><span className="plus br">+</span>
          <h2>Build on the treasury.</h2>
          <p>Verified agents can apply for streaming grants today. Free to apply, streamed on approval.</p>
          <div className="ctas">
            <Link className="btn fill" href="/grants/apply">Apply for a grant</Link>
            <Link className="btn" href="/create-agent">Register an agent</Link>
          </div>
        </div>
      </div>

      <SaidFooter />

      <style>{`
        .said-token .hero h1{font-size:clamp(34px,4.6vw,64px)}
        .said-token .addr{margin-top:28px;max-width:640px}
        .said-token .burnrow{margin-top:clamp(28px,4vh,44px);display:grid;grid-template-columns:repeat(3,1fr)}
        .said-token .burn{padding:0 26px;border-left:1px solid var(--line)}
        .said-token .burn:first-child{border-left:0;padding-left:0}
        .said-token .burn .n{font-size:clamp(28px,3.2vw,44px);font-weight:500;letter-spacing:-.03em}
        .said-token .burn .l{margin-top:8px;font-size:11.5px;letter-spacing:.16em;color:var(--faint)}
        .said-token .burnnote{margin-top:26px;font-size:13px;color:var(--faint);line-height:1.7;max-width:60ch}
        .said-token .burnnote a{color:var(--dim);border-bottom:1px solid var(--line)}
        .said-token .burnnote a:hover{color:var(--ink);border-color:var(--ink)}
        .said-token .cellgrid.tk{margin-top:clamp(28px,4vh,44px);grid-template-columns:1fr 1fr}
        .said-token .cellgrid.tk .cell{padding:32px 30px}
        .said-token .cell .pct{font-size:clamp(30px,3.4vw,46px);font-weight:500;letter-spacing:-.03em}
        .said-token .cell h4{margin-top:10px;font-size:15px;font-weight:600}
        .said-token .bandH2{margin-top:12px;font-size:clamp(26px,3.2vw,42px);font-weight:500;letter-spacing:-.03em;max-width:22ch}
        .said-token .bandSub{margin-top:12px;font-size:15px;line-height:1.7;color:var(--dim);max-width:56ch}
        .said-token .gsteps{margin-top:clamp(28px,4vh,44px);display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,40px)}
        .said-token .gstep .gno{font-size:12px;letter-spacing:.1em;color:var(--faint)}
        .said-token .gstep h4{margin-top:10px;font-size:16px;font-weight:600}
        .said-token .gstep p{margin-top:8px;font-size:13.5px;line-height:1.65;color:var(--dim)}
        .said-token .gfacts{margin-top:clamp(28px,4vh,40px);display:flex;gap:12px;flex-wrap:wrap}
        .said-token .why{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,4vw,56px);margin-top:clamp(28px,4vh,44px)}
        .said-token .why h4{font-size:16px;font-weight:600}
        .said-token .why p{margin-top:8px;font-size:14px;line-height:1.7;color:var(--dim)}
        @media (max-width:860px){
          .said-token .burnrow,.said-token .why,.said-token .gsteps{grid-template-columns:1fr}
          .said-token .cellgrid.tk{grid-template-columns:1fr}
          .said-token .burn{border-left:0;border-top:1px solid var(--line);padding:18px 0}
          .said-token .burn:first-child{border-top:0}
          .said-token .gsteps{gap:28px}
        }
      `}</style>
    </div>
  );
}
