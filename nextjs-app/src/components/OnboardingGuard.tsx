'use client';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import OnboardingModal from './OnboardingModal';
import { useAuth } from '@/hooks/useAuth';
import { API_URL, fetchWithBackoff } from '@/lib/api';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, ready, user } = usePrivy();
  const { sessionToken, loading: authLoading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checking, setChecking] = useState(true);
  const [checkAttempted, setCheckAttempted] = useState(false);

  // Failsafe: never trap the user behind the spinner. If the backend session
  // hasn't arrived shortly after Privy authenticates (login-privy failed, is
  // slow, or the API is down), let them through logged-in-but-sessionless
  // rather than showing a spinner forever.
  useEffect(() => {
    if (!authenticated || !checking) return;
    const t = setTimeout(() => setChecking(false), 6000);
    return () => clearTimeout(t);
  }, [authenticated, checking]);

  useEffect(() => {
    async function checkProfile() {
      // If not authenticated, no need to check
      if (ready && !authenticated) {
        setChecking(false);
        setNeedsOnboarding(false);
        return;
      }

      // Wait for everything to be ready
      if (!ready || !authenticated || !sessionToken || authLoading || checkAttempted) {
        return;
      }

      setCheckAttempted(true);

      try {
        const res = await fetchWithBackoff(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        }, 2);

        if (!res.ok) {
          // Can't fetch user data - let them through
          setChecking(false);
          setNeedsOnboarding(false);
          return;
        }

        const data = await res.json();
        
        console.log('[OnboardingGuard] User data:', data);
        
        const needsSetup = !data.user?.username || data.user?.username === 'anonymous';
        
        console.log('[OnboardingGuard] needsSetup:', needsSetup);
        
        setNeedsOnboarding(needsSetup);
      } catch (err) {
        console.error('Failed to check profile:', err);
        setNeedsOnboarding(false);
      } finally {
        setChecking(false);
      }
    }

    checkProfile();
  }, [ready, authenticated, sessionToken, authLoading, checkAttempted]);

  const handleOnboardingComplete = async (data: { username: string; displayName: string; avatar?: string }) => {
    if (!sessionToken) return;

    try {
      const payload = {
        username: data.username,
        displayName: data.displayName,
        avatarUrl: data.avatar || undefined,
      };

      const res = await fetchWithBackoff(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(payload),
      }, 1);

      if (res.ok) {
        console.log('[OnboardingGuard] Profile updated successfully');
        setNeedsOnboarding(false);
        window.location.reload();
      } else {
        const error = await res.json();
        console.error('[OnboardingGuard] Save failed:', error);
        alert(`Failed to update profile: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('[OnboardingGuard] Error during save:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (authenticated && checking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          color: 'var(--faint)',
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 11,
          letterSpacing: '.16em',
        }}
      >
        SIGNING IN…
      </div>
    );
  }

  if (needsOnboarding) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  return <>{children}</>;
}
