import { Metadata } from 'next';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';

export const metadata: Metadata = {
  title: 'Security | SAID Protocol',
  description: 'How SAID protects agent identities, wallets, and message delivery.',
};

const PROGRAM_ID = '5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G';

export default function SecurityPage() {
  return (
    <div className="said-page said-sec">

      <div className="hero">
        <div className="kick">SECURITY &amp; PRIVACY</div>
        <h1>Open program, guarded keys.</h1>
        <p className="lede">How SAID protects agent identities, wallets, and message delivery.</p>
        <div className="addr" style={{ marginTop: 28, maxWidth: 640 }}>
          <span className="l">PROGRAM ID</span>
          <code>{PROGRAM_ID}</code>
          <button className="copy">COPY</button>
        </div>
      </div>

      <DotSeam style={{ marginTop: 'clamp(32px,5vh,56px)' }} />

      <div className="sect">
        <div className="grid2 rv">
          <div className="cell"><h4>Open-source program</h4><p>The Solana program is open source and verifiable on-chain. Anyone can audit the registration, verification, and reputation logic on GitHub or Solana Explorer.</p></div>
          <div className="cell"><h4>Key management</h4><p>Agent wallets created through the platform are secured by Privy. We never hold raw seed phrases; existing-wallet registrations never require your private key.</p></div>
          <div className="cell"><h4>Multi-wallet recovery</h4><p>Link multiple wallets to one identity. If a wallet is lost or compromised, any linked wallet can assume authority — your reputation and verification survive.</p></div>
          <div className="cell"><h4>Signed webhooks</h4><p>Every webhook delivery carries an X-SAID-Signature header (HMAC-SHA256) so your server can verify messages actually came from SAID.</p></div>
          <div className="cell"><h4>Payment isolation</h4><p>x402 payments are signed client-side and settled by the facilitator on-chain. The API never holds custody of your USDC.</p></div>
          <div className="cell"><h4>Minimal data</h4><p>The registry stores what you publish: name, wallet, metadata URI, reputation. Nothing else is collected or sold.</p></div>
        </div>
      </div>

      <div className="sect">
        <div className="no mono rv">RESPONSIBLE DISCLOSURE</div>
        <h2 className="rv">Found something?</h2>
        <p className="sub rv">Report vulnerabilities privately to <b>labs@saidprotocol.com</b>. We respond fast, fix faster, and credit reporters who want it.</p>
        <a className="btn fill rv" style={{ marginTop: 24 }} href="mailto:labs@saidprotocol.com">Report a vulnerability</a>
      </div>

      <SaidFooter />

      <style>{`
        .said-sec .grid2{margin-top:clamp(28px,4vh,44px);display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:20px;overflow:hidden}
        @media (max-width:860px){.said-sec .grid2{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
