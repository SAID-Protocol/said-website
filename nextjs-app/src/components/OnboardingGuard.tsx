'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import OnboardingModal from './OnboardingModal';
import { useAuth } from '@/hooks/useAuth';

const API_URL = 'https://api.saidprotocol.com';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, ready } = usePrivy();
  const { sessionToken, loading: authLoading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      // If not authenticated, no need to check - just show content
      if (ready && !authenticated) {
        setChecking(false);
        return;
      }

      // Wait for everything to be ready: Privy ready, authenticated, session token exists, and auth hook is done loading
      if (!ready || !authenticated || !sessionToken || authLoading) {
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });

        if (!res.ok) {
          setChecking(false);
          return;
        }

        const data = await res.json();
        
        console.log('[OnboardingGuard] User data:', data);
        
        // Only trigger onboarding if username is null/undefined OR exactly 'anonymous'
        // This catches truly new users, not existing ones
        const needsSetup = !data.username || data.username === 'anonymous';
        
        console.log('[OnboardingGuard] needsSetup:', needsSetup);
        
        setNeedsOnboarding(needsSetup);
      } catch (err) {
        console.error('Failed to check profile:', err);
      } finally {
        setChecking(false);
      }
    }

    checkProfile();
  }, [ready, authenticated, sessionToken, authLoading]);

  const handleOnboardingComplete = async (data: { username: string; displayName: string; avatar?: string }) => {
    if (!sessionToken) return;

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setNeedsOnboarding(false);
      } else {
        const error = await res.json();
        alert(`Failed to update profile: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Show nothing while checking (only for authenticated users)
  if (authenticated && checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Show onboarding modal if needed
  if (needsOnboarding) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  // Otherwise show children
  return <>{children}</>;
}
