'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ADMIN_SECRET = 'temp-link-2026';
const ADMIN_PASSWORD = 'said-admin-2026';
const API = 'https://api.saidprotocol.com';

interface GrantApplication {
  id: string;
  agentName: string;
  walletAddress: string;
  twitter?: string;
  website?: string;
  description: string;
  useCase: string;
  fundingAmount: string;
  fundingDuration: string;
  milestones: string;
  teamBackground?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
  approved: 'bg-green-900/40 text-green-400 border-green-700/50',
  rejected: 'bg-red-900/40 text-red-400 border-red-700/50',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('said-admin') === 'true') {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchGrants();
  }, [authed]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('said-admin', 'true');
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Incorrect password');
    }
  };

  const fetchGrants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/grants?secret=${ADMIN_SECRET}`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id + action);
    try {
      await fetch(`${API}/admin/grants/${id}/${action}`, {
        method: 'POST',
        headers: { 'x-admin-secret': ADMIN_SECRET, 'Content-Type': 'application/json' },
      });
      await fetchGrants();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm p-8 bg-gray-950 border border-gray-800 rounded-xl">
            <h1 className="text-xl font-bold mb-6 text-center">Admin Access</h1>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-gray-500"
            />
            {pwError && <p className="text-red-400 text-sm mb-3">{pwError}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Enter
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 pt-28 sm:pt-32 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Grant Applications</h1>
            <p className="text-gray-500 mt-1">{applications.length} total · {applications.filter(a => a.status === 'pending').length} pending</p>
          </div>
          <button onClick={fetchGrants} className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-lg transition-colors">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No applications yet</div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-900/30 transition-colors"
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                >
                  <div className="flex-1 grid grid-cols-5 gap-4 items-center text-sm">
                    <div>
                      <div className="font-semibold">{app.agentName}</div>
                      <div className="text-gray-500 text-xs">{new Date(app.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-gray-400 font-mono text-xs truncate">
                      {app.walletAddress.slice(0, 8)}...{app.walletAddress.slice(-6)}
                    </div>
                    <div className="text-gray-400 text-xs">{app.twitter ? `@${app.twitter.replace('@', '')}` : '—'}</div>
                    <div className="font-mono text-green-400 text-xs">${app.fundingAmount}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs border font-medium ${STATUS_STYLES[app.status] || STATUS_STYLES.pending}`}>
                      {app.status}
                    </span>
                  </div>
                  <span className="text-gray-600 text-xs">{expanded === app.id ? '▲' : '▼'}</span>
                </div>

                {expanded === app.id && (
                  <div className="px-4 pb-4 border-t border-gray-800 pt-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase mb-1">Description</div>
                        <p className="text-sm text-gray-300">{app.description}</p>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase mb-1">Use Case</div>
                        <p className="text-sm text-gray-300">{app.useCase}</p>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase mb-1">Milestones</div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{app.milestones}</p>
                      </div>
                      {app.teamBackground && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase mb-1">Team Background</div>
                          <p className="text-sm text-gray-300">{app.teamBackground}</p>
                        </div>
                      )}
                    </div>
                    {app.status === 'pending' && (
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => handleAction(app.id, 'approve')}
                          disabled={!!actionLoading}
                          className="px-5 py-2 bg-green-800 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === app.id + 'approve' ? 'Approving...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'reject')}
                          disabled={!!actionLoading}
                          className="px-5 py-2 bg-red-900 hover:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === app.id + 'reject' ? 'Rejecting...' : '✗ Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
