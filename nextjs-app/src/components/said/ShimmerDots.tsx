"use client";

import { useEffect, useRef } from "react";

/**
 * Neutral sine-shimmer dot field that fills its positioned parent — the
 * ambient treatment used inside champion cards and other special containers.
 * `inverted` = the container sits on var(--ink) (flips with theme).
 */
export default function ShimmerDots({ inverted }: { inverted?: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const x = c.getContext("2d");
    if (!x) return;
    const dp = Math.min(2, devicePixelRatio || 1);
    let w = 0, h = 0, tt = Math.random() * 10, raf = 0;
    function sz() {
      const r = c!.getBoundingClientRect();
      w = c!.width = Math.round(r.width * dp);
      h = c!.height = Math.round(r.height * dp);
    }
    addEventListener("resize", sz);
    sz();
    (function rn() {
      raf = requestAnimationFrame(rn);
      const r = c!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (w === 0) sz();
      tt += 0.012;
      const SP = 15 * dp;
      const cols = Math.ceil(w / SP), rows = Math.ceil(h / SP);
      const dark = document.documentElement.dataset.theme === "dark";
      const bgIsDark = inverted ? !dark : dark;
      const l = bgIsDark ? 68 : 44;
      x!.clearRect(0, 0, w, h);
      for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) {
        const v = (Math.sin(cc * 0.7 + tt) + Math.cos(rr * 0.9 + tt * 1.3) + 2) / 4;
        x!.beginPath();
        x!.arc(cc * SP, rr * SP, (0.4 + v * 1.2) * dp, 0, Math.PI * 2);
        x!.fillStyle = `hsla(40,${bgIsDark ? 8 : 6}%,${l}%,${0.03 + v * 0.09})`;
        x!.fill();
      }
    })();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", sz); };
  }, [inverted]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
