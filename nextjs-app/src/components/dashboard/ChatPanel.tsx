'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { MessageCircleIcon } from '@/components/host/icons';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  agentId: string;
}

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

export default function ChatPanel({ agentId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: 'Hello! I\'m ready to chat. Ask me anything or test my capabilities.',
      timestamp: new Date(),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
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
    setError(null);

    try {
      const response = await api.chatWithAgent(agentId, trimmed);

      let responseText = 'No response received';

      let d = response.data as Record<string, unknown>;

      if (typeof d === 'string') {
        try {
          d = JSON.parse(d);
        } catch {
          responseText = String(d);
          d = null as unknown as Record<string, unknown>;
        }
      }

      if (d && typeof d === 'object' && 'data' in d && typeof d.data === 'object' && d.data !== null) {
        const inner = d.data as Record<string, unknown>;
        if ('choices' in inner) d = inner;
      }

      if (d && typeof d === 'object') {
        if ('choices' in d && Array.isArray(d.choices) && d.choices.length > 0) {
          const choice = d.choices[0] as Record<string, unknown>;
          const msg = choice.message as Record<string, unknown> | undefined;
          responseText = String(msg?.content ?? 'No content');
        } else if ('response' in d) {
          responseText = String(d.response);
        } else if ('content' in d) {
          responseText = String(d.content);
        } else if ('message' in d && typeof d.message === 'string') {
          responseText = d.message;
        } else if ('error' in d) {
          responseText = `Error: ${typeof d.error === 'string' ? d.error : JSON.stringify(d.error)}`;
        } else {
          responseText = JSON.stringify(d);
        }
      }

      setMessages((current) => [
        ...current,
        {
          id: `m-${Date.now()}-agent`,
          role: 'agent',
          content: responseText,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMsg);

      setMessages((current) => [
        ...current,
        {
          id: `m-${Date.now()}-error`,
          role: 'agent',
          content: `Error: ${errorMsg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex flex-none items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
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

      {error && (
        <div className="flex-none border-b border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div ref={scrollerRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
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
                <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
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

      <div className="flex-none border-t border-white/10 p-4 sm:p-5">
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
