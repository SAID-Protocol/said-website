import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const API_URL = 'https://api.saidprotocol.com';

export function useAuth() {
  const { user, authenticated, ready, getAccessToken } = usePrivy();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('said_session_token');
    if (saved) {
      setSessionToken(saved);
    }
    setLoading(false);
  }, []);

  const loginToBackend = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const email = user.email?.address;
      const walletAddress = user.wallet?.address;
      const displayName = email?.split('@')[0] || 'User';

      // Get Privy access token for server-side verification
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        console.error('Failed to get Privy access token');
        throw new Error('Authentication failed - no access token');
      }

      console.log('Logging into backend with verified Privy token');

      const res = await fetch(`${API_URL}/auth/login-privy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          email,
          walletAddress,
          displayName,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Backend login error:', data);
        throw new Error(data.error || 'Login failed');
      }

      const token = data.sessionToken;
      console.log('Got session token:', token ? 'yes' : 'no');
      
      setSessionToken(token);
      localStorage.setItem('said_session_token', token);
    } catch (err) {
      console.error('Backend login failed:', err);
    } finally {
      setLoading(false);
    }
  }, [user, getAccessToken]);

  // Auto-login when Privy is ready and user is authenticated
  useEffect(() => {
    if (ready && authenticated && user && !sessionToken) {
      loginToBackend();
    }
  }, [ready, authenticated, user, sessionToken, loginToBackend]);

  const logout = () => {
    setSessionToken(null);
    localStorage.removeItem('said_session_token');
  };

  return {
    sessionToken,
    loading,
    logout,
    refreshSession: loginToBackend,
  };
}
