'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SaidNav from '@/components/said/SaidNav';
import SaidFooter from '@/components/said/SaidFooter';
import DotSeam from '@/components/said/DotSeam';
import ShimmerDots from '@/components/said/ShimmerDots';
import { useAuth } from '@/hooks/useAuth';
import { fetchMyAgents, fetchAgentKey, rotateAgentKey } from '@/lib/my-agents';
import { readCache, writeCache } from '@/lib/cache';
import { API_URL } from '@/lib/api';

interface CachedProfile {
  displayName: string;
  username: string;
  avatarUrl: string;
  agentCount: number;
  verifiedCount: number;
  memberSince: string;
  apiKeys: Array<{ agentId: string; agentName: string; key: string }>;
}

interface ApiKeyEntry {
  agentId: string;
  agentName: string;
  key: string;
  revealed: boolean;
}

export default function ProfilePage() {
  const { authenticated, user, login } = usePrivy();
  const { sessionToken, privyAccessToken } = useAuth();
  const [agentCount, setAgentCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [feedbackGiven] = useState(0);
  const [memberSince, setMemberSince] = useState('');
  const [loading, setLoading] = useState(true);

  // Profile data from database
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const email = user?.email?.address;

  useEffect(() => {
    if (!sessionToken) { setLoading(false); return; }

    // Paint last-known data on the first frame, then revalidate behind it.
    const cached = readCache<CachedProfile>('profile', sessionToken);
    if (cached) {
      setDisplayName(cached.displayName);
      setUsername(cached.username);
      setAvatarUrl(cached.avatarUrl);
      setAgentCount(cached.agentCount);
      setVerifiedCount(cached.verifiedCount);
      setMemberSince(cached.memberSince);
      setApiKeys(cached.apiKeys.map((k) => ({ ...k, revealed: false })));
      setLoading(false);
    }
    loadProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  const loadProfileData = async () => {
    await Promise.all([fetchUserProfile(), fetchAgentStats()]);
    setLoading(false);
  };

  // Snapshot whatever is currently rendered so the next visit paints instantly.
  useEffect(() => {
    if (!sessionToken || loading || !displayName) return;
    writeCache<CachedProfile>('profile', sessionToken, {
      displayName, username, avatarUrl, agentCount, verifiedCount, memberSince,
      apiKeys: apiKeys.map(({ agentId, agentName, key }) => ({ agentId, agentName, key })),
    });
  }, [sessionToken, loading, displayName, username, avatarUrl, agentCount, verifiedCount, memberSince, apiKeys]);

  const fetchUserProfile = async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        setDisplayName(u.displayName || email?.split('@')[0] || 'Anonymous');
        setUsername(u.username || email?.split('@')[0] || 'anonymous');
        setAvatarUrl(u.avatarUrl || '');
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setDisplayName(email?.split('@')[0] || 'Anonymous');
      setUsername(email?.split('@')[0] || 'anonymous');
    }
  };

  const fetchAgentStats = async () => {
    if (!sessionToken) return;
    try {
      const privyToken = privyAccessToken ? await privyAccessToken() : null;
      const agents = await fetchMyAgents(sessionToken, privyToken);

      setAgentCount(agents.length);
      setVerifiedCount(agents.filter((a) => a.isVerified).length);

      // "Member since" = the oldest agent registration we can see.
      const dated = agents.map((a) => a.registeredAt).filter(Boolean) as string[];
      if (dated.length > 0) {
        const oldest = dated.reduce((a, b) => (new Date(a) < new Date(b) ? a : b));
        setMemberSince(
          new Date(oldest).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        );
      }

      // Keys live on the hosting API only, and only hosted agents have one.
      const entries = await Promise.all(
        agents
          .filter((a) => a.source === 'hosted')
          .map(async (agent) => {
            const key = agent.gatewayToken ?? (await fetchAgentKey(agent.id, privyToken));
            return key
              ? { agentId: agent.id, agentName: agent.name, key, revealed: false }
              : null;
          })
      );
      setApiKeys(entries.filter(Boolean) as ApiKeyEntry[]);
    } catch (err) {
      console.error('Failed to fetch agent stats:', err);
    }
  };

  const rotateProfileKey = async (agentId: string) => {
    if (!confirm('This will invalidate the old API key. Any integrations using it will stop working. Continue?')) return;
    const privyToken = privyAccessToken ? await privyAccessToken() : null;
    const rotated = await rotateAgentKey(agentId, privyToken);
    if (rotated) {
      setApiKeys((prev) => prev.map((k) => (k.agentId === agentId ? { ...k, key: rotated } : k)));
    }
  };

  const handleEditClick = () => {
    setEditDisplayName(displayName);
    setEditUsername(username);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!sessionToken) {
      alert('Session expired. Please refresh and try again.');
      return;
    }
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ displayName: editDisplayName, username: editUsername }),
      });
      const data = await res.json();

      if (res.ok) {
        setDisplayName(data.user?.displayName || editDisplayName);
        setUsername(data.user?.username || editUsername);
        setSaveSuccess(true);
        setTimeout(() => { setIsEditing(false); setSaveSuccess(false); }, 1000);
      } else {
        console.error('Profile save failed:', data);
        if (data.error?.includes('username') || data.error?.includes('Unique constraint')) {
          alert('Username already taken. Please choose another.');
        } else {
          alert(data.error || 'Failed to update profile');
        }
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionToken) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 500000) {
      alert('Image too large. Please select an image under 500KB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ avatarUrl: base64 }),
        });
        if (res.ok) {
          const data = await res.json();
          setAvatarUrl(data.user.avatarUrl || base64);
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to upload avatar');
        }
        setUploadingAvatar(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      alert('Failed to upload avatar');
      setUploadingAvatar(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="said-page said-me">
        <SaidNav />
        <div className="hero" style={{ textAlign: 'center', minHeight: '52vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="kick">YOUR ACCOUNT</div>
          <h1>Sign in to view your profile.</h1>
          <div style={{ marginTop: 28 }}>
            <button className="btn fill" onClick={login}>Log in</button>
          </div>
        </div>
        <SaidFooter />
        <style>{meStyles}</style>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="said-page said-me">
        <SaidNav />
        <div className="hero" style={{ textAlign: 'center', minHeight: '52vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="mono" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--faint)' }}>LOADING PROFILE…</p>
        </div>
        <SaidFooter />
        <style>{meStyles}</style>
      </div>
    );
  }

  return (
    <div className="said-page said-me">
      <SaidNav />

      <main className="mewrap">
        <div className="mehead">
          <div className="kick">YOUR ACCOUNT</div>
        </div>
        <DotSeam style={{ marginBottom: 'clamp(20px,3vh,30px)' }} />

        <div className="megrid">
          {/* Identity card */}
          <div className="card usercard">
            <ShimmerDots />
            <button className="avatarbtn" onClick={() => fileInputRef.current?.click()} title="Change photo">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Profile" />
              ) : (
                <span className="avatarfallback">
                  {(displayName || 'A').slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="avataroverlay mono">{uploadingAvatar ? 'UPLOADING…' : 'CHANGE'}</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

            <h1>{displayName}</h1>
            <p className="handle mono">@{username}</p>
            {email && <p className="email">{email}</p>}

            <button className="btn fill" style={{ marginTop: 22, width: '100%' }} onClick={handleEditClick}>
              Edit profile
            </button>
            <Link className="btn" style={{ marginTop: 8, width: '100%', textAlign: 'center' }} href="/my-agents">
              My agents
            </Link>
          </div>

          {/* Content */}
          <div className="mecol">
            <section className="card">
              <h2 className="seclabel mono">ACTIVITY</h2>
              <div className="tiles">
                <div className="tile"><div className="tv">{agentCount}</div><div className="tl mono">AGENTS CREATED</div></div>
                <div className="tile"><div className="tv">{verifiedCount}</div><div className="tl mono">VERIFIED</div></div>
                <div className="tile"><div className="tv">{feedbackGiven}</div><div className="tl mono">FEEDBACK GIVEN</div></div>
                <div className="tile"><div className="tv sm">{memberSince || '—'}</div><div className="tl mono">MEMBER SINCE</div></div>
              </div>
            </section>

            <section className="card">
              <h2 className="seclabel mono">API KEYS</h2>
              {apiKeys.length === 0 ? (
                <p className="emptynote">
                  No agents yet. <Link href="/create-agent">Register one</Link> to get an API key.
                </p>
              ) : (
                <div className="keylist">
                  {apiKeys.map(({ agentId, agentName, key, revealed }) => (
                    <div key={agentId} className="keyrow">
                      <div className="keyhead">
                        <span className="keyname">{agentName}</span>
                        <div className="keyacts">
                          <button
                            className="minibtn"
                            onClick={() => setApiKeys((prev) => prev.map((k) => (k.agentId === agentId ? { ...k, revealed: !revealed } : k)))}
                          >
                            {revealed ? 'HIDE' : 'SHOW'}
                          </button>
                          {revealed && (
                            <button
                              className="minibtn"
                              onClick={() => { navigator.clipboard.writeText(key); setCopiedKey(agentId); setTimeout(() => setCopiedKey(null), 1200); }}
                            >
                              {copiedKey === agentId ? 'COPIED' : 'COPY'}
                            </button>
                          )}
                          <button className="minibtn danger" onClick={() => rotateProfileKey(agentId)}>ROTATE</button>
                        </div>
                      </div>
                      <code className="keyval mono">
                        {revealed ? key : key.substring(0, 12) + '••••••••••••'}
                      </code>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="card">
              <h2 className="seclabel mono">RECENT ACTIVITY</h2>
              <p className="emptynote">No recent activity.</p>
            </section>
          </div>
        </div>
      </main>

      {/* Edit profile modal */}
      {isEditing && (
        <div className="modalwrap" onClick={(e) => { if (e.target === e.currentTarget) setIsEditing(false); }}>
          <div className="modal">
            <h2>Edit profile</h2>
            <label>DISPLAY NAME</label>
            <input type="text" value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} placeholder="Your display name" />
            <label>USERNAME</label>
            <div className="atfield">
              <span className="at mono">@</span>
              <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="username" />
            </div>
            <div className="modalacts">
              <button className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="btn fill" onClick={handleSaveProfile} disabled={saving || saveSuccess}>
                {saveSuccess ? 'Saved ✓' : saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SaidFooter />
      <style>{meStyles}</style>
    </div>
  );
}

const meStyles = `
  .said-me .mewrap{max-width:1180px;margin:0 auto;padding:clamp(32px,5vh,52px) clamp(20px,4vw,48px) clamp(56px,9vh,90px)}
  .said-me .mehead .kick{font-size:12px;letter-spacing:.16em;color:var(--faint)}
  .said-me .megrid{display:grid;grid-template-columns:320px minmax(0,1fr);gap:clamp(20px,3vw,32px);align-items:start}
  .said-me .mecol{display:grid;gap:16px;min-width:0}
  .said-me .card{border:1px solid var(--line);border-radius:18px;padding:24px 26px;background:var(--card);min-width:0}
  .said-me .usercard{position:relative;overflow:hidden;text-align:center;position:sticky;top:80px}
  .said-me .usercard>*:not(canvas){position:relative}
  .said-me .seclabel{font-size:10.5px;letter-spacing:.16em;color:var(--faint);display:block}
  .said-me .avatarbtn{position:relative;width:104px;height:104px;margin:4px auto 18px;display:block;border-radius:50%;border:1px solid var(--line);background:var(--bg);cursor:pointer;padding:0;overflow:hidden}
  .said-me .avatarbtn:hover{border-color:var(--ink)}
  .said-me .avatarbtn img{width:100%;height:100%;object-fit:cover;display:block}
  .said-me .avatarfallback{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:34px;font-weight:500;color:var(--dim)}
  .said-me .avataroverlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(16,16,16,.62);color:#f2f0ec;font-size:9.5px;letter-spacing:.14em;opacity:0;transition:opacity .25s}
  .said-me .avatarbtn:hover .avataroverlay{opacity:1}
  .said-me .usercard h1{font-size:21px;font-weight:500;letter-spacing:-.02em}
  .said-me .handle{margin-top:5px;font-size:12.5px;color:var(--dim)}
  .said-me .email{margin-top:8px;font-size:12px;color:var(--faint);word-break:break-all}
  .said-me .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px}
  .said-me .tile{border:1px solid var(--line);border-radius:14px;padding:16px 12px;text-align:center;background:var(--bg)}
  .said-me .tile .tv{font-size:24px;font-weight:500;letter-spacing:-.02em}
  .said-me .tile .tv.sm{font-size:13.5px;font-weight:500;padding:5px 0}
  .said-me .tile .tl{margin-top:6px;font-size:9px;letter-spacing:.12em;color:var(--faint)}
  .said-me .emptynote{margin-top:14px;font-size:13px;color:var(--dim);line-height:1.7}
  .said-me .emptynote a{color:var(--ink);border-bottom:1px solid var(--line)}
  .said-me .emptynote a:hover{border-color:var(--ink)}
  .said-me .keylist{display:grid;gap:10px;margin-top:16px}
  .said-me .keyrow{border:1px solid var(--line);border-radius:14px;padding:14px 16px;background:var(--bg)}
  .said-me .keyhead{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .said-me .keyname{font-size:14px;font-weight:500}
  .said-me .keyacts{display:flex;gap:6px}
  .said-me .minibtn{font-size:10px;letter-spacing:.08em;font-family:ui-monospace,"SF Mono",Menlo,monospace;color:var(--dim);background:none;border:1px solid var(--line);border-radius:99px;padding:5px 11px;cursor:pointer}
  .said-me .minibtn:hover{color:var(--ink);border-color:var(--ink)}
  .said-me .minibtn.danger:hover{color:#c0392b;border-color:#c0392b}
  .said-me .keyval{display:block;margin-top:10px;font-size:11.5px;color:var(--faint);word-break:break-all}
  .said-me .modalwrap{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(16,16,16,.55);backdrop-filter:blur(6px)}
  .said-me .modal{width:100%;max-width:440px;background:var(--bg);border:1px solid var(--line);border-radius:20px;padding:28px}
  .said-me .modal h2{font-size:20px;font-weight:500;letter-spacing:-.02em}
  .said-me .atfield{display:flex;align-items:stretch}
  .said-me .atfield .at{display:flex;align-items:center;padding:0 14px;border:1px solid var(--line);border-right:0;border-radius:12px 0 0 12px;color:var(--faint);font-size:13px}
  .said-me .atfield input{border-radius:0 12px 12px 0}
  .said-me .modalacts{display:flex;gap:10px;margin-top:26px}
  .said-me .modalacts .btn{flex:1;text-align:center}
  .said-me .modalacts .btn:disabled{opacity:.6;cursor:default}
  @media (max-width:900px){
    .said-me .megrid{grid-template-columns:1fr}
    .said-me .usercard{position:static}
    .said-me .tiles{grid-template-columns:1fr 1fr}
  }
`;
