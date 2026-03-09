'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircleIcon } from '@/components/host/icons';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'agent',
    content:
      'Demo Agent is online. I can monitor wallet activity, summarize market moves, and execute pre-approved workflows.',
    timestamp: new Date('2026-03-08T20:12:00'),
  },
  {
    id: 'm2',
    role: 'user',
    content:
      'Give me a quick update on today’s activity and flag anything that needs manual review.',
    timestamp: new Date('2026-03-08T20:12:36'),
  },
  {
    id: 'm3',
    role: 'agent',
    content:
      'Since 09:00, I processed 18 inbound messages, opened 4 research tasks, and completed 2 simulated trades. One task needs manual review: a wallet transfer request exceeded the configured risk threshold.',
    timestamp: new Date('2026-03-08T20:13:10'),
  },
  {
    id: 'm4',
    role: 'user',
    content: 'What caused the transfer request to be blocked?',
    timestamp: new Date('2026-03-08T20:13:44'),
  },
  {
    id: 'm5',
    role: 'agent',
    content:
      'The destination address was new, the amount was 2.3x higher than the daily baseline, and no allowlist match was found. I paused execution and logged the event in the activity feed.',
    timestamp: new Date('2026-03-08T20:14:12'),
  },
];

const AGENT_REPLY =
  'Risk profile remains unchanged. The latest simulated trade closed with a 1.8% gain, slippage stayed within tolerance, and no additional approval gates were triggered.';

const formatTimestamp = (date: Date) =>
  date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-2 w-2 animate-pulse rounded-full bg-zinc-400"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </div>
  );
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState(
    'Summarize the latest trade and tell me whether the risk profile changed.'
  );
  const [isTyping, setIsTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `m-${Date.now()}-agent`,
          role: 'agent',
          content: AGENT_REPLY,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <section className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
        <div>
          <div className="flex items-center gap-2 text-white">
            <MessageCircleIcon size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Live Chat</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Test responses before shipping instruction changes.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Agent online
        </div>
      </div>

      <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl border px-4 py-3 shadow-sm ${
                  isUser
                    ? 'border-amber-500/30 bg-amber-500 text-black'
                    : 'border-white/10 bg-zinc-900 text-white'
                }`}
              >
                <p className="text-sm leading-6">{message.content}</p>
                <p className={`mt-2 text-[11px] ${isUser ? 'text-black/70' : 'text-zinc-500'}`}>
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4 sm:p-5">
        <div className="flex items-end gap-3">
          <div className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-3 focus-within:border-white/20">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              placeholder="Message your agent..."
              className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || isTyping}
            className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
