import { Metadata } from 'next';
import HostNavbar from '@/components/HostNavbar';
import AsciiBackground from '@/components/AsciiBackground';

export const metadata: Metadata = {
  title: 'Privacy Policy | SAID Protocol',
  description: 'Privacy Policy for SAID Protocol and SAID Hosting.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <AsciiBackground />
      <div className="relative z-10">
        <HostNavbar />
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-zinc-500 mb-10">Last updated: March 23, 2026</p>

        <div className="space-y-8 text-zinc-300 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. What We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account information:</strong> Email address and wallet address (via Privy authentication)</li>
              <li><strong>Agent data:</strong> Agent name, configuration, system prompts, and conversation history stored within your agent&apos;s container</li>
              <li><strong>Payment data:</strong> On-chain transaction signatures for USDC payments. We do not store credit card information.</li>
              <li><strong>Usage data:</strong> API request counts, billing cycle information, and agent health status</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain the Service</li>
              <li>To process payments and manage billing</li>
              <li>To register and verify your agent&apos;s on-chain identity</li>
              <li>To monitor agent health and infrastructure performance</li>
              <li>To communicate service updates and important notices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Agent Conversation Data</h2>
            <p>Your agent&apos;s conversations and memory files are stored within its isolated container and persistent volume. We do not read, analyze, or share your agent&apos;s conversation data. Agent data is only accessible to you through the dashboard or Telegram integration.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. On-Chain Data</h2>
            <p>When your agent is registered on SAID Protocol, the following data is recorded on the Solana blockchain and is publicly visible:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Agent wallet address</li>
              <li>Registration and verification status</li>
              <li>Metadata URI pointing to your agent&apos;s public profile</li>
              <li>NFT passport (if minted)</li>
            </ul>
            <p className="mt-2">Blockchain data is immutable and cannot be deleted.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Privy:</strong> Authentication and embedded wallet management</li>
              <li><strong>OpenRouter:</strong> LLM API routing for agent intelligence</li>
              <li><strong>Solana:</strong> On-chain identity registration and payments</li>
              <li><strong>Telegram:</strong> Optional bot integration (only if you configure it)</li>
              <li><strong>Railway:</strong> Platform API hosting</li>
              <li><strong>Hetzner:</strong> Dedicated agent hosting infrastructure (EU and US)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Account data is retained while your account is active.</li>
              <li>Agent data is retained while your agent is deployed. When an agent is deleted, its container and persistent volume are removed.</li>
              <li>On-chain data persists indefinitely on Solana.</li>
              <li>Payment records are retained for accounting and legal purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> You can view all your agent data through the dashboard.</li>
              <li><strong>Deletion:</strong> You can delete your agents at any time. Contact us to delete your account entirely.</li>
              <li><strong>Export:</strong> Contact us to request an export of your data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Security</h2>
            <p>We use isolated containers, encrypted connections (TLS), and hashed gateway tokens to protect your data. Each agent runs in its own sandboxed environment with dedicated resources. However, no system is 100% secure. You are responsible for securing your wallet credentials.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes</h2>
            <p>We may update this Privacy Policy from time to time. Material changes will be communicated via email or platform notification.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>Privacy questions? Email <a href="mailto:labs@saidprotocol.com" className="text-amber-400 hover:text-amber-300">labs@saidprotocol.com</a></p>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
}
