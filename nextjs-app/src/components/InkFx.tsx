'use client';

import { useEffect } from 'react';

/**
 * Scroll engine for the ink homepage. One rAF-throttled scroll handler and
 * one IntersectionObserver drive everything; all effects are CSS-transitioned
 * and disabled wholesale under prefers-reduced-motion.
 *
 *  - .reveal / .stagger / [data-print]  → .in on viewport entry
 *  - [data-count]                       → count up to the server-rendered value
 *  - [data-parallax="0.12"]             → translateY at that fraction of scroll
 *  - [data-scrub]                       → sticky stage; child [data-step]s gain
 *    .on as scroll progress crosses each step's slot; [data-scrub-pct] readout
 */
export default function InkFx() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── viewport-entry effects ──
    const animateCount = (el: HTMLElement) => {
      const raw = el.textContent ?? '';
      const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
      const suffix = /\+\s*$/.test(raw) ? '+' : '';
      if (!Number.isFinite(target) || target <= 0) return;
      const t0 = performance.now();
      const DUR = 1100;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / DUR);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (reduced || !('IntersectionObserver' in window)) {
      document
        .querySelectorAll('.reveal, .stagger, [data-print], [data-scrub] [data-step]')
        .forEach((el) => el.classList.add('in', 'on'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          if ((e.target as HTMLElement).dataset.count !== undefined) {
            animateCount(e.target as HTMLElement);
          }
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal, .stagger, [data-print]').forEach((el) => io.observe(el));
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => io.observe(el));

    // ── scroll-driven effects ──
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const scrub = document.querySelector<HTMLElement>('[data-scrub]');
    const scrubSteps = scrub ? Array.from(scrub.querySelectorAll<HTMLElement>('[data-step]')) : [];
    const scrubPct = scrub?.querySelector<HTMLElement>('[data-scrub-pct]') ?? null;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;

        for (const el of parallaxEls) {
          const f = parseFloat(el.dataset.parallax ?? '0');
          el.style.transform = `translateY(${(-y * f).toFixed(1)}px)`;
        }

        if (scrub) {
          const r = scrub.getBoundingClientRect();
          const total = r.height - window.innerHeight;
          const p = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0;
          // steps occupy the middle band of the stage so there's settle room
          scrubSteps.forEach((el, i) => {
            el.classList.toggle('on', p >= 0.12 + i * (0.72 / scrubSteps.length));
          });
          if (scrubPct) scrubPct.textContent = `${Math.round(p * 100)}%`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return null;
}
