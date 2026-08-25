"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-level motion runtime, ported from the handoff's shared script:
 * - rect-based scroll reveals for .rv/.ctaCard (fast scrolls can't skip them)
 * - count-ups for [data-count]
 * - nav compress (.scrolled) past 10px
 * - COPY buttons on .copy elements
 * Mount once per page (it re-arms on route change via usePathname).
 */
export default function SaidFx() {
  const pathname = usePathname();

  useEffect(() => {
    // reveals — rect-based so fast jumps can't skip them. Elements can arrive
    // late (client pages render after data fetches), so a MutationObserver
    // keeps the watch list current.
    const seen = new Set<HTMLElement>();
    let rvEls: HTMLElement[] = [];
    function collect() {
      document.querySelectorAll<HTMLElement>(".rv,.ctaCard").forEach((el) => {
        if (!seen.has(el)) { seen.add(el); rvEls.push(el); }
      });
    }
    collect();
    function reveal() {
      for (let i = rvEls.length - 1; i >= 0; i--) {
        const el = rvEls[i];
        if (el.getBoundingClientRect().top < innerHeight * 0.88) {
          el.classList.add("in");
          rvEls.splice(i, 1);
        }
      }
    }
    const mo = new MutationObserver(() => { collect(); reveal(); countCheck(); });
    mo.observe(document.body, { childList: true, subtree: true });

    // stats count-up — same rect-based trigger
    const fmt = (n: number) => n.toLocaleString("en-US");
    const cuSeen = new Set<HTMLElement>();
    let cuEls: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      cuSeen.add(el); cuEls.push(el);
    });
    function countCheck() {
      for (let i = cuEls.length - 1; i >= 0; i--) {
        const el = cuEls[i];
        if (el.getBoundingClientRect().top < innerHeight * 0.92) {
          cuEls.splice(i, 1);
          const target = +el.dataset.count!;
          const suf = el.dataset.suffix || "";
          const t0 = performance.now(), D = 1400;
          (function cu() {
            const p = Math.min(1, (performance.now() - t0) / D);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(Math.round(target * ease)) + suf;
            if (p < 1) requestAnimationFrame(cu);
          })();
        }
      }
    }

    // nav compress on scroll
    const navEl = document.querySelector("nav");
    function navCheck() {
      navEl?.classList.toggle("scrolled", scrollY > 10);
    }

    function onScroll() { reveal(); countCheck(); navCheck(); }
    addEventListener("scroll", onScroll, { passive: true });
    reveal(); countCheck(); navCheck();

    // copy buttons
    const copies = [...document.querySelectorAll<HTMLButtonElement>(".copy")];
    const handlers = copies.map((b) => {
      const h = () => {
        const host = b.parentElement;
        const code = host?.querySelector("code");
        let text = code?.textContent?.trim();
        if (!text && host) {
          // no <code> child (docs <pre> blocks) — copy the host minus buttons
          const clone = host.cloneNode(true) as HTMLElement;
          clone.querySelectorAll("button").forEach((x) => x.remove());
          text = clone.textContent?.trim() ?? "";
        }
        navigator.clipboard.writeText(text ?? "");
        b.textContent = "COPIED";
        setTimeout(() => { b.textContent = "COPY"; }, 1200);
      };
      b.addEventListener("click", h);
      return h;
    });

    return () => {
      mo.disconnect();
      removeEventListener("scroll", onScroll);
      copies.forEach((b, i) => b.removeEventListener("click", handlers[i]));
    };
  }, [pathname]);

  return null;
}
