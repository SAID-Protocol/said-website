'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircleIcon, SparklesIcon } from '@/components/host/icons';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [];

const AGENT_REPLIES = [
  'I am online and ready. Want to test a workflow, review my instructions, or inspect recent activity?',
  'Understood. I can help validate prompts, summarize state, or walk through a mock execution path.',
  'That makes sense. If you update my instructions, I can help you compare the expected behavior before deploying changes.',
  'I am ready for the next task. Try asking for a status summary, a research plan, or a quick operational check.',
];

function formatTime(timestamp: Date) {
  return timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = input.trim();
    if (!content || isLoading) return;

    const nextIndex = messages.filter((message) => message.role === 'user').length;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const agentMessage: Message = {
      id: crypto.randomUUID(),
      role: 'agent',
      content: AGENT_REPLIES[nextIndex % AGENT_REPLIES.length] ?? AGENT_REPLIES[0],
      timestamp: new Date(),
    };

    setMessages((current) => [...current, agentMessage]);
    setIsLoading(false);
  };

  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <MessageCircleIcon size={16} className="text-amber-500" />
              <h2 className="text-base font-semibold">Agent Chat</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Talk to your hosted agent in real time and test how it responds to your current instructions.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            Live mock session
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-6 text-center">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
              <SparklesIcon size={20} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-white">Your agent is ready. Say hello!</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
              Start a conversation to preview your agent&apos;s tone, reasoning style, and task handling.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';

            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl border px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ${
                    isUser
                      ? 'border-amber-500/30 bg-amber-500/10 text-white'
                      : 'border-white/10 bg-black/30 text-zinc-100'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                    <span>{isUser ? 'You' : 'Agent'}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-zinc-300">
              <div className="mb-1 text-xs uppercase tracking-[0.16em] text-zinc-500">Agent</div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500 [animation-delay:300ms]" />
                <span className="text-sm text-zinc-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="border-t border-white/10 bg-black/20 p-4 sm:p-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your agent to summarize, plan, or explain..."
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
