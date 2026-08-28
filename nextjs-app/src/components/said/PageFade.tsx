'use client';

import { usePathname } from 'next/navigation';

/**
 * Cross-fades page content on route change.
 *
 * App Router swaps routes with a hard cut, which is jarring when most pages
 * open on a large heading against a flat ground. Keying this wrapper on the
 * pathname remounts it per route, replaying the animation.
 *
 * Opacity only — no transform. Any movement reads as a jump on navigation,
 * and translating the wrapper also shifts everything inside it. The navbar
 * now lives in the layout (see SiteNav) rather than in each page, so it sits
 * outside this element entirely and never fades or remounts.
 *
 * Respects prefers-reduced-motion. No layout properties are animated, so this
 * cannot cause reflow on heavy pages like the directory.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade">
      {children}
      <style>{`
        .page-fade {
          animation: pageFade .3s ease-out both;
        }
        @keyframes pageFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-fade { animation: none; }
        }
      `}</style>
    </div>
  );
}
