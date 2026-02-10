'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dot grid configuration
    const dotSpacing = 40;
    const baseDotSize = 1.5;
    const maxDotSize = 4;
    
    // Create dots with random phase offsets
    const dots: { x: number; y: number; phase: number; speed: number }[] = [];
    
    const initDots = () => {
      dots.length = 0;
      const cols = Math.ceil(canvas.width / dotSpacing) + 1;
      const rows = Math.ceil(canvas.height / dotSpacing) + 1;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: i * dotSpacing,
            y: j * dotSpacing,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5
          });
        }
      }
    };
    initDots();

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw dots
      dots.forEach(dot => {
        // Pulsating size based on sine wave
        const pulse = Math.sin(time * dot.speed + dot.phase);
        const size = baseDotSize + (pulse + 1) * 0.5 * (maxDotSize - baseDotSize) * 0.3;
        
        // Pulsating opacity
        const opacity = 0.15 + (pulse + 1) * 0.15;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Dot grid canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Subtle gradient overlay for depth */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(50, 50, 70, 0.15) 0%, transparent 60%)',
        }}
      />
    </>
  );
}
