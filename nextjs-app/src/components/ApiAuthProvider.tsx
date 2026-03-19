'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { setAccessTokenGetter } from '@/lib/api';

export default function ApiAuthProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, getAccessToken } = usePrivy();

  useEffect(() => {
    if (ready && authenticated) {
      // Provide the getAccessToken function to the API client
      setAccessTokenGetter(async () => {
        try {
          return await getAccessToken();
        } catch (err) {
          console.error('Failed to get Privy access token:', err);
          return null;
        }
      });
    }
  }, [ready, authenticated, getAccessToken]);

  return <>{children}</>;
}
