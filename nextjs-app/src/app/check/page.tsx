import type { Metadata } from 'next';
import CheckClient from './CheckClient';

const SITE = 'https://www.saidprotocol.com';
const DESCRIPTION =
  'Tokenized stocks now trade beside memecoins wearing the same ticker. Paste a ticker or a mint address and find out which one you are looking at, with the evidence.';

type Search = Promise<{ q?: string | string[] }>;

function cleanQuery(q?: string | string[]): string | null {
  const s = Array.isArray(q) ? q[0] : q;
  if (!s) return null;
  const t = s.trim();
  return /^[A-Za-z0-9._ -]{2,44}$/.test(t) ? t : null;
}

/** A shared link names what it checked, so the preview card does too. */
export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const q = cleanQuery((await searchParams).q);
  const title = q ? `Is ${q} real? · SAID Protocol` : 'Is it real? · SAID Protocol';
  const url = q ? `${SITE}/check?q=${encodeURIComponent(q)}` : `${SITE}/check`;
  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: DESCRIPTION,
      url,
      siteName: 'SAID Protocol',
      type: 'website',
      images: [{ url: `${SITE}/check-card.png`, width: 1200, height: 630, alt: 'Is it real? One real NVIDIA xStock, sixteen tokens wearing its name.' }],
    },
    twitter: { card: 'summary_large_image', site: '@saidinfra', title, description: DESCRIPTION, images: [`${SITE}/check-card.png`] },
  };
}

export default async function CheckPage({ searchParams }: { searchParams: Search }) {
  const q = cleanQuery((await searchParams).q);
  return <CheckClient initialQuery={q} />;
}
