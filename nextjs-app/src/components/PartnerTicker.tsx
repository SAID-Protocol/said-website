'use client';

const partners = [
  { name: 'OpenClaw', logo: '/platforms/openclaw.png', url: 'https://openclaw.ai' },
  { name: 'Spawnr', logo: '/platforms/spawnr.png', url: 'https://spawnr.io' },
  { name: 'SAID Hosting', logo: '/platforms/said-hosting.png', url: 'https://host.saidprotocol.com' },
  { name: 'Atelier', logo: '/platforms/atelier.jpg', url: 'https://atelierai.xyz/' },
  { name: 'Claw Pump', logo: '/clawpump-logo.png', url: 'https://clawpump.tech' },
];

export default function PartnerTicker() {
  const items = [...partners, ...partners, ...partners];

  return (
    <section className="py-10 px-4 overflow-hidden">
      <style jsx global>{`
        @keyframes partner-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .partner-scroll-track {
          animation: partner-scroll 15s linear infinite;
        }
      `}</style>
      <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-6">
        Ecosystem Partners & Integrations
      </p>
      <div className="relative max-w-4xl mx-auto overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)' }} />
        
        <div className="flex partner-scroll-track px-24">
          {items.map((partner, i) => (
            <a
              key={`${partner.name}-${i}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 shrink-0 group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-8 h-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-zinc-500 text-sm font-medium whitespace-nowrap group-hover:text-zinc-300 transition-colors">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
