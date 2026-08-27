'use client';

import { usePathname } from 'next/navigation';

/**
 * Cross-fades page content on route change.
 *
 * App Router swaps routes with a hard cut, which is jarring when most pages
 * open on a large heading against a flat ground. Keying this wrapper on the
 * pathname remounts it per route, replaying the animation.
 *
 * Important: the animation is applied to the page wrapper's CHILDREN, not to
 * this element. Every page renders its own <SaidNav/>, so animating opacity
 * here would fade the sticky navbar on every navigation — and a descendant
 * cannot opt out of an ancestor's opacity. Targeting siblings instead leaves
 * the nav untouched while the content transitions under it.
 *
 * Deliberately cheap: opacity plus a few pixels of translate, ~380ms, and it
 * respects prefers-reduced-motion. No layout properties are animated.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade">
      {children}
      <style>{`
        /* children of the page wrapper, excluding the sticky nav */
        .page-fade > * > *:not(nav) {
          animation: pageFade .38s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes pageFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-fade > * > *:not(nav) { animation: none; }
        }
      `}</style>
    </div>
  );
}
