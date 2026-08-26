import { useEffect, useState, useCallback, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { API_URL, fetchWithBackoff } from '@/lib/api';

export function useAuth() {
  const { user, authenticated, ready, getAccessToken } = usePrivy();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const loginAttempted = useRef(false);
  const loginInProgress = useRef(false);
  const attempts = useRef(0);
  const MAX_ATTEMPTS = 3;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('said_session_token');
    if (saved) {
      setSessionToken(saved);
    }
    setLoading(false);
  }, []);

  // Re-arm the auto-login effect after a failure, with backoff and a cap so a
  // persistently failing API can't turn into a request loop.
  const scheduleRetry = useCallback(() => {
    if (attempts.current >= MAX_ATTEMPTS) return;
    const delay = 1500 * attempts.current; // 1.5s, 3s, …
    setTimeout(() => { loginAttempted.current = false; }, delay);
  }, []);

  const loginToBackend = useCallback(async () => {
    if (!user || loginInProgress.current) return;
    attempts.current += 1;

    loginInProgress.current = true;
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      const privyId = user.id;
      const email = user.email?.address;
      const walletAddress = user.wallet?.address;
      const displayName = email?.split('@')[0] || 'User';

      console.log('Logging into backend with:', { privyId, email, walletAddress, displayName, hasToken: !!accessToken });

      const res = await fetchWithBackoff(`${API_URL}/auth/login-privy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privyId,
          email,
          walletAddress,
          displayName,
          accessToken,
        }),
      }, 2); // max 2 retries for login

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Backend login error:', data);
        // Don't clear token on failure — keep whatever we had, but allow a
        // retry: a single failure must not leave the session dead for the
        // whole visit (it used to strand OnboardingGuard on its spinner).
        scheduleRetry();
        return;
      }

      const token = data.sessionToken;
      console.log('Got session token:', token ? 'yes' : 'no');
      
      if (token) {
        setSessionToken(token);
        localStorage.setItem('said_session_token', token);
      }
    } catch (err) {
      console.error('Backend login failed:', err);
      // Don't clear existing token on network error — but do retry.
      scheduleRetry();
    } finally {
      setLoading(false);
      loginInProgress.current = false;
    }
  }, [user]);

  // Auto-login when Privy is ready and user is authenticated
  // Only attempt ONCE per session to prevent infinite loops
  useEffect(() => {
    if (ready && authenticated && user && !sessionToken && !loginAttempted.current) {
      loginAttempted.current = true;
      loginToBackend();
    }
  }, [ready, authenticated, user, sessionToken, loginToBackend]);

  // Reset login attempt when user logs out / changes
  useEffect(() => {
    if (!authenticated) {
      loginAttempted.current = false;
    }
  }, [authenticated]);

  const logout = () => {
    setSessionToken(null);
    localStorage.removeItem('said_session_token');
    loginAttempted.current = false;
  };

  return {
    sessionToken,
    privyAccessToken: getAccessToken,
    loading,
    logout,
    refreshSession: loginToBackend,
  };
}
