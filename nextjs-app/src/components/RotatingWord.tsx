'use client';

import { useState, useEffect, useRef } from 'react';

const WORDS = ['Communication', 'Identity', 'Verification', 'Reputation', 'Trust'];

export default function RotatingWord() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'visible' | 'exit' | 'enter'>('visible');
  const [currentWidth, setCurrentWidth] = useState<number | undefined>(undefined);
  const textRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure width whenever word changes
  useEffect(() => {
    if (measureRef.current) {
      measureRef.current.textContent = WORDS[currentIndex];
      setCurrentWidth(measureRef.current.offsetWidth);
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase('exit');

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % WORDS.length);
        setPhase('enter');

        setTimeout(() => {
          setPhase('visible');
        }, 300);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hidden measurer — same font as the h1 */}
      <span
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          fontFamily: 'inherit',
          letterSpacing: 'inherit',
        }}
        aria-hidden="true"
      />

      <span
        style={{
          display: 'inline-block',
          width: currentWidth ? `${currentWidth}px` : 'auto',
          transition: 'width 0.4s ease-in-out',
          overflow: 'hidden',
          verticalAlign: 'bottom',
          height: '1.1em',
          position: 'relative',
        }}
      >
        <span
          ref={textRef}
          style={{
            display: 'block',
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            transform:
              phase === 'exit'
                ? 'translateY(110%)'
                : phase === 'enter'
                ? 'translateY(-110%)'
                : 'translateY(0)',
            opacity: phase === 'visible' ? 1 : 0,
            lineHeight: '1.15em',
          }}
        >
          {WORDS[currentIndex]}
        </span>
      </span>
    </>
  );
}
