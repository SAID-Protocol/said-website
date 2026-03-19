'use client';

import { useEffect, useRef } from 'react';

const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

const perm = new Array(512).fill(0).map((_, i) => p[i & 255]);
const FRAGS = ['EK3m','P45i','wgDE','Ets2','cEDf','hAs2','0x80','04A1','69FB','4a33','2513','6EB2','9fA0','ceB6','D2e5','39a4','SOL','ETH','BASE','POLY','AVAX','ARB','OP','SAID','x402','A2A','MSG','SEND','RECV','SIGN','HASH','VERIFY','TRUST','AGENT','RELAY','CHAIN','CROSS','LINK','0x7f','0x3a','0xc2','0x91','0xBE','0xAF','0xDE','0xCA','@','#','$','%','&','*','=','~','<','>','?','/','{','}','[',']','(',')',':',';','.','!','-','_'];
const ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=~<>?/|{}[]():;,.!-_';

function dot3(g: number[], x: number, y: number, z: number) {
  return g[0] * x + g[1] * y + g[2] * z;
}

function noise3D(x: number, y: number, z: number) {
  const F3 = 1 / 3;
  const G3 = 1 / 6;
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const x0 = x - (i - t);
  const y0 = y - (j - t);
  const z0 = z - (k - t);

  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
    } else {
      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
    }
  } else if (y0 < z0) {
    i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
  } else if (x0 < z0) {
    i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
  } else {
    i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
  }

  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2 * G3;
  const y2 = y0 - j2 + 2 * G3;
  const z2 = z0 - k2 + 2 * G3;
  const x3 = x0 - 1 + 3 * G3;
  const y3 = y0 - 1 + 3 * G3;
  const z3 = z0 - 1 + 3 * G3;
  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;
  const gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
  const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
  const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
  const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;

  let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * dot3(grad3[gi0], x0, y0, z0); }
  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * dot3(grad3[gi1], x1, y1, z1); }
  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * dot3(grad3[gi2], x2, y2, z2); }
  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 >= 0) { t3 *= t3; n3 = t3 * t3 * dot3(grad3[gi3], x3, y3, z3); }
  return 32 * (n0 + n1 + n2 + n3);
}

