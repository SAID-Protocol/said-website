'use client';

import { useEffect, useRef } from 'react';

// 3D Simplex noise implementation
const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
const perm = new Array(512);
for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

function dot3(g: number[], x: number, y: number, z: number) { return g[0]*x + g[1]*y + g[2]*z; }

function noise3D(x: number, y: number, z: number): number {
  const F3 = 1/3, G3 = 1/6;
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
    else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
    else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
  } else {
    if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
    else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
    else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
  }
  const x1=x0-i1+G3,y1=y0-j1+G3,z1=z0-k1+G3;
  const x2=x0-i2+2*G3,y2=y0-j2+2*G3,z2=z0-k2+2*G3;
  const x3=x0-1+3*G3,y3=y0-1+3*G3,z3=z0-1+3*G3;
  const ii=i&255,jj=j&255,kk=k&255;
  const gi0=perm[ii+perm[jj+perm[kk]]]%12;
  const gi1=perm[ii+i1+perm[jj+j1+perm[kk+k1]]]%12;
  const gi2=perm[ii+i2+perm[jj+j2+perm[kk+k2]]]%12;
  const gi3=perm[ii+1+perm[jj+1+perm[kk+1]]]%12;
  let n0=0,n1=0,n2=0,n3=0;
  let t0=0.6-x0*x0-y0*y0-z0*z0;
  if(t0>=0){t0*=t0;n0=t0*t0*dot3(grad3[gi0],x0,y0,z0);}
  let t1=0.6-x1*x1-y1*y1-z1*z1;
  if(t1>=0){t1*=t1;n1=t1*t1*dot3(grad3[gi1],x1,y1,z1);}
  let t2=0.6-x2*x2-y2*y2-z2*z2;
  if(t2>=0){t2*=t2;n2=t2*t2*dot3(grad3[gi2],x2,y2,z2);}
  let t3=0.6-x3*x3-y3*y3-z3*z3;
  if(t3>=0){t3*=t3;n3=t3*t3*dot3(grad3[gi3],x3,y3,z3);}
  return 32*(n0+n1+n2+n3);
}

// Agent-themed content that flows through the background
const AGENT_FRAGMENTS = [
  'EK3m', 'P45i', 'wgDE', 'Ets2', 'cEDf', 'hAs2', '0x80', '04A1', '69FB',
  '4a33', '2513', '6EB2', '9fA0', 'ceB6', 'D2e5', '39a4',
  'SOL', 'ETH', 'BASE', 'POLY', 'AVAX', 'ARB', 'OP', 'BNB', 'FTM', 'LINEA',
  'SAID', 'x402', 'A2A', 'KYA', 'MSG', 'SEND', 'RECV', 'SIGN', 'HASH',
  'VERIFY', 'TRUST', 'AGENT', 'RELAY', 'CHAIN', 'CROSS', 'LINK',
  '0x7f', '0x3a', '0xc2', '0x91', '0xBE', '0xAF', '0xDE', '0xCA',
  '@', '#', '$', '%', '&', '*', '=', '~', '<', '>', '?', '/', '|',
  '{', '}', '[', ']', '(', ')', ':', ';', '.', '!', '-', '_',
];

const ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=~<>?/|{}[]():;,.!-_';

interface AsciiBackgroundProps {
  agentThemed?: boolean;
  className?: string;
}

