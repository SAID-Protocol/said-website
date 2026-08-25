"use client";

import { useEffect, useRef } from "react";
import { noise3D, isDark, clampDpr } from "@/lib/simplex";

let seamIndex = 0;

/** 64px noise-dot canvas strip between sections — `.dotdiv` in the handoff. */
export default function DotSeam({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const x = c.getContext("2d");
    if (!x) return;
    const dpr = clampDpr();
    const di = seamIndex++;
    let dt = Math.random() * 10;
    let raf = 0;

    function size() {
      const r = c!.getBoundingClientRect();
      c!.width = Math.round(r.width * dpr);
      c!.height = Math.round(64 * dpr);
    }
    addEventListener("resize", size);
    size();

    (function drender() {
      raf = requestAnimationFrame(drender);
      dt += 0.012;
      const r = c!.getBoundingClientRect();
      if (r.width === 0 || r.bottom < 0 || r.top > innerHeight) return;
      if (c!.width === 0) size();
      const dark = isDark();
      const W = c!.width, H = c!.height, SPD = 11 * dpr;
      const cols = Math.ceil(W / SPD), rows = Math.ceil(H / SPD);
      x!.clearRect(0, 0, W, H);
      for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) {
        const n = noise3D((cc / cols) * 3 + di * 7, (rr / rows) * 1.2, dt * 0.15);
        const v = Math.min(1, Math.max(0, (n + 1) * 0.5));
        const ey = 1 - Math.abs(((rr + 0.5) / rows) * 2 - 1);
        const ex = Math.min(1, Math.min(cc, cols - 1 - cc) / (cols * 0.18));
        const a = (0.05 + v * 0.3) * ey * ex;
        if (a < 0.02) continue;
        x!.beginPath();
        x!.arc(cc * SPD + SPD / 2, rr * SPD + SPD / 2, (0.5 + v * 1.5) * dpr, 0, Math.PI * 2);
        x!.fillStyle = `hsla(40,${dark ? 4 : 6}%,${dark ? Math.round(30 + v * 50) : Math.round(64 - v * 50)}%,${a})`;
        x!.fill();
      }
    })();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={ref} className="dotdiv" style={style} aria-hidden="true" />;
}
