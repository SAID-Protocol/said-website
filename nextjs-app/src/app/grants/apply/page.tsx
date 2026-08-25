'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';

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
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="said-page">
        <SaidNav />
        <div className="hero" style={{ textAlign: 'center', minHeight: '55vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="kick">APPLICATION SUBMITTED</div>
          <h1>Thanks for applying.</h1>
          <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            We&apos;ll review your application and get back to you within 7 days.
          </p>
          <div style={{ marginTop: 32 }}>
            <Link className="btn fill" href="/token">Back to $SAID</Link>
          </div>
        </div>
        <SaidFooter />
      </div>
    );
  }

  return (
    <div className="said-page said-grants">
      <SaidNav />

      <div className="hero">
        <div className="kick">THE TREASURY · STREAMING GRANTS</div>
        <h1>Funding for agents that deliver.</h1>
        <p className="lede">Operational funding for verified AI agents. Streamed continuously, not lump sum — cancelable if delivery stops. Applications are free.</p>
      </div>
      <div className="facts">
        <span className="pill"><b>1–5 SOL/mo</b>Typical grant</span>
        <span className="pill"><b>3–6 months</b>Duration</span>
        <span className="pill"><b>Merit-based</b>No pay-to-win</span>
      </div>

      <DotSeam style={{ marginTop: 'clamp(32px,5vh,56px)' }} />

      <div className="sect">
        <div className="no mono rv">HOW IT WORKS</div>
        <div className="gsteps rv">
          <div className="gstep"><div className="gno mono">1</div><h4>Get verified</h4><p>Register your agent and get the verified badge (0.01 SOL).</p></div>
          <div className="gstep"><div className="gno mono">2</div><h4>Apply below</h4><p>Describe your agent, what it does, and your funding needs.</p></div>
          <div className="gstep"><div className="gno mono">3</div><h4>Review</h4><p>Selection based on quality, impact, and feasibility. Reviewed within 7 days.</p></div>
          <div className="gstep"><div className="gno mono">4</div><h4>Stream activated</h4><p>SOL vests continuously over the grant period.</p></div>
        </div>
      </div>

      <DotSeam />

      <form className="formwrap" onSubmit={handleSubmit}>
        <h2 className="rv">Apply</h2>
        <label>AGENT NAME</label>
        <input type="text" name="agentName" value={formData.agentName} onChange={handleChange} required placeholder="My Agent" />
        <label>VERIFIED WALLET ADDRESS</label>
        <input type="text" name="walletAddress" value={formData.walletAddress} onChange={handleChange} required className="mono" placeholder="Must hold the verified badge" />
        <div className="two">
          <div>
            <label>X HANDLE <b>· optional</b></label>
            <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="@handle" />
          </div>
          <div>
            <label>WEBSITE <b>· optional</b></label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://…" />
          </div>
        </div>
        <label>WHAT DOES YOUR AGENT DO?</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="What it does, who uses it, what's live today…" />
        <label>WHAT WOULD THE GRANT FUND?</label>
        <textarea name="useCase" value={formData.useCase} onChange={handleChange} required placeholder="Gas, RPC costs, compute, development…" />
        <div className="two">
          <div>
            <label>REQUESTED AMOUNT <b>· SOL per month</b></label>
            <input type="number" name="fundingAmount" value={formData.fundingAmount} onChange={handleChange} required min="0.5" max="5" step="0.5" placeholder="1–5" />
          </div>
          <div>
            <label>DURATION</label>
            <select name="fundingDuration" value={formData.fundingDuration} onChange={handleChange} required>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
            </select>
          </div>
        </div>
        <label>MILESTONES</label>
        <textarea name="milestones" value={formData.milestones} onChange={handleChange} required placeholder={'Month 1: Launch feature X\nMonth 2: Reach Y users\nMonth 3: Integrate with Z'} />
        <label>TEAM / BACKGROUND <b>· optional</b></label>
        <textarea name="teamBackground" value={formData.teamBackground} onChange={handleChange} placeholder="Who's building this? Any relevant experience?" />
        <div className="note"><b>Selection is merit-based.</b> Applications are free. Grants are cancelable anytime if the agent stops delivering.</div>
        <button className="btn fill" style={{ marginTop: 30 }} type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit application'}
        </button>
      </form>

      <SaidFooter />

      <style>{`
        .said-grants .facts{max-width:1280px;margin:clamp(24px,3vh,36px) auto 0;padding:0 clamp(20px,4vw,48px);display:flex;gap:12px;flex-wrap:wrap}
        .said-grants .gsteps{margin-top:clamp(28px,4vh,44px);display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,40px)}
        .said-grants .gstep .gno{font-size:12px;letter-spacing:.1em;color:var(--faint)}
        .said-grants .gstep h4{margin-top:10px;font-size:16px;font-weight:600}
        .said-grants .gstep p{margin-top:8px;font-size:13.5px;line-height:1.65;color:var(--dim)}
        .said-grants .formwrap{max-width:820px;margin:0 auto;padding:clamp(24px,4vh,36px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
        .said-grants .formwrap h2{font-size:clamp(22px,2.6vw,32px);font-weight:500;letter-spacing:-.02em}
        .said-grants .two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .said-grants .note{margin-top:26px;border:1px solid var(--line);border-radius:14px;padding:16px 18px;font-size:13px;line-height:1.65;color:var(--dim);background:var(--card)}
        .said-grants .note b{color:var(--ink);font-weight:500}
        @media (max-width:860px){.said-grants .gsteps{grid-template-columns:1fr;gap:28px}.said-grants .two{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
