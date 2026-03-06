'use client';

import { useEffect, useState, useRef } from 'react';

const CHAINS = ['Solana', 'Base', 'Polygon', 'Ethereum', 'Avalanche', 'Sei', 'Arbitrum', 'Optimism'];

interface ApiMessage {
  from: string;
  to: string;
  fromChain: string;
  toChain: string;
  timestamp: string;
  paid: boolean;
}

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

function randomMsg(): { text: string; id: number } {
  const from = CHAINS[Math.floor(Math.random() * CHAINS.length)];
  let to = CHAINS[Math.floor(Math.random() * CHAINS.length)];
  while (to === from) to = CHAINS[Math.floor(Math.random() * CHAINS.length)];
  const secs = Math.floor(Math.random() * 30) + 1;
  return {
    text: `${truncAddr()} (${from}) → ${truncAddr()} (${to}) — ${secs}s ago`,
    id: Date.now() + Math.random(),
  };
}

function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffSecs = Math.floor((now - then) / 1000);
  
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  return `${Math.floor(diffSecs / 86400)}d ago`;
}

function formatMessage(msg: ApiMessage): { text: string; id: string } {
  const fromChain = msg.fromChain.charAt(0).toUpperCase() + msg.fromChain.slice(1);
  const toChain = msg.toChain.charAt(0).toUpperCase() + msg.toChain.slice(1);
  
  return {
    text: `${msg.from} (${fromChain}) → ${msg.to} (${toChain}) — ${timeAgo(msg.timestamp)}`,
    id: msg.timestamp + msg.from + msg.to,
  };
}

export default function MessageTicker() {
  const [messages, setMessages] = useState<{ text: string; id: string | number }[]>([]);
  const [visible, setVisible] = useState(true);
  const [useRealMessages, setUseRealMessages] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchRealMessages = async () => {
    try {
      const res = await fetch('https://api.saidprotocol.com/api/messages/recent');
      if (!res.ok) throw new Error('API failed');
      
      const data: ApiMessage[] = await res.json();
      
      if (data && data.length > 0) {
        setUseRealMessages(true);
        const formatted = data.map(formatMessage);
        setMessages(formatted);
      } else {
        // No messages yet, fall back to random
        setUseRealMessages(false);
        setMessages([randomMsg(), randomMsg(), randomMsg()]);
      }
    } catch (err) {
      // API error, fall back to random
      console.log('MessageTicker: Falling back to random messages');
      setUseRealMessages(false);
      setMessages([randomMsg(), randomMsg(), randomMsg()]);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchRealMessages();

    // Fetch real messages every 30s, or rotate random messages every 3s
    const interval = setInterval(() => {
      if (useRealMessages) {
        fetchRealMessages();
      } else {
        setMessages(prev => {
          const next = [randomMsg(), ...prev];
          return next.slice(0, 5);
        });
      }
    }, useRealMessages ? 30000 : 3000);

    return () => clearInterval(interval);
  }, [useRealMessages]);

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
