'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { Toaster } from 'react-hot-toast';
import OnboardingGuard from '@/components/OnboardingGuard';
import ApiAuthProvider from '@/components/ApiAuthProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmlbxd3qu00jqi80c4pibohzv"
      config={{
        loginMethods: ['email', 'google', 'twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#667eea',
          logo: '/logo-dark.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <ApiAuthProvider>
        <OnboardingGuard>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f3f4f6',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f3f4f6',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f3f4f6',
                },
              },
            }}
          />
          {children}
        </OnboardingGuard>
      </ApiAuthProvider>
    </PrivyProvider>
  );
}
