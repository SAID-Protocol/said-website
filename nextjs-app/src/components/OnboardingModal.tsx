'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api';

interface OnboardingModalProps {
  onComplete: (data: { username: string; displayName: string; avatar?: string }) => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, _ and -');
      return false;
    }

    setChecking(true);
    try {
      const res = await fetch(`${API_URL}/auth/check-username?username=${encodeURIComponent(value)}`);
      const data = await res.json();
      
      if (!data.available) {
        setUsernameError('Username is already taken');
        return false;
      }
      
      setUsernameError('');
      return true;
    } catch (err) {
      setUsernameError('Failed to check username availability');
      return false;
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length >= 3) {
      checkUsername(value);
    } else {
      setUsernameError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !displayName) return;
    if (usernameError) return;

    const isValid = await checkUsername(username);
    if (!isValid) return;

    setSubmitting(true);
    onComplete({ username, displayName, avatar: avatar || undefined });
  };

  const canSubmit = username.length >= 3 && displayName.length >= 1 && !usernameError && !checking && !submitting;

  return (
    <div className="said-onb">
      <div className="onbcard">
        <div className="onbhead">
          <div className="kick mono">WELCOME TO SAID</div>
          <h2>Set up your profile.</h2>
          <p>Two details and you&apos;re in.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="yourname"
            autoFocus
          />
          {usernameError && <p className="msg bad">{usernameError}</p>}
          {checking && <p className="msg">Checking availability…</p>}
          {!usernameError && username.length >= 3 && !checking && (
            <p className="msg ok">✓ Available</p>
          )}

          <label>DISPLAY NAME</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />

          <label>PROFILE PICTURE <b>· optional</b></label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://…"
          />
          <p className="msg">You can always add this later.</p>

          <button type="submit" className="btn fill" disabled={!canSubmit}>
            {submitting ? 'Setting up…' : 'Complete setup'}
          </button>
        </form>

        <p className="fine">Your username is public and can&apos;t be changed later.</p>
      </div>

      <style>{`
        .said-onb{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(16,16,16,.6);backdrop-filter:blur(8px)}
        .said-onb .onbcard{width:100%;max-width:440px;max-height:92vh;overflow-y:auto;background:var(--bg);border:1px solid var(--line);border-radius:22px;padding:30px 30px 26px;animation:onbIn .3s cubic-bezier(.16,1,.3,1) both}
        @keyframes onbIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
        .said-onb .onbhead{margin-bottom:6px}
        .said-onb .kick{font-size:10px;letter-spacing:.18em;color:var(--faint)}
        .said-onb h2{margin-top:12px;font-size:24px;font-weight:500;letter-spacing:-.02em}
        .said-onb .onbhead p{margin-top:8px;font-size:14px;color:var(--dim)}
        .said-onb label{display:block;font-size:11px;letter-spacing:.12em;color:var(--faint);margin:20px 0 8px}
        .said-onb label b{color:var(--dim);font-weight:400}
        .said-onb input{width:100%;padding:12px 15px;border:1px solid var(--line);border-radius:12px;background:var(--bg);color:var(--ink);font-size:14px;font-family:inherit;outline:none}
        .said-onb input:focus{border-color:var(--ink)}
        .said-onb .msg{margin-top:8px;font-size:12px;color:var(--faint)}
        .said-onb .msg.bad{color:#c0392b}
        .said-onb .msg.ok{color:var(--good)}
        .said-onb .btn{width:100%;margin-top:26px;text-align:center;display:block;padding:14px 24px;border-radius:99px;font-size:14px;font-weight:500;background:var(--ink);color:var(--bg);border:1px solid var(--ink);cursor:pointer;font-family:inherit}
        .said-onb .btn:disabled{opacity:.4;cursor:not-allowed}
        .said-onb .fine{margin-top:16px;text-align:center;font-size:11.5px;color:var(--faint)}
      `}</style>
    </div>
  );
}
