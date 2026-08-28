"use client";

import { useEffect, useRef } from "react";
import { noise3D, isDark, clampDpr } from "@/lib/simplex";

/** Ambient breathing dot field behind an ink CTA card — `#ctadots` in the handoff. */
export default function CtaDots() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const x = c.getContext("2d");
    if (!x) return;
    const dpr = clampDpr();
    let cW = 0, cH = 0, ct = 0, vis = false, raf = 0;

    function size() {
      const r = c!.getBoundingClientRect();
      cW = c!.width = Math.round(r.width * dpr);
      cH = c!.height = Math.round(r.height * dpr);
    }
    addEventListener("resize", size);
    size();
    const io = new IntersectionObserver((es) => es.forEach((e) => { vis = e.isIntersecting; }));
    io.observe(c);

    (function crender() {
      raf = requestAnimationFrame(crender);
      if (!vis) return;
      if (cW === 0) size();
      ct += 0.012;
      const SP2 = 16 * dpr;
      const cols = Math.ceil(cW / SP2), rows = Math.ceil(cH / SP2);
      const dark = isDark();
      x!.clearRect(0, 0, cW, cH);
      for (let r = 0; r < rows; r++) for (let cc = 0; cc < cols; cc++) {
        const n = noise3D((cc / cols) * 2.2, (r / rows) * 2.2, ct * 0.14);
        const v = Math.min(1, Math.max(0, (n + 1) * 0.5));
        x!.beginPath();
        x!.arc(cc * SP2, r * SP2, (0.5 + v * 1.4) * dpr, 0, Math.PI * 2);
        x!.fillStyle = dark
          ? `hsla(40,6%,20%,${0.04 + v * 0.12})`
          : `hsla(40,10%,90%,${0.04 + v * 0.12})`;
        x!.fill();
      }
    })();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="ctadots" aria-hidden="true" />;
}
