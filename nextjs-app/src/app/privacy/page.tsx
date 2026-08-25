import { Metadata } from 'next';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy | SAID Protocol',
  description: 'Privacy Policy for SAID Protocol and SAID Hosting.',
};

export default function PrivacyPage() {
  return (
    <div className="said-page">
      <SaidNav />
      <div className="hero">
        <div className="kick">LEGAL · LAST UPDATED MARCH 23, 2026</div>
        <h1>Privacy Policy</h1>
      </div>
      <div className="prose">
        <h2>1. What We Collect</h2>
        <ul>
          <li><b>Account information:</b> Email address and wallet address (via Privy authentication)</li>
          <li><b>Agent data:</b> Agent name, configuration, system prompts, and conversation history stored within your agent&apos;s container</li>
          <li><b>Payment data:</b> On-chain transaction signatures for USDC payments. We do not store credit card information.</li>
          <li><b>Usage data:</b> API request counts, billing cycle information, and agent health status</li>
        </ul>
        <h2>2. How We Use Your Data</h2>
        <ul>
          <li>To provide and maintain the Service</li>
          <li>To process payments and manage billing</li>
          <li>To register and verify your agent&apos;s on-chain identity</li>
          <li>To monitor agent health and infrastructure performance</li>
          <li>To communicate service updates and important notices</li>
        </ul>
        <h2>3. Agent Conversation Data</h2>
        <p>Your agent&apos;s conversations and memory files are stored within its isolated container and persistent volume. We do not read, analyze, or share your agent&apos;s conversation data. Agent data is only accessible to you through the dashboard or Telegram integration.</p>
        <h2>4. On-Chain Data</h2>
        <p>When your agent is registered on SAID Protocol, the following data is recorded on the Solana blockchain and is publicly visible:</p>
        <ul>
          <li>Agent wallet address</li>
          <li>Registration and verification status</li>
          <li>Metadata URI pointing to your agent&apos;s public profile</li>
          <li>NFT passport (if minted)</li>
        </ul>
        <p>Blockchain data is immutable and cannot be deleted.</p>
        <h2>5. Third-Party Services</h2>
        <ul>
          <li><b>Privy:</b> Authentication and embedded wallet management</li>
          <li><b>OpenRouter:</b> LLM API routing for agent intelligence</li>
          <li><b>Solana:</b> On-chain identity registration and payments</li>
          <li><b>Telegram:</b> Optional bot integration (only if you configure it)</li>
          <li><b>Railway:</b> Platform API hosting</li>
          <li><b>Hetzner:</b> Dedicated agent hosting infrastructure (EU and US)</li>
        </ul>
        <h2>6. Data Retention</h2>
        <ul>
          <li>Account data is retained while your account is active.</li>
          <li>Agent data is retained while your agent is deployed. When an agent is deleted, its container and persistent volume are removed.</li>
          <li>On-chain data persists indefinitely on Solana.</li>
          <li>Payment records are retained for accounting and legal purposes.</li>
        </ul>
        <h2>7. Your Rights</h2>
        <ul>
          <li><b>Access:</b> You can view all your agent data through the dashboard.</li>
          <li><b>Deletion:</b> You can delete your agents at any time. Contact us to delete your account entirely.</li>
          <li><b>Export:</b> Contact us to request an export of your data.</li>
        </ul>
        <h2>8. Security</h2>
        <p>We use isolated containers, encrypted connections (TLS), and hashed gateway tokens to protect your data. Each agent runs in its own sandboxed environment with dedicated resources. However, no system is 100% secure. You are responsible for securing your wallet credentials.</p>
        <h2>9. Changes</h2>
        <p>We may update this Privacy Policy from time to time. Material changes will be communicated via email or platform notification.</p>
        <h2>10. Contact</h2>
        <p>Privacy questions? Email <a href="mailto:labs@saidprotocol.com" style={{ borderBottom: '1px solid var(--line)' }}>labs@saidprotocol.com</a></p>
      </div>
      <SaidFooter />
    </div>
  );
}
