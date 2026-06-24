'use client';

const partners = [
  { name: 'OpenClaw', logo: '/platforms/openclaw.png', url: 'https://openclaw.ai' },
  { name: 'Spawnr', logo: '/platforms/spawnr.png', url: 'https://spawnr.io' },
  { name: 'Atelier', logo: '/platforms/atelier.jpg', url: 'https://atelierai.xyz/' },
  { name: 'Claw Pump', logo: '/clawpump-logo.png', url: 'https://clawpump.tech' },
  { name: 'FairScale', logo: '/platforms/fairscale.jpg', url: 'https://fairscale.xyz/' },
  { name: 'Xona Orbit', logo: '/platforms/xona-orbit.png', url: 'https://www.xona-agent.com/' },
  { name: 'Daemon', logo: '/platforms/daemon.jpg', url: 'https://www.daemonide.tech/' },
  { name: 'Metaplex', logo: '/platforms/metaplex.jpg', url: 'https://www.metaplex.com/' },
  { name: 'Privy', logo: '/platforms/privy.jpg', url: 'https://www.privy.io/' },
  { name: 'Juice', logo: '/platforms/juice.jpg', url: 'https://www.juiceeverything.com/' },
  { name: 'Open Wallet Standard', logo: '/platforms/ows.jpg', url: 'https://openwallet.sh' },
  // Agents & projects on SAID. Logos pending — drop files at the paths below
  // into /public/platforms/. URLs marked TODO still need to be supplied.
  { name: 'Syra', logo: 'https://www.syraa.fun/images/logo.jpg', url: 'https://syraa.fun' },
  { name: 'Kausa', logo: '/platforms/kausa.png', url: 'https://kausalayer.com' },
  { name: 'Hyre', logo: '/platforms/hyre.jpg', url: 'https://hyreagent.fun' },
  { name: 'Pod the Squire', logo: '/platforms/pod-the-squire.jpg', url: 'https://usepod.ai' },
  { name: 'Idle', logo: '/platforms/idle.jpg', url: 'https://earnidle.com' },
  { name: 'AlphArena', logo: '/platforms/alpharena.jpg', url: 'https://alpharena.ai' },
  { name: 'DegenTools', logo: '/platforms/degentools.jpg', url: 'https://degentools.co' },
  { name: 'Signalhouse', logo: '/platforms/signalhouse.jpg', url: 'https://signalhouse.app' },
  { name: 'Modulr', logo: '/platforms/modulr.jpg', url: 'https://modulr402.com' },
];

export default function PartnerTicker() {
  return (
    <section className="py-10 px-4 overflow-hidden">
      <style jsx global>{`
        @keyframes partner-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partner-scroll-track {
          animation: partner-scroll 36s linear infinite;
        }
      `}</style>
      <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-6">
        Ecosystem Partners & Integrations
      </p>
      <div
        className="relative max-w-4xl mx-auto overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
        <div className="flex partner-scroll-track" style={{ width: 'max-content' }}>
          {[...partners, ...partners].map((partner, i) => (
            <a
              key={`${partner.name}-${i}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-2 mx-3 shrink-0 group bg-zinc-800/80 border border-zinc-700/60 rounded-full hover:bg-zinc-700/80 transition"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-zinc-400 text-xs font-medium whitespace-nowrap group-hover:text-zinc-200 transition-colors">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
