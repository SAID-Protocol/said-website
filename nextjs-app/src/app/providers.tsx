'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import OnboardingGuard from '@/components/OnboardingGuard';
import ApiAuthProvider from '@/components/ApiAuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmlbxd3qu00jqi80c4pibohzv"
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#667eea',
          logo: '/logo-dark.png',
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
      }}
    >
      <ApiAuthProvider>
        <OnboardingGuard>
          {children}
        </OnboardingGuard>
      </ApiAuthProvider>
    </PrivyProvider>
  );
}
