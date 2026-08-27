'use client';

import { usePathname } from 'next/navigation';

/**
 * Cross-fades page content on route change.
 *
 * App Router swaps routes with no transition at all, which reads as a hard
 * cut — especially jarring here because most pages open on a large heading
 * against a flat ground. Keying a wrapper on the pathname remounts it per
 * route, replaying a short fade-and-rise.
 *
 * Deliberately cheap: opacity + a few pixels of translate, ~380ms, and it
 * respects prefers-reduced-motion. No layout properties are animated, so it
 * can't cause reflow jank on heavy pages like the directory.
 */
export default function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade">
      {children}
      <style>{`
        .page-fade {
          animation: pageFade .38s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes pageFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-fade { animation: none; }
        }
      `}</style>
    </div>
  );
}
