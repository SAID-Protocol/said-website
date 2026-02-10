import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const API_URL = 'https://api.saidprotocol.com';

export function useAuth() {
  const { user, authenticated } = usePrivy();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('said_session_token');
    if (saved) {
      setSessionToken(saved);
    }
  }, []);

  useEffect(() => {
    if (authenticated && user && !sessionToken) {
      loginToBackend();
    }
  }, [authenticated, user, sessionToken]);

  const loginToBackend = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const privyId = user.id;
      const email = user.email?.address;
      const walletAddress = user.wallet?.address;
      const displayName = email?.split('@')[0] || 'User';

      const res = await fetch(`${API_URL}/auth/login-privy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privyId,
          email,
          walletAddress,
          displayName,
        }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      const token = data.sessionToken;
      
      setSessionToken(token);
      localStorage.setItem('said_session_token', token);
    } catch (err) {
      console.error('Backend login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSessionToken(null);
    localStorage.removeItem('said_session_token');
  };

  return {
    sessionToken,
    loading,
    logout,
  };
}
