'use client';

import { useState } from 'react';

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
      const res = await fetch(`https://api.saidprotocol.com/auth/check-username?username=${encodeURIComponent(value)}`);
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Welcome to SAID!</h2>
          <p className="text-zinc-400">Let's set up your profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="yourname"
              autoFocus
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 transition"
            />
            {usernameError && (
              <p className="text-red-400 text-sm mt-1">{usernameError}</p>
            )}
            {checking && (
              <p className="text-zinc-500 text-sm mt-1">Checking availability...</p>
            )}
            {!usernameError && username.length >= 3 && !checking && (
              <p className="text-green-400 text-sm mt-1">✓ Available</p>
            )}
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 transition"
            />
          </div>

          {/* Avatar URL (optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Picture <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 transition"
            />
            <p className="text-zinc-500 text-xs mt-1">You can always add this later</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              canSubmit
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-xs mt-4">
          Your username will be public and cannot be changed
        </p>
      </div>
    </div>
  );
}
