import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./host-landing.css";
import Providers from "./providers";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAID Host - Deploy AI Agents in 60 Seconds",
  description: "On-chain identity, reputation, and verification for autonomous AI agents. Built on Solana.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
