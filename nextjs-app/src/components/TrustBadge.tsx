'use client';

import { useId } from 'react';

/**
 * TrustBadge — the SAID "passport" verified badge.
 * Tier-toned (ring + check + score + pill), with a gamified hierarchy:
 *   silver = clean baseline · gold = gradient + ★ pill + sparkle · platinum = holographic + 👑 pill + sparkle cluster
 * Avatar resolves: uploaded image → twitter avatar → deterministic identicon.
 */

type TrustScore = { tier?: string; score?: number };
type BadgeAgent = {
  name?: string | null;
  wallet: string;
  image?: string | null;
  twitter?: string | null;
  isVerified?: boolean;
  reputationScore?: number | null;
  trustScore?: TrustScore | null;
};

const TIER: Record<string, { solid: string; fillA: string; strokeA: string }> = {
  platinum:   { solid: '#C084FC', fillA: 'rgba(192,132,252,0.14)', strokeA: 'rgba(192,132,252,0.40)' },
  gold:       { solid: '#FBBF24', fillA: 'rgba(251,191,36,0.14)',  strokeA: 'rgba(251,191,36,0.40)' },
  silver:     { solid: '#A1A1AA', fillA: 'rgba(161,161,170,0.14)', strokeA: 'rgba(161,161,170,0.40)' },
  bronze:     { solid: '#FB923C', fillA: 'rgba(251,146,60,0.14)',  strokeA: 'rgba(251,146,60,0.40)' },
  unverified: { solid: '#71717A', fillA: 'rgba(113,113,122,0.12)', strokeA: 'rgba(113,113,122,0.34)' },
};
const LEVEL: Record<string, number> = { platinum: 3, gold: 2, silver: 1, bronze: 1, unverified: 0 };
const AVATAR_BASE = 'https://api.saidprotocol.com/api/avatar';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trunc = (s: string, n: number) => { s = s || 'Agent'; return s.length <= n ? s : s.slice(0, n - 1) + '…'; };
const shortW = (w: string) => w.slice(0, 5) + '…' + w.slice(-4);

function twitterHandle(t?: string | null): string | null {
  if (!t) return null;
  const m = t.match(/(?:x\.com\/|twitter\.com\/|@)?([A-Za-z0-9_]{2,30})\/?$/);
  return m ? m[1] : null;
}

function ringPaint(uid: string, tier: string, solid: string): [string, string] {
  if (tier === 'platinum') return [
    `<linearGradient id="rg-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E9D5FF"/><stop offset="32%" stop-color="#C084FC"/><stop offset="60%" stop-color="#818CF8"/><stop offset="100%" stop-color="#7DD3FC"/></linearGradient>`,
    `url(#rg-${uid})`];
  if (tier === 'gold') return [
    `<linearGradient id="rg-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FDE68A"/><stop offset="50%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#FBBF24"/></linearGradient>`,
    `url(#rg-${uid})`];
  return ['', solid];
}

function scorePaint(uid: string, tier: string, solid: string): [string, string] {
  if (tier === 'platinum') return [
    `<linearGradient id="sg-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F3E8FF"/><stop offset="100%" stop-color="#A78BFA"/></linearGradient>`,
    `url(#sg-${uid})`];
  if (tier === 'gold') return [
    `<linearGradient id="sg-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FEF3C7"/><stop offset="100%" stop-color="#F59E0B"/></linearGradient>`,
    `url(#sg-${uid})`];
  return ['', solid];
}

function sparkle(cx: number, cy: number, s: number, fill: string, op = 1) {
  return `<path d="M${cx} ${cy - s} C${cx} ${cy - s * 0.32} ${cx + s * 0.32} ${cy} ${cx + s} ${cy} C${cx + s * 0.32} ${cy} ${cx} ${cy + s * 0.32} ${cx} ${cy + s} C${cx} ${cy + s * 0.32} ${cx - s * 0.32} ${cy} ${cx - s} ${cy} C${cx - s * 0.32} ${cy} ${cx} ${cy - s * 0.32} ${cx} ${cy - s} Z" fill="${fill}" opacity="${op}"/>`;
}

