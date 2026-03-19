'use client';

import { useEffect, useState, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSessionSigners } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import OnboardingModal from './OnboardingModal';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

const API_URL = 'https://api.saidprotocol.com';
const HOSTING_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app.saidprotocol.com';

// Key quorum ID from Privy Dashboard (authorization key for server-side billing)
const SIGNER_QUORUM_ID = 'wmuak9gzqdi85cl1galpqs41';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, ready } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const { addSessionSigners } = useSessionSigners();
  const { sessionToken, loading: authLoading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checking, setChecking] = useState(true);
  const walletSynced = useRef(false);
  const signerChecked = useRef(false);

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
        const needsSetup = !data.user?.username || data.user?.username === 'anonymous';
        
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

  // Auto-save embedded Solana wallet address to billing backend
  useEffect(() => {
    if (!authenticated || !sessionToken || authLoading || walletSynced.current) return;
    
    // Find the embedded wallet (not external)
    const embeddedWallet = solanaWallets.find(w => w.walletClientType === 'privy');
    if (!embeddedWallet?.address) return;

    walletSynced.current = true;
    
    fetch(`${HOSTING_API_URL}/api/billing/set-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ walletAddress: embeddedWallet.address }),
    })
      .then(res => {
        if (res.ok) console.log('[OnboardingGuard] Wallet synced:', embeddedWallet.address);
        else console.error('[OnboardingGuard] Wallet sync failed:', res.status);
      })
      .catch(err => console.error('[OnboardingGuard] Wallet sync error:', err));
  }, [authenticated, sessionToken, authLoading, solanaWallets]);

  // Auto-add server signer to user's embedded wallet (one-time consent)
  useEffect(() => {
    if (!authenticated || !sessionToken || authLoading || signerChecked.current) return;
    
    const embeddedWallet = solanaWallets.find(w => w.walletClientType === 'privy');
    if (!embeddedWallet?.address) return;

    signerChecked.current = true;

    (async () => {
      try {
        // Check if already consented
        const { consented } = await api.getSignerStatus();
        if (consented) {
          console.log('[OnboardingGuard] Signer already consented');
          return;
        }

        // Request consent — Privy shows a confirmation modal to the user
        console.log('[OnboardingGuard] Requesting signer consent...');
        await addSessionSigners({
          address: embeddedWallet.address,
          signers: [{
            signerId: SIGNER_QUORUM_ID,
            policyIds: [], // Full permission — we only use it for USDC billing transfers
          }],
        });

        // Mark consent in our DB
        await api.markSignerConsented();
        console.log('[OnboardingGuard] Signer consent granted ✅');
      } catch (err) {
        // User may have rejected the consent modal — that's fine, we'll ask again next login
        console.error('[OnboardingGuard] Signer consent failed:', err);
      }
    })();
  }, [authenticated, sessionToken, authLoading, solanaWallets, addSessionSigners]);

  const handleOnboardingComplete = async (data: { username: string; displayName: string; avatar?: string }) => {
    if (!sessionToken) return;

    try {
      // Map 'avatar' to 'avatarUrl' for API
      const payload = {
        username: data.username,
        displayName: data.displayName,
        avatarUrl: data.avatar || undefined,
      };

      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log('[OnboardingGuard] Profile updated successfully');
        setNeedsOnboarding(false);
        // Force a page refresh to reload user data
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
