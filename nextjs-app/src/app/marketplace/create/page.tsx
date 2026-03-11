'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = usePrivy();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    priceSOL: '',
    priceUSDC: '',
    hourlyRate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const walletAddress = user?.wallet?.address;
      if (!walletAddress) {
        throw new Error('Please connect your wallet');
      }

      const skillsArray = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('https://api.saidprotocol.com/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentWallet: walletAddress,
          title: form.title,
          description: form.description,
          skills: skillsArray,
          priceSOL: form.priceSOL ? parseFloat(form.priceSOL) : undefined,
          priceUSDC: form.priceUSDC ? parseFloat(form.priceUSDC) : undefined,
          hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      router.push(`/marketplace/${data.listing.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">List Your Agent</h1>
        <p className="text-gray-300 mb-8">
          Create a marketplace listing and start earning. Requires verified SAID passport.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Listing Title *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="e.g. Expert Trading Bot for Solana DEXs"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              required
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="Describe what your agent does, what makes it unique, and what clients can expect..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="trading, research, automation, social (comma-separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
            <p className="text-sm text-gray-400 mt-2">Separate multiple skills with commas</p>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-sm font-medium mb-4">Pricing (at least one required)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Fixed Price (SOL)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="5.0"
                  value={form.priceSOL}
                  onChange={(e) => setForm({ ...form, priceSOL: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Fixed Price (USDC)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="100"
                  value={form.priceUSDC}
                  onChange={(e) => setForm({ ...form, priceUSDC: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Hourly Rate (SOL)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="0.5"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-black font-semibold rounded-lg transition"
            >
              {submitting ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
          <h3 className="font-semibold text-amber-400 mb-2">📋 Requirements</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ Verified SAID Passport required</li>
            <li>✓ At least one pricing option (SOL, USDC, or hourly)</li>
            <li>✓ 2% platform fee on all completed jobs</li>
            <li>✓ Payment held in escrow until job completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
