'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function GrantsApplyPage() {
  const { authenticated, login, ready } = usePrivy();
  const [formData, setFormData] = useState({
    agentName: '',
    walletAddress: '',
    twitter: '',
    website: '',
    description: '',
    useCase: '',
    fundingAmount: '',
    fundingDuration: '3',
    milestones: '',
    teamBackground: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Require authentication to apply for grants
  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
  }, [ready, authenticated, login]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://api.saidprotocol.com/api/grants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted</h1>
            <p className="text-zinc-400 mb-8">
              Thanks for applying! We'll review your application and get back to you within 7 days.
            </p>
            <a 
              href="/token" 
              className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              Back to $SAID
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Apply for a Grant</h1>
          <p className="text-zinc-400 mb-8">
            Streaming grants for verified AI agents. 1-5 SOL/month for 3-6 months.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-white mb-2">Before you apply</h2>
            <ul className="text-zinc-400 text-sm space-y-2">
              <li>✓ Your agent must be registered on SAID Protocol</li>
              <li>✓ Verification badge recommended (0.01 SOL)</li>
              <li>✓ Applications are reviewed within 7 days</li>
              <li>✓ Grants are streamed, not lump sum — cancelable if you stop delivering</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent Info */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="e.g. Kai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Wallet Address *
              </label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono text-sm"
                placeholder="Your Solana wallet address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  placeholder="@handle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                What does your agent do? *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="Describe your agent's purpose and capabilities"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                How will you use the grant? *
              </label>
              <textarea
                name="useCase"
                value={formData.useCase}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="RPC costs, API fees, compute, etc."
              />
            </div>

            {/* Funding */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Requested Amount (SOL/month) *
                </label>
                <input
                  type="number"
                  name="fundingAmount"
                  value={formData.fundingAmount}
                  onChange={handleChange}
                  required
                  min="0.5"
                  max="5"
                  step="0.5"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  placeholder="1-5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Duration (months) *
                </label>
                <select
                  name="fundingDuration"
                  value={formData.fundingDuration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                </select>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Milestones *
              </label>
              <textarea
                name="milestones"
                value={formData.milestones}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="Month 1: Launch feature X&#10;Month 2: Reach Y users&#10;Month 3: Integrate with Z"
              />
              <p className="text-zinc-500 text-sm mt-2">
                What will you deliver? Streams can be cancelled if milestones aren't met.
              </p>
            </div>

            {/* Team */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Team / Background
              </label>
              <textarea
                name="teamBackground"
                value={formData.teamBackground}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                placeholder="Who's building this? Any relevant experience?"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <p className="text-zinc-500 text-sm text-center mt-4">
                Applications open when $SAID launches
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
