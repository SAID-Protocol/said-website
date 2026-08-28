'use client';

import { useState, useEffect } from 'react';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';

// No credentials live here any more. The password is checked and the upstream
// admin secret injected by /api/admin (server-side); the browser only ever
// holds an httpOnly session cookie it cannot read.

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

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');

  // Ask the server whether this browser already holds a valid session cookie.
  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (authed) fetchGrants();
     
  }, [authed]);

  const handleLogin = async () => {
    setPwError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setAuthed(true);
        setPassword('');
      } else {
        setPwError(data.error || 'Incorrect password');
      }
    } catch {
      setPwError('Could not reach the server. Try again.');
    }
  };

  const fetchGrants = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch('/api/admin/grants');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Don't render a failed request as "no applications" — that is exactly
        // how the query-param auth bug stayed invisible.
        setLoadError(
          res.status === 404
            ? 'The API rejected the admin secret (it answers 404 rather than 401 to hide the endpoint). Check ADMIN_SECRET on the API and SAID_ADMIN_SECRET here match.'
            : data.error || `Request failed (${res.status}).`
        );
        setApplications([]);
        return;
      }
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
      setLoadError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id + action);
    try {
      await fetch(`/api/admin/grants/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="said-page said-admin">
        <div className="gate">
          <div className="card">
            <h1 className="seclabel mono">ADMIN ACCESS</h1>
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {pwError && <p className="err">{pwError}</p>}
            <button className="btn fill" style={{ width: '100%', marginTop: 18 }} onClick={handleLogin}>
              Enter
            </button>
          </div>
        </div>
        <SaidFooter />
        <style>{adminStyles}</style>
      </div>
    );
  }

  const pending = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="said-page said-admin">
      <div className="hero">
        <div className="kick">INTERNAL · GRANT REVIEW</div>
        <h1>Grant applications</h1>
        <p className="lede">
          {applications.length} total · {pending} pending
        </p>
      </div>

      <div className="tools">
        <button className="btn" onClick={fetchGrants} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <DotSeam style={{ marginTop: 'clamp(20px,3vh,30px)' }} />

      <div className="adminwrap">
        {loading ? (
          <p className="empty mono">LOADING APPLICATIONS…</p>
        ) : loadError ? (
          <div className="loaderr">
            <span className="seclabel mono">COULD NOT LOAD APPLICATIONS</span>
            <p>{loadError}</p>
          </div>
        ) : applications.length === 0 ? (
          <p className="empty mono">NO APPLICATIONS YET.</p>
        ) : (
          <div className="applist">
            {applications.map((app) => {
              const open = expanded === app.id;
              return (
                <div key={app.id} className={`app${open ? ' open' : ''}`}>
                  <button className="apphead" onClick={() => setExpanded(open ? null : app.id)}>
                    <span className="appname">
                      <b>{app.agentName}</b>
                      <i className="mono">{new Date(app.createdAt).toLocaleDateString()}</i>
                    </span>
                    <span className="appwallet mono">
                      {app.walletAddress.slice(0, 6)}…{app.walletAddress.slice(-6)}
                    </span>
                    <span className="apphandle">{app.twitter ? `@${app.twitter.replace('@', '')}` : '—'}</span>
                    <span className="appamt mono">{app.fundingAmount} SOL/mo</span>
                    <span className={`status ${app.status}`}>{app.status.toUpperCase()}</span>
                    <span className="chev">{open ? '−' : '+'}</span>
                  </button>

                  {open && (
                    <div className="appbody">
                      <div className="fields">
                        <div>
                          <span className="seclabel mono">WHAT IT DOES</span>
                          <p>{app.description}</p>
                        </div>
                        <div>
                          <span className="seclabel mono">USE OF FUNDS</span>
                          <p>{app.useCase}</p>
                        </div>
                        <div>
                          <span className="seclabel mono">MILESTONES</span>
                          <p style={{ whiteSpace: 'pre-wrap' }}>{app.milestones}</p>
                        </div>
                        {app.teamBackground && (
                          <div>
                            <span className="seclabel mono">TEAM</span>
                            <p>{app.teamBackground}</p>
                          </div>
                        )}
                      </div>

                      {app.status === 'pending' && (
                        <div className="actions">
                          <button
                            className="btn fill"
                            onClick={() => handleAction(app.id, 'approve')}
                            disabled={!!actionLoading}
                          >
                            {actionLoading === app.id + 'approve' ? 'Approving…' : 'Approve'}
                          </button>
                          <button
                            className="btn danger"
                            onClick={() => handleAction(app.id, 'reject')}
                            disabled={!!actionLoading}
                          >
                            {actionLoading === app.id + 'reject' ? 'Rejecting…' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SaidFooter />
      <style>{adminStyles}</style>
    </div>
  );
}

const adminStyles = `
  .said-admin .gate{min-height:70vh;display:flex;align-items:center;justify-content:center;padding:40px 20px}
  .said-admin .gate .card{width:100%;max-width:360px;border:1px solid var(--line);border-radius:20px;padding:28px;background:var(--card)}
  .said-admin .seclabel{font-size:10.5px;letter-spacing:.16em;color:var(--faint);display:block}
  .said-admin .err{margin-top:10px;font-size:12.5px;color:#c0392b}
  .said-admin .tools{max-width:1100px;margin:clamp(20px,3vh,28px) auto 0;padding:0 clamp(20px,4vw,48px);display:flex;justify-content:flex-end}
  .said-admin .tools .btn{padding:10px 20px;font-size:13px}
  .said-admin .adminwrap{max-width:1100px;margin:0 auto;padding:clamp(20px,3vh,30px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
  .said-admin .loaderr{border:1px solid #c0392b;border-radius:16px;padding:22px 24px;background:var(--card)}
  .said-admin .loaderr p{margin-top:10px;font-size:13.5px;line-height:1.7;color:var(--dim);max-width:70ch}
  .said-admin .empty{padding:60px 0;text-align:center;font-size:12px;letter-spacing:.12em;color:var(--faint)}
  .said-admin .applist{display:grid;gap:10px}
  .said-admin .app{border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--card)}
  .said-admin .app.open{border-color:var(--ink)}
  .said-admin .apphead{width:100%;display:grid;grid-template-columns:1.4fr 1fr .9fr .9fr auto 24px;gap:14px;align-items:center;padding:15px 18px;background:none;border:0;font:inherit;text-align:left;cursor:pointer;color:var(--ink)}
  .said-admin .apphead:hover{background:var(--bg)}
  .said-admin .appname{display:flex;flex-direction:column;min-width:0}
  .said-admin .appname b{font-size:14.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .said-admin .appname i{font-style:normal;font-size:11px;color:var(--faint);margin-top:2px}
  .said-admin .appwallet,.said-admin .apphandle,.said-admin .appamt{font-size:12px;color:var(--dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .said-admin .status{font-size:9.5px;letter-spacing:.12em;border:1px solid var(--line);border-radius:99px;padding:5px 11px;color:var(--dim);font-family:ui-monospace,"SF Mono",Menlo,monospace;white-space:nowrap}
  .said-admin .status.approved{color:var(--good);border-color:var(--good)}
  .said-admin .status.rejected{color:#c0392b;border-color:#c0392b}
  .said-admin .chev{font-size:16px;color:var(--faint);text-align:center}
  .said-admin .appbody{padding:4px 18px 20px;border-top:1px solid var(--line)}
  .said-admin .fields{display:grid;grid-template-columns:1fr 1fr;gap:20px 26px;margin-top:18px}
  .said-admin .fields p{margin-top:7px;font-size:13.5px;line-height:1.7;color:var(--dim)}
  .said-admin .actions{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap}
  .said-admin .actions .btn{padding:11px 24px;font-size:13.5px}
  .said-admin .btn.danger{border-color:#c0392b;color:#c0392b}
  .said-admin .btn.danger:hover{background:#c0392b;color:var(--bg)}
  .said-admin .btn:disabled{opacity:.5;cursor:default}
  @media (max-width:860px){
    .said-admin .apphead{grid-template-columns:1fr auto 24px;gap:10px}
    .said-admin .appwallet,.said-admin .apphandle{display:none}
    .said-admin .fields{grid-template-columns:1fr}
  }
`;
