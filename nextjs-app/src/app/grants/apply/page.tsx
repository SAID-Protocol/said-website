'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Navbar from '@/components/Navbar';
import AsciiBackground from '@/components/AsciiBackground';
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
      <div className="min-h-screen flex flex-col bg-black relative">
        <AsciiBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">Application Submitted</h1>
              <p className="text-zinc-400 mb-8">
                Thanks for applying! We&apos;ll review your application and get back to you within 7 days.
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
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 backdrop-blur-sm";

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 pt-32 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Apply for a Grant</h1>
            <p className="text-zinc-400 mb-8">
              Streaming grants for verified AI agents. 1-5 SOL/month for 3-6 months.
            </p>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-8">
              <h2 className="font-semibold text-white mb-3">Before you apply</h2>
              <ul className="text-zinc-400 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  Your agent must be registered on SAID Protocol
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  Verification badge recommended (0.01 SOL)
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  Applications are reviewed within 7 days
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  Grants are streamed, not lump sum — cancelable if you stop delivering
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Agent Name *</label>
                <input type="text" name="agentName" value={formData.agentName} onChange={handleChange} required className={inputClasses} placeholder="e.g. Kai" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Wallet Address *</label>
                <input type="text" name="walletAddress" value={formData.walletAddress} onChange={handleChange} required className={`${inputClasses} font-mono text-sm`} placeholder="Your Solana wallet address" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Twitter</label>
                  <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} className={inputClasses} placeholder="@handle" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Website</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClasses} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">What does your agent do? *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className={inputClasses} placeholder="Describe your agent's purpose and capabilities" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">How will you use the grant? *</label>
                <textarea name="useCase" value={formData.useCase} onChange={handleChange} required rows={3} className={inputClasses} placeholder="RPC costs, API fees, compute, etc." />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Requested Amount (SOL/month) *</label>
                  <input type="number" name="fundingAmount" value={formData.fundingAmount} onChange={handleChange} required min="0.5" max="5" step="0.5" className={inputClasses} placeholder="1-5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Duration (months) *</label>
                  <select name="fundingDuration" value={formData.fundingDuration} onChange={handleChange} required className={inputClasses}>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Milestones *</label>
                <textarea name="milestones" value={formData.milestones} onChange={handleChange} required rows={4} className={inputClasses} placeholder={"Month 1: Launch feature X\nMonth 2: Reach Y users\nMonth 3: Integrate with Z"} />
                <p className="text-zinc-500 text-sm mt-2">What will you deliver? Streams can be cancelled if milestones aren&apos;t met.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Team / Background</label>
                <textarea name="teamBackground" value={formData.teamBackground} onChange={handleChange} rows={3} className={inputClasses} placeholder="Who's building this? Any relevant experience?" />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <p className="text-zinc-500 text-sm text-center mt-4">Applications open when $SAID launches</p>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