export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vignetteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const vignette = vignetteRef.current!;
    if (!canvas || !vignette) return;

    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const fontSize = 17;
    const charW = 10;
    const charH = 17;
    let W = 0, H = 0, cols = 0, rows = 0, time = 0, mouseX = -1000, mouseY = -1000, opacity = 1;
    let frags: Array<{ row: number; col: number; text: string; born: number; life: number; rd: number }> = [];
    let fragTimer = 0;
    const FRAG_INT = 1.5, RES_T = 0.15, SCR_T = 0.12, LIFE_MIN = 3, LIFE_MAX = 5.5;
    let fGrid: (string | null)[][] = [];
    let fBright: (number | null)[][] = [];
    let lastFrame = 0;
    let raf = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const colorLUT = new Array(256);
    for (let c = 0; c < 256; c++) {
      const n = c / 255;
      const l = Math.round(8 + n * 35);
      const a = (0.4 + n * 0.5).toFixed(2);
      const h = Math.round(45 + n * 15);
      const s = Math.round(5 + n * 20);
      colorLUT[c] = `hsla(${h},${s}%,${l}%,${a})`;
    }

    function spawnFrags() {
      const count = Math.min(8, Math.floor(rows * cols * 0.001));
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * Math.max(1, cols - 6));
        const txt = FRAGS[Math.floor(Math.random() * FRAGS.length)];
        const life = LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN);
        frags.push({ row: r, col: c, text: txt, born: time, life, rd: 0.06 + Math.random() * 0.04 });
      }
      if (frags.length > 60) frags = frags.slice(-60);
    }

    function updateFragGrids() {
      fGrid = [];
      fBright = [];
      for (let r = 0; r < rows; r++) {
        fGrid[r] = new Array(cols).fill(null);
        fBright[r] = new Array(cols).fill(null);
      }
      frags = frags.filter((f) => time - f.born < f.life);
      for (const f of frags) {
        const age = time - f.born;
        const scrStart = f.life - (f.text.length * f.rd + SCR_T);
        for (let j = 0; j < f.text.length && f.col + j < cols; j++) {
          if (f.row >= rows) continue;
          const crs = j * f.rd;
          const css = scrStart + j * f.rd;
          let st: 'n' | 'r' | 'd' | 's' = 'n';
          let pr = 0;
          if (age < crs) st = 'n';
          else if (age < crs + RES_T) { st = 'r'; pr = (age - crs) / RES_T; }
          else if (age < css) st = 'd';
          else if (age < css + SCR_T) { st = 's'; pr = (age - css) / SCR_T; }
          else st = 'n';
          if (st === 'n') continue;
          if (st === 'd') {
            fGrid[f.row][f.col + j] = f.text[j];
            fBright[f.row][f.col + j] = 1;
          } else if (st === 'r') {
            fGrid[f.row][f.col + j] = (pr > 0.7 || (pr > 0.4 && Math.random() < pr)) ? f.text[j] : ALL[Math.floor(Math.random() * ALL.length)];
            fBright[f.row][f.col + j] = pr * 0.7;
          } else {
            fGrid[f.row][f.col + j] = (pr < 0.3 || (pr < 0.6 && Math.random() < (1 - pr))) ? f.text[j] : ALL[Math.floor(Math.random() * ALL.length)];
            fBright[f.row][f.col + j] = (1 - pr) * 0.7;
          }
        }
      }
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      cols = Math.ceil(W / charW);
      rows = Math.ceil(H / charH);
      ctx.font = `${fontSize}px "SF Mono","JetBrains Mono",monospace`;
      ctx.textBaseline = 'top';
      spawnFrags();
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onMouseLeave() {
      mouseX = -1000;
      mouseY = -1000;
    }

    function onScroll() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y <= vh * 0.5) opacity = 1;
      else if (y >= vh * 2.5) opacity = 0.25;
      else opacity = 1 - ((y - vh * 0.5) / (vh * 2)) * 0.75;
      canvas.style.opacity = String(opacity);
      vignette.style.opacity = String(opacity);
    }

    function render(now: number) {
      raf = window.requestAnimationFrame(render);
      if (now - lastFrame < 42) return;
      lastFrame = now;
      if (opacity < 0.05) return;

      time += 0.016;
      fragTimer += 0.016;
      if (fragTimer > FRAG_INT) {
        fragTimer = 0;
        spawnFrags();
      }
      updateFragGrids();

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, W, H);
      const tb = time * 0.1;
      const tf = tb * 1.67;
      const tff = tb * 2.5;

      for (let row = 0; row < rows; row++) {
        const py = row * charH;
        const ny = row / rows;
        for (let col = 0; col < cols; col++) {
          const px = col * charW;
          const nx = col / cols;
          let n = noise3D(nx * 1.5, ny * 1.5, tb) * 0.55 + noise3D(nx * 3, ny * 3, tf) * 0.3 + noise3D(nx * 6, ny * 6, tff) * 0.15;
          const dx = px - mouseX;
          const dy = py - mouseY;
          const dSq = dx * dx + dy * dy;
          if (dSq < 14400) {
            const d = Math.sqrt(dSq);
            const s = (120 - d) / 120;
            n += Math.sin(d * 0.1 - time * 5) * s * 0.35 + s * 0.15;
          }
          let nm = (n + 1) * 0.5;
          if (nm < 0) nm = 0;
          if (nm > 1) nm = 1;
          const ci = (nm * 255) | 0;
          const fc = fGrid[row]?.[col];
          const fb = fBright[row]?.[col];
          let ch;
          if (fc && fb != null) {
            ch = fc;
            ctx.fillStyle = colorLUT[Math.min(255, ci + Math.round(60 * fb))];
          } else {
            ch = ALL[(nm * (ALL.length - 1)) | 0];
            ctx.fillStyle = colorLUT[ci];
          }
          ctx.fillText(ch, px, py);
        }
      }
    }

    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    resize();
    onScroll();
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    raf = window.requestAnimationFrame(render);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="ascii-bg-canvas" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100%', height: '100%' }} />
      <div ref={vignetteRef} className="ascii-bg-vignette" style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 30%, rgba(9,9,11,.8) 100%)' }} />
    </>
  );
}
