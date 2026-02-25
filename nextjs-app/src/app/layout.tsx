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

const TITLE = "SAID Protocol - Identity Infrastructure for AI Agents";
const DESCRIPTION = "SAID Protocol is on-chain identity infrastructure for autonomous AI agents. Register, verify, and build reputation for your agent on Solana. Free to start.";
const OG_IMAGE = "https://www.saidprotocol.com/og-image.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.saidprotocol.com",
    siteName: "SAID Protocol",
    images: [{ url: OG_IMAGE, width: 1280, height: 640, alt: "SAID Protocol — On-chain identity for AI agents" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
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
