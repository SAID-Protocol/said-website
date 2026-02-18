import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAID Protocol - Identity Infrastructure for AI Agents",
  description: "On-chain identity, reputation, and verification for autonomous AI agents. Built on Solana.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "SAID Protocol - Identity Infrastructure for AI Agents",
    description: "On-chain identity, reputation, and verification for autonomous AI agents. Built on Solana.",
    url: "https://www.saidprotocol.com",
    siteName: "SAID Protocol",
    images: [{ url: "https://www.saidprotocol.com/og-image.jpg", width: 1280, height: 640, alt: "SAID Protocol" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAID Protocol - Identity Infrastructure for AI Agents",
    description: "On-chain identity, reputation, and verification for autonomous AI agents. Built on Solana.",
    images: ["https://www.saidprotocol.com/og-image.jpg"],
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
