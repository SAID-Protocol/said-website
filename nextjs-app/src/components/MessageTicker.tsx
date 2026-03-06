'use client';

import { useEffect, useState, useRef } from 'react';

const CHAINS = ['Solana', 'Base', 'Polygon', 'Ethereum', 'Avalanche', 'Sei', 'Arbitrum', 'Optimism'];

function truncAddr(): string {
  const hex = '0123456789abcdef';
  const isEvm = Math.random() > 0.4;
  if (isEvm) {
    const start = Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join('');
    const end = Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join('');
    return `0x${start}…${end}`;
  }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  const start = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const end = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${start}…${end}`;
}

function timeAgo(timestamp: string): string {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface TickerMessage {
  text: string;
  id: number;
  real?: boolean;
}

function randomMsg(): TickerMessage {
  const from = CHAINS[Math.floor(Math.random() * CHAINS.length)];
  let to = CHAINS[Math.floor(Math.random() * CHAINS.length)];
  while (to === from) to = CHAINS[Math.floor(Math.random() * CHAINS.length)];
  const secs = Math.floor(Math.random() * 30) + 1;
  return {
    text: `${truncAddr()} (${from}) → ${truncAddr()} (${to}) — ${secs}s ago`,
    id: Date.now() + Math.random(),
    real: false,
  };
}

export default function MessageTicker() {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const realMessagesRef = useRef<TickerMessage[]>([]);
  const realIndexRef = useRef(0);

  // Fetch real messages from API
  useEffect(() => {
    async function fetchReal() {
      try {
        const res = await fetch('https://api.saidprotocol.com/api/messages/recent');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          realMessagesRef.current = data.map((msg: any) => ({
            text: `${msg.from} (${capitalize(msg.fromChain)}) → ${msg.to} (${capitalize(msg.toChain)}) — ${timeAgo(msg.timestamp)}`,
            id: Date.now() + Math.random(),
            real: true,
          }));
          realIndexRef.current = 0;
        }
      } catch {
        // fallback to simulated
      }
    }
    fetchReal();
    const interval = setInterval(fetchReal, 30000);
    return () => clearInterval(interval);
  }, []);

  // Rotate messages — mix real and simulated
  useEffect(() => {
    setMessages([nextMessage(), nextMessage(), nextMessage()]);

    const interval = setInterval(() => {
      setMessages(prev => {
        const next = [nextMessage(), ...prev];
        return next.slice(0, 5);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  function nextMessage(): TickerMessage {
    const real = realMessagesRef.current;
    // 60% chance to show a real message if available
    if (real.length > 0 && Math.random() < 0.6) {
      const msg = { ...real[realIndexRef.current % real.length], id: Date.now() + Math.random() };
      realIndexRef.current++;
      return msg;
    }
    return randomMsg();
  }

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY < window.innerHeight * 2);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible || messages.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[90vw]"
    >
      <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 rounded-full px-5 py-2.5 flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <div className="overflow-hidden flex-1 relative h-5">
          {messages.slice(0, 1).map((msg) => (
            <div
              key={msg.id}
              className="text-xs text-zinc-400 font-mono whitespace-nowrap animate-slide-in absolute inset-0 flex items-center"
            >
              {msg.real && <span className="text-emerald-400 mr-1.5">●</span>}
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 text-[10px] text-zinc-600 font-mono">LIVE</div>
      </div>
      <style jsx>{`
        @keyframes slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          85% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        .animate-slide-in {
          animation: slide-in 3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