function star5(cx: number, cy: number, r: number, fill: string, op = 1) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + i * Math.PI / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(cx + rr * Math.cos(ang)).toFixed(2)},${(cy + rr * Math.sin(ang)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" opacity="${op}"/>`;
}

function crown(cx: number, base: number, w: number, fill: string) {
  const h = w * 0.9, gr = w * 0.22;
  const d = `M${cx - w} ${base} L${cx - w} ${base - h * 0.5} L${cx - w * 0.42} ${base - h * 0.15} L${cx} ${base - h} L${cx + w * 0.42} ${base - h * 0.15} L${cx + w} ${base - h * 0.5} L${cx + w} ${base} Z`;
  return `<path d="${d}" fill="${fill}"/><circle cx="${cx - w}" cy="${base - h * 0.5}" r="${gr.toFixed(2)}" fill="${fill}"/><circle cx="${cx}" cy="${base - h}" r="${(gr * 1.15).toFixed(2)}" fill="${fill}"/><circle cx="${cx + w}" cy="${base - h * 0.5}" r="${gr.toFixed(2)}" fill="${fill}"/>`;
}

function checkSeal(cx: number, cy: number, r: number, color: string) {
  const s = r * 0.55;
  return `<circle cx="${cx}" cy="${cy}" r="${r + 1.5}" fill="#0B0F19"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/><path d="M${cx - s} ${cy} l${s * 0.7} ${s * 0.7} l${s * 1.3} -${s * 1.5}" stroke="#0B0F19" stroke-width="${r * 0.22}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function avatarLayers(uid: string, wallet: string, topSrc: string | null) {
  const clip = `<clipPath id="cp-${uid}"><rect x="20" y="26" width="56" height="56" rx="12"/></clipPath>`;
  const identicon = `${AVATAR_BASE}/${wallet}.svg`;
  // identicon as base layer; real PFP painted on top (if it fails to load, the identicon shows through)
  let layers = `<image href="${identicon}" x="20" y="26" width="56" height="56" preserveAspectRatio="xMidYMid slice" clip-path="url(#cp-${uid})"/>`;
  if (topSrc) layers += `<image href="${esc(topSrc)}" x="20" y="26" width="56" height="56" preserveAspectRatio="xMidYMid slice" clip-path="url(#cp-${uid})"/>`;
  return clip + layers;
}

function buildPassport(agent: BadgeAgent, uid: string): string {
  const ts = agent.trustScore || {};
  const tier = ts.tier || (agent.isVerified ? 'silver' : 'unverified');
  const score = ts.score ?? Math.round(agent.reputationScore || 0);
  const { solid, fillA, strokeA } = TIER[tier] || TIER.unverified;
  const lvl = LEVEL[tier] ?? 0;

  const [ringDef, ringP] = ringPaint(uid, tier, solid);
  const [scoreDef, scoreP] = scorePaint(uid, tier, solid);
  const glowTop = ({ 3: 0.20, 2: 0.15, 1: 0.06, 0: 0.04 } as Record<number, number>)[lvl];
  const haloOp = ({ 3: 0.65, 2: 0.56, 1: 0.30, 0: 0.20 } as Record<number, number>)[lvl];
  const ringW = lvl >= 2 ? 2.5 : 2;
  const label = tier.toUpperCase();
  const pillw = 34 + label.length * 7.4;

  let flourish = '';
  if (lvl === 3) flourish = sparkle(150, 17, 3.2, '#E9D5FF', 0.95) + sparkle(305, 22, 2.4, '#C084FC', 0.85) + sparkle(214, 40, 2.0, '#93C5FD', 0.80);
  else if (lvl === 2) flourish = sparkle(300, 34, 2.6, '#FDE68A', 0.90);

  let pillMark: string;
  if (lvl === 3) pillMark = crown(13, 14, 5, ringP);
  else if (lvl === 2) pillMark = star5(14, 11, 4.2, ringP);
  else pillMark = `<circle cx="14" cy="11" r="3.2" fill="${ringP}"/>`;

  const handle = twitterHandle(agent.twitter);
  const topSrc = agent.image || (handle ? `https://unavatar.io/x/${handle}` : null);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 348 108" style="width:100%;height:auto;display:block">
<defs>
<linearGradient id="glow-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${solid}" stop-opacity="${glowTop}"/><stop offset="55%" stop-color="${solid}" stop-opacity="0"/></linearGradient>
<radialGradient id="rh-${uid}" cx="50%" cy="50%" r="50%"><stop offset="58%" stop-color="${solid}" stop-opacity="0"/><stop offset="100%" stop-color="${solid}" stop-opacity="${haloOp}"/></radialGradient>
${ringDef}${scoreDef}
</defs>
<rect x="0.5" y="0.5" width="347" height="107" rx="16" fill="#0B0F19" stroke="rgba(255,255,255,0.08)"/>
<rect x="1" y="1" width="346" height="64" rx="15" fill="url(#glow-${uid})"/>
${flourish}
<rect x="16" y="22" width="64" height="64" rx="15" fill="url(#rh-${uid})"/>
${avatarLayers(uid, agent.wallet, topSrc)}
<rect x="18.5" y="24.5" width="59" height="59" rx="13" fill="none" stroke="${ringP}" stroke-width="${ringW}"/>
${checkSeal(72, 78, 9, ringP)}
<text x="92" y="44" fill="#f4f4f5" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="700" letter-spacing="-0.01em">${esc(trunc(agent.name || 'Agent', 18))}</text>
<text x="92" y="64" fill="#8b8b93" font-family="ui-monospace,monospace" font-size="11">${shortW(agent.wallet)}</text>
<g transform="translate(92,75)">
<rect width="${pillw.toFixed(0)}" height="22" rx="11" fill="${fillA}" stroke="${strokeA}"/>
${pillMark}
<text x="24" y="15" fill="${solid}" font-family="Inter,system-ui,sans-serif" font-size="10.5" font-weight="700" letter-spacing="0.04em">${label}</text>
</g>
<text x="330" y="40" fill="#5b5b63" font-family="Inter,system-ui,sans-serif" font-size="9" font-weight="600" letter-spacing="0.12em" text-anchor="end">TRUST SCORE</text>
<text x="330" y="72" fill="${scoreP}" font-family="Inter,system-ui,sans-serif" font-size="30" font-weight="800" letter-spacing="-0.02em" text-anchor="end">${score}</text>
<text x="330" y="94" fill="#5b5b63" font-family="Inter,system-ui,sans-serif" font-size="9.5" font-weight="600" text-anchor="end">Verified on SAID ✦</text>
</svg>`;
}

export default function TrustBadge({ agent }: { agent: BadgeAgent }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return <div className="w-full" dangerouslySetInnerHTML={{ __html: buildPassport(agent, uid) }} />;
}