export default function AsciiBackground({ agentThemed = true, className }: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 2;
    const isLowEnd = cores <= 2;

    if (isMobile && isLowEnd) {
      canvas.style.display = 'none';
      return;
    }

    const fontSize = isMobile ? 20 : 17;
    const charWidth = isMobile ? 14 : 10;
    const charHeight = isMobile ? 22 : 17;
    const targetFps = isMobile ? 16 : isLowEnd ? 20 : 24;
    const noiseOctaves = (isMobile || isLowEnd) ? 2 : 3;
    const mouseRadius = isMobile ? 0 : 120;
    const baseSpeed = 0.10;

    let width = 0, height = 0;
    let cols = 0, rows = 0;
    let animationId: number | null = null;
    let mouseX = -1000, mouseY = -1000;
    let time = 0;
    let currentOpacity = 1;

    // Pre-compute color LUT — subtle amber tint
    const colorLUT: string[] = new Array(256);
    for (let c = 0; c < 256; c++) {
      const n = c / 255;
      const l = Math.round(8 + n * 35);
      const a = (0.4 + n * 0.5).toFixed(2);
      const hue = Math.round(45 + n * 15);
      const sat = Math.round(5 + n * 20);
      colorLUT[c] = `hsla(${hue},${sat}%,${l}%,${a})`;
    }

    // Fragment grid for agent-themed content
    let fragmentGrid: (string | null)[][] = [];
    let fragmentTimer = 0;
    const FRAGMENT_INTERVAL = 3;

    function generateFragmentGrid() {
      if (!agentThemed) return;
      fragmentGrid = [];
      for (let r = 0; r < rows; r++) {
        fragmentGrid[r] = new Array(cols).fill(null);
      }
      const count = Math.min(25, Math.floor((rows * cols) * 0.003));
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * (cols - 6));
        const frag = AGENT_FRAGMENTS[Math.floor(Math.random() * AGENT_FRAGMENTS.length)];
        for (let j = 0; j < frag.length && c + j < cols; j++) {
          fragmentGrid[r][c + j] = frag[j];
        }
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      cols = Math.ceil(width / charWidth);
      rows = Math.ceil(height / charHeight);
      ctx.font = `${fontSize}px "SF Mono","Geist Mono","JetBrains Mono",monospace`;
      ctx.textBaseline = 'top';
      generateFragmentGrid();
    }

    if (!isMobile) {
      const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
      const onMouseLeave = () => { mouseX = -1000; mouseY = -1000; };
      document.addEventListener('mousemove', onMouseMove, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave);
    }

    function updateScrollFade() {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewH = window.innerHeight;
      const fadeStart = viewH * 0.5;
      const fadeEnd = viewH * 2.5;
      if (scrollY <= fadeStart) currentOpacity = 1;
      else if (scrollY >= fadeEnd) currentOpacity = 0.25;
      else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        currentOpacity = 1 - progress * 0.75;
      }
      canvas.style.opacity = String(currentOpacity);
    }
    window.addEventListener('scroll', updateScrollFade, { passive: true });
    updateScrollFade();

    let lastFrame = 0;
    const interval = 1000 / targetFps;

    function render(now: number) {
      animationId = requestAnimationFrame(render);
      if (now - lastFrame < interval) return;
      lastFrame = now;
      if (currentOpacity < 0.05) return;

      time += 0.016;
      fragmentTimer += 0.016;

      if (agentThemed && fragmentTimer > FRAGMENT_INTERVAL) {
        fragmentTimer = 0;
        generateFragmentGrid();
      }

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      const timeBase = time * baseSpeed;
      const timeFast = timeBase * 1.67;
      const timeFaster = timeBase * 2.5;

      for (let row = 0; row < rows; row++) {
        const py = row * charHeight;
        const ny = row / rows;
        for (let col = 0; col < cols; col++) {
          const px = col * charWidth;
          const nx = col / cols;

          let noise = noise3D(nx * 1.5, ny * 1.5, timeBase) * 0.55;
          noise += noise3D(nx * 3, ny * 3, timeFast) * 0.3;
          if (noiseOctaves >= 3) {
            noise += noise3D(nx * 6, ny * 6, timeFaster) * 0.15;
          }

          if (mouseRadius > 0) {
            const dx = px - mouseX;
            const dy = py - mouseY;
            const distSq = dx * dx + dy * dy;
            if (distSq < mouseRadius * mouseRadius) {
              const dist = Math.sqrt(distSq);
              const strength = (mouseRadius - dist) / mouseRadius;
              noise += Math.sin(dist * 0.1 - time * 5) * strength * 0.35;
              noise += strength * 0.15;
            }
          }

          let normalized = (noise + 1) * 0.5;
          if (normalized < 0) normalized = 0;
          if (normalized > 1) normalized = 1;

          const ci = (normalized * 255) | 0;

          let char: string;
          if (agentThemed && fragmentGrid[row]?.[col]) {
            char = fragmentGrid[row][col]!;
            const brightIdx = Math.min(255, ci + 60);
            ctx.fillStyle = colorLUT[brightIdx];
          } else {
            const charIndex = (normalized * (ALL_CHARS.length - 1)) | 0;
            char = ALL_CHARS[charIndex];
            ctx.fillStyle = colorLUT[ci];
          }

          ctx.fillText(char, px, py);
        }
      }
    }

    const onVisChange = () => {
      if (document.hidden) {
        if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
      } else {
        if (!animationId) animationId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisChange);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize);

    resize();
    animationId = requestAnimationFrame(render);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', onVisChange);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', updateScrollFade);
    };
  }, [agentThemed]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(9,9,11,0.8) 100%)',
        }}
      />
    </>
  );
}
