"use client";

import { useEffect, useRef } from "react";
import { noise3D, isDark, clampDpr } from "@/lib/simplex";

/**
 * The living SAID mark: a simplex-noise dot field masked by the wordmark.
 * Assembles on load (1.6s), dissolves + scatters on scroll, soft gaussian
 * brightness under the pointer. Ported from design/handoff/SAID Home.html.
 */
export default function HeroMark() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;
    const dpr = clampDpr();
    const SP = 7;
    let W = 0, H = 0, t = 0, raf = 0;
    let mx = -1e4, my = -1e4;

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mx = (e.clientX - r.left) * dpr;
      my = (e.clientY - r.top) * dpr;
    };
    const onLeave = () => { mx = my = -1e4; };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);

    const off = document.createElement("canvas");
    const ox = off.getContext("2d")!;
    const birth = performance.now();

    function size() {
      const r = cv!.getBoundingClientRect();
      W = cv!.width = off.width = Math.round(r.width * dpr);
      H = cv!.height = off.height = Math.round(r.height * dpr);
    }
    addEventListener("resize", size);
    size();

    (function render() {
      raf = requestAnimationFrame(render);
      t += 0.014;
      const tb = t * 0.12, tf = tb * 1.67, tff = tb * 2.5;
      const born = Math.min(1, (performance.now() - birth) / 1600);
      const asm = Math.pow(1 - born, 2); // load assembly 1→0
      const diss = Math.max(asm, Math.min(1, Math.max(0, scrollY / ((H / dpr) * 1.4)))); // scroll dissolve 0→1
      const ease = diss * diss;
      const cols = Math.ceil(W / (SP * dpr)), rows = Math.ceil(H / (SP * dpr));
      ox.clearRect(0, 0, W, H);
      if (ease < 1) {
        const dark = isDark();
        for (let r = 0; r < rows; r++) {
          const py = r * SP * dpr, ny = r / rows;
          for (let c = 0; c < cols; c++) {
            const px = c * SP * dpr, nx = c / cols;
            const n = noise3D(nx * 1.5, ny * 1.5, tb) * 0.55
              + noise3D(nx * 3, ny * 3, tf) * 0.3
              + noise3D(nx * 6, ny * 6, tff) * 0.15;
            const nm = Math.min(1, Math.max(0, (n + 1) * 0.5));
            const total = Math.min(1, nm * 0.95);
            const rad = (0.6 + total * 2.6) * dpr;
            const a = (0.16 + total * 0.74) * (1 - ease);
            const dx = px - mx, dy = py - my, dist = Math.sqrt(dx * dx + dy * dy);
            const heat = Math.exp(-(dist * dist) / (2 * Math.pow(150 * dpr, 2))) * (0.35 + nm * 0.65);
            const l = dark ? Math.round(22 + total * 66) : Math.round(72 - total * 66);
            // scatter: each dot drifts along its own noise vector as you scroll
            const sx = px + noise3D(nx * 4 + 9, ny * 4, 7) * ease * 90 * dpr;
            const sy = py + (noise3D(nx * 4, ny * 4 + 9, 13) * 0.5 - 0.6) * ease * 130 * dpr;
            ox.beginPath();
            ox.arc(sx, sy, rad * (1 - ease * 0.4) * (1 + heat * 0.9), 0, Math.PI * 2);
            ox.fillStyle = `hsla(40,${dark ? 4 : 6}%,${heat > 0 ? (dark ? Math.min(96, l + heat * 40) : Math.max(4, l - heat * 40)) : l}%,${Math.min(1, a + heat * 0.4)})`;
            ox.fill();
          }
        }
        ox.globalCompositeOperation = "destination-in";
        ox.textAlign = "center";
        ox.textBaseline = "middle";
        ox.font = `900 ${H * 0.92}px "Helvetica Neue",Helvetica,-apple-system,system-ui,sans-serif`;
        // mask loosens as it dissolves so escaping dots survive at the edges
        ox.save();
        ox.translate(W / 2, H * 0.56);
        ox.scale(1 + ease * 0.5, 1 + ease * 0.5);
        ox.globalAlpha = 1;
        ox.fillText("SAID", 0, 0);
        ox.restore();
        ox.globalCompositeOperation = "source-over";
      }
      cx.clearRect(0, 0, W, H);
      cx.drawImage(off, 0, 0);
    })();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} id="mask" aria-hidden="true" />;
}
