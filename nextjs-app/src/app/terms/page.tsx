import { Metadata } from 'next';
import SaidFooter from '@/components/said/SaidFooter';

export const metadata: Metadata = {
  title: 'Terms of Service | SAID Protocol',
  description: 'Terms of Service for SAID Protocol and SAID Hosting.',
};

export default function TermsPage() {
  return (
    <div className="said-page">
      <div className="hero">
        <div className="kick">LEGAL · LAST UPDATED MARCH 23, 2026</div>
        <h1>Terms of Service</h1>
      </div>
      <div className="prose">
        <h2>1. Overview</h2>
        <p>SAID Protocol (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides an on-chain identity protocol and AI agent hosting platform at saidprotocol.com and host.saidprotocol.com (the &quot;Service&quot;). By using our Service, you agree to these Terms.</p>
        <h2>2. Eligibility</h2>
        <p>You must be at least 18 years old to use the Service. By creating an account, you represent that you meet this requirement.</p>
        <h2>3. Accounts</h2>
        <p>You are responsible for maintaining the security of your account and wallet credentials. We use Privy for authentication and embedded wallets. You are responsible for all activity under your account.</p>
        <h2>4. Agent Hosting</h2>
        <ul>
          <li>Each hosted agent runs in an isolated container on dedicated infrastructure.</li>
          <li>Free trials last 7 days. After the trial, continued service requires payment.</li>
          <li>We reserve the right to suspend or terminate agents that violate these Terms, consume excessive resources, or are used for malicious purposes.</li>
          <li>You retain ownership of your agent&apos;s configuration and data. We do not claim intellectual property rights over your agent content.</li>
        </ul>
        <h2>5. Payments &amp; Billing</h2>
        <ul>
          <li>Payments are made in USDC on Solana. Prices are displayed in USD.</li>
          <li>Subscriptions are billed monthly per agent.</li>
          <li>API credits reset monthly and do not roll over.</li>
          <li>If payment is not received within the grace period, your agent may be suspended and API keys rotated.</li>
        </ul>
        <h2>6. Refund Policy</h2>
        <ul>
          <li><b>Free trial:</b> No payment required. Cancel anytime during the 7-day trial.</li>
          <li><b>First 7 days after first payment:</b> Full refund if the Service does not meet your expectations. Contact us at labs@saidprotocol.com.</li>
          <li><b>After 7 days:</b> No refunds for the current billing period. You may cancel at any time and your agent will remain active until the end of the paid period.</li>
          <li><b>Service outages:</b> If your agent experiences more than 24 hours of cumulative downtime in a billing period due to our infrastructure, you are eligible for a prorated credit.</li>
        </ul>
        <h2>7. Acceptable Use</h2>
        <p>You may not use the Service to:</p>
        <ul>
          <li>Conduct illegal activities or facilitate fraud</li>
          <li>Generate spam, phishing, or malicious content</li>
          <li>Attempt to access other users&apos; agents or data</li>
          <li>Run cryptocurrency mining or other resource-intensive operations unrelated to your agent</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>
        <h2>8. On-Chain Identity</h2>
        <p>SAID Protocol registers agent identities on Solana. On-chain data is public and immutable. You acknowledge that your agent&apos;s wallet address, registration status, and verification status are publicly visible on the blockchain.</p>
        <h2>9. Limitation of Liability</h2>
        <p>The Service is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to loss of funds, data, or business opportunities. Our total liability is limited to the amount you paid us in the 3 months preceding the claim.</p>
        <h2>10. Changes</h2>
        <p>We may update these Terms from time to time. We will notify users of material changes via email or platform notification. Continued use of the Service after changes constitutes acceptance.</p>
        <h2>11. Contact</h2>
        <p>Questions? Email us at <a href="mailto:labs@saidprotocol.com" style={{ borderBottom: '1px solid var(--line)' }}>labs@saidprotocol.com</a></p>
      </div>
      <SaidFooter />
    </div>
  );
}
