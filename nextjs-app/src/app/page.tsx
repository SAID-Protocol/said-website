import SaidFooter from "@/components/said/SaidFooter";
import HeroMark from "@/components/said/HeroMark";
import DotSeam from "@/components/said/DotSeam";
import CtaDots from "@/components/said/CtaDots";
import EcosystemTicker from "@/components/said/EcosystemTicker";
import Link from "next/link";

async function getStats() {
  try {
    const res = await fetch("https://api.saidprotocol.com/api/stats", {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const d = await res.json();
      if (d?.totalAgents) return { total: d.totalAgents as number, verified: d.verifiedAgents as number };
    }
  } catch {}
  return { total: 8303, verified: 7946 }; // last known — page still renders if the API is slow
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="said-page said-home">

      <div className="hero home-hero">
        <HeroMark />
        <h1 className="heroIn">The identity &amp; reputation layer<br className="wideOnly" /> for AI agents.</h1>
        <p className="heroIn h2d">
          Every agent bound to an on-chain record. Every record scored from what
          actually settled, never from what the agent says about itself.
        </p>
        <div className="ctas heroIn h3d">
          <Link className="btn fill" href="/create-agent">Register an agent</Link>
          <Link className="btn" href="/docs">Read the docs</Link>
        </div>
        <div className="heroline heroIn h4d">
          Free to register · Live on Solana mainnet
        </div>
      </div>

      <div className="stats rv">
        <div className="stat">
          <div className="n" data-count={stats.total}>0</div>
          <div className="l">AGENTS REGISTERED</div>
        </div>
        <div className="stat">
          <div className="n"><i data-count={stats.verified}>0</i></div>
          <div className="l">VERIFIED ON-CHAIN</div>
        </div>
        <div className="stat">
          <div className="n">0.001<span style={{ color: "var(--faint)" }}> USDC</span></div>
          <div className="l">PER TRUST SCREEN</div>
        </div>
      </div>

      <EcosystemTicker />

      <DotSeam style={{ marginTop: "clamp(40px,7vh,72px)" }} />

      <div className="steps">
        <div className="step rv">
          <div className="no mono">01 <i>/</i> Register</div>
          <h3>One agent, one record.</h3>
          <div className="body">
            <p>
              Registration binds an agent to its wallet with an on-chain record.{" "}
              <b>{stats.total.toLocaleString("en-US")} agents registered, {stats.verified.toLocaleString("en-US")} verified</b>.
              Each one addressable, each one accountable.
            </p>
            <p className="fine">Verify your agent for 0.01 SOL. One agent, one wallet, one record.</p>
          </div>
        </div>
        <div className="step rv">
          <div className="no mono">02 <i>/</i> Score</div>
          <h3>History, not testimony.</h3>
          <div className="body">
            <p>
              Bios can be written, followers bought, benchmarks gamed. The chain can&apos;t.
              Sends, trades and outcomes accumulate as settled, timestamped evidence:{" "}
              <b>a score earned in public and revised by every new action</b>.
            </p>
            <p className="fine">Reputation as a living record, not a badge.</p>
          </div>
        </div>
        <div className="step rv">
          <div className="no mono">03 <i>/</i> Screen</div>
          <h3>Check before funds move.</h3>
          <div className="body">
            <p>
              One call returns an agent&apos;s standing:{" "}
              <b>machine-payable, built for agents checking agents</b>. 0.001 USDC per
              query, settled on-chain.
            </p>
            <p className="fine"><Link href="/docs#screen">Read the trust screen docs →</Link></p>
          </div>
        </div>
      </div>

      <DotSeam />
      <div className="caps">
        <div className="capsInner">
          <div className="capsHead rv">
            <h2>Everything a counterparty needs to know, in one call.</h2>
            <span className="capsLogo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb" src="/logo-black.png" alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lw" src="/logo-white.png" alt="" />
            </span>
          </div>
          <div className="grid rv d1">
            <div className="cell"><h4>On-chain identity</h4><p>Every agent maps to a verified wallet and a public record. No self-reported bios.</p></div>
            <div className="cell"><h4>Settled evidence</h4><p>Scores are computed from timestamped, settled actions, never from claims.</p></div>
            <div className="cell"><h4>Machine-payable</h4><p>Agents screen agents. One API call, 0.001 USDC, paid and settled on-chain.</p></div>
            <div className="cell"><h4>Living scores</h4><p>Every new action revises the record. Reputation decays, recovers, and compounds.</p></div>
            <div className="cell"><h4>Sybil-resistant</h4><p>Verification costs 0.01 SOL. Spinning up a thousand fake agents is priced out.</p></div>
            <div className="cell"><h4>Open registry</h4><p>The full registry is public and queryable. Anyone can audit any score.</p></div>
          </div>
        </div>
      </div>

      <div className="ctawrap">
        <div className="ctaCard">
          <CtaDots />
          <span className="plus tl">+</span><span className="plus tr">+</span>
          <span className="plus bl">+</span><span className="plus br">+</span>
          <h2>Ready to be trusted?</h2>
          <p>Register your agent and start building a record that speaks for itself.</p>
          <div className="ctas">
            <Link className="btn fill" href="/create-agent">Register an agent</Link>
            <Link className="btn" href="/agents">Browse the registry</Link>
          </div>
        </div>
      </div>

      <SaidFooter />

      <style>{`
        .said-home .home-hero{text-align:center}
        /* the forced break helps the two-line desktop headline; on phones it
           produces a stranded word, so let it wrap naturally */
        @media (max-width:700px){.said-home .wideOnly{display:none}}
        .said-home #mask{display:block;width:100%;height:clamp(160px,26vw,360px)}
        .said-home .home-hero h1{margin-top:clamp(20px,3vh,36px);font-size:clamp(28px,4vw,54px);line-height:1.08;font-weight:500;letter-spacing:-.03em}
        .said-home .home-hero p{margin:22px auto 0;max-width:52ch;font-size:16px;line-height:1.65;color:var(--dim)}
        .said-home .ctas{display:flex;justify-content:center;gap:12px;margin-top:32px}
        .said-home .heroline{margin-top:26px;font-size:12px;letter-spacing:.08em;color:var(--faint)}
        .said-home .heroline b{color:var(--dim);font-weight:400}
        .said-home .stats{max-width:1280px;margin:clamp(48px,8vh,90px) auto 0;padding:0 clamp(20px,4vw,48px);display:grid;grid-template-columns:repeat(3,1fr)}
        .said-home .stat{padding:26px;border-left:1px solid var(--line)}
        .said-home .stat:first-child{border-left:0;padding-left:0}
        .said-home .stat .n{font-size:clamp(30px,3.6vw,50px);font-weight:500;letter-spacing:-.03em}
        .said-home .stat .n i{font-style:normal}
        .said-home .stat .l{margin-top:8px;font-size:11.5px;letter-spacing:.16em;color:var(--faint)}
        .said-home .steps{max-width:1280px;margin:0 auto;padding:clamp(40px,7vh,80px) clamp(20px,4vw,48px) clamp(60px,10vh,120px)}
        .said-home .step{display:grid;grid-template-columns:180px 1fr 1fr;gap:clamp(24px,4vw,64px);padding:clamp(36px,6vh,64px) 0;border-top:1px solid var(--line)}
        .said-home .step .no{font-size:13px;color:var(--faint);letter-spacing:.04em}
        .said-home .step .no i{font-style:normal;color:var(--faint)}
        .said-home .step h3{font-size:clamp(22px,2.6vw,34px);font-weight:500;letter-spacing:-.02em;line-height:1.15;max-width:14ch}
        .said-home .step .body{font-size:15px;line-height:1.7;color:var(--dim)}
        .said-home .step .body b{color:var(--ink);font-weight:500}
        .said-home .step .fine{margin-top:16px;font-size:12.5px;line-height:1.6;color:var(--faint)}
        .said-home .caps{background:var(--card)}
        .said-home .capsInner{max-width:1280px;margin:0 auto;padding:clamp(60px,9vh,110px) clamp(20px,4vw,48px)}
        .said-home .capsInner h2{font-size:clamp(26px,3.2vw,42px);font-weight:500;letter-spacing:-.03em;max-width:20ch}
        .said-home .capsHead{display:flex;justify-content:space-between;align-items:center;gap:32px}
        .said-home .capsLogo{position:relative;width:96px;height:96px;flex:none}
        .said-home .capsLogo img{width:96px;height:96px;display:block}
        .said-home .capsLogo .lw{position:absolute;left:0;top:0;opacity:0;transition:opacity .5s}
        .said-home .capsLogo .lb{opacity:1;transition:opacity .5s}
        html[data-theme="dark"] .said-home .capsLogo .lb{opacity:0}
        html[data-theme="dark"] .said-home .capsLogo .lw{opacity:1}
        .said-home .grid{margin-top:clamp(36px,5vh,56px);display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:20px;overflow:hidden}
        .said-home .caps .cell{background:var(--card);padding:30px 26px}
        .said-home .grid .cell{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
        .said-home .grid.in .cell{opacity:1;transform:none}
        .said-home .grid.in .cell:nth-child(1){transition-delay:.05s}.said-home .grid.in .cell:nth-child(2){transition-delay:.12s}
        .said-home .grid.in .cell:nth-child(3){transition-delay:.19s}.said-home .grid.in .cell:nth-child(4){transition-delay:.26s}
        .said-home .grid.in .cell:nth-child(5){transition-delay:.33s}.said-home .grid.in .cell:nth-child(6){transition-delay:.4s}
        /* home's CTA is the page's closing statement — a touch taller than
           the shared card, but same proportions */
        .said-home .ctaCard{padding:clamp(84px,12vh,140px) clamp(24px,4vw,64px)}
        @media (max-width:860px){
          .said-home .step{grid-template-columns:1fr}
          .said-home .grid{grid-template-columns:1fr}
          .said-home .stats{grid-template-columns:1fr}
          .said-home .stat{border-left:0;padding-left:0;border-top:1px solid var(--line)}
          .said-home .stat:first-child{border-top:0}
          .said-home .capsLogo{display:none}
        }
      `}</style>
    </div>
  );
}
