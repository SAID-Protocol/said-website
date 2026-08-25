'use client';

// Partner roster carried over from the pre-redesign PartnerTicker.
const partners = [
  { name: 'OpenClaw', logo: '/platforms/openclaw.png', url: 'https://openclaw.ai' },
  { name: 'Spawnr', logo: '/platforms/spawnr.png', url: 'https://spawnr.io' },
  { name: 'Atelier', logo: '/platforms/atelier.jpg', url: 'https://atelierai.xyz/' },
  { name: 'Claw Pump', logo: '/clawpump-logo.png', url: 'https://clawpump.tech' },
  { name: 'FairScale', logo: '/platforms/fairscale.jpg', url: 'https://fairscale.xyz/' },
  { name: 'Xona Orbit', logo: '/platforms/xona-orbit.png', url: 'https://www.xona-agent.com/' },
  { name: 'Metaplex', logo: '/platforms/metaplex.jpg', url: 'https://www.metaplex.com/' },
  { name: 'Privy', logo: '/platforms/privy.jpg', url: 'https://www.privy.io/' },
  { name: 'Open Wallet Standard', logo: '/platforms/ows.jpg', url: 'https://openwallet.sh' },
  { name: 'Syra', logo: 'https://www.syraa.fun/images/logo.jpg', url: 'https://syraa.fun' },
  { name: 'Kausa', logo: '/platforms/kausa.png', url: 'https://kausalayer.com' },
  { name: 'Hyre', logo: '/platforms/hyre.jpg', url: 'https://hyreagent.fun' },
  { name: 'Pod the Squire', logo: '/platforms/pod-the-squire.jpg', url: 'https://usepod.ai' },
  { name: 'Idle', logo: '/platforms/idle.jpg', url: 'https://earnidle.com' },
  { name: 'AlphArena', logo: '/platforms/alpharena.jpg', url: 'https://alpharena.ai' },
  { name: 'DegenTools', logo: '/platforms/degentools.jpg', url: 'https://degentools.co' },
  { name: 'Modulr', logo: '/platforms/modulr.jpg', url: 'https://modulr402.com' },
];

/** Ecosystem partner marquee, in the redesign's pill language. */
export default function EcosystemTicker() {
  return (
    <section className="eco">
      <p className="ecolabel mono">ECOSYSTEM · PARTNERS &amp; INTEGRATIONS</p>
      <div className="ecomask">
        <div className="ecotrack">
          {[...partners, ...partners].map((p, i) => (
            <a key={`${p.name}-${i}`} href={p.url} target="_blank" rel="noopener noreferrer" className="ecopill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt="" loading="lazy" />
              <span>{p.name}</span>
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        .eco { padding: clamp(36px, 6vh, 60px) 0 0; overflow: hidden; }
        .ecolabel {
          text-align: center; font-size: 11px; letter-spacing: 0.18em;
          color: var(--faint); margin-bottom: 22px;
        }
        .ecomask {
          max-width: 1100px; margin: 0 auto; overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
        }
        .ecotrack {
          display: flex; width: max-content;
          animation: eco-scroll 40s linear infinite;
        }
        .ecomask:hover .ecotrack { animation-play-state: paused; }
        .ecopill {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
          margin: 0 7px; padding: 9px 18px 9px 10px;
          border: 1px solid var(--line); border-radius: 99px;
          font-size: 13px; color: var(--dim);
          transition: border-color 0.3s, color 0.3s, background-color 0.5s;
        }
        .ecopill:hover { border-color: var(--ink); color: var(--ink); }
        .ecopill img {
          width: 22px; height: 22px; border-radius: 50%; display: block;
          object-fit: cover;
        }
        .ecopill span { white-space: nowrap; }
        @keyframes eco-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
