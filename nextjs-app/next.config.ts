import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  generateBuildId: async () => {
    // Use timestamp to force fresh build ID
    return `build-${Date.now()}`;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.privy.io https://verify.walletconnect.com https://verify.walletconnect.org;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://auth.privy.io',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
