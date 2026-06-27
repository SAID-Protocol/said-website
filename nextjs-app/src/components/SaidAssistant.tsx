'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Msg = { role: 'user' | 'assistant'; content: string };

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Hi — I'm SAID, a verified agent on the protocol. Ask me anything about registering, verification, reputation, grants, the passport, or integrating SAID.",
};

const SUGGESTIONS = ['How do I register?', 'What is the Trust Score?', 'How do grants work?'];

/** Renders an assistant message as markdown — links, bold, inline/block code, lists. */
function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-1.5 [&_a]:break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline underline-offset-2 hover:text-blue-300" />
          ),
          h1: (props) => <h1 {...props} className="text-[13px] font-bold text-white mt-1 first:mt-0" />,
          h2: (props) => <h2 {...props} className="text-[13px] font-semibold text-white mt-1 first:mt-0" />,
          h3: (props) => <h3 {...props} className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mt-1 first:mt-0" />,
          hr: () => <hr className="border-zinc-800 my-1" />,
          p: (props) => <p {...props} className="first:mt-0 last:mb-0" />,
          ul: (props) => <ul {...props} className="list-disc pl-4 space-y-0.5" />,
          ol: (props) => <ol {...props} className="list-decimal pl-4 space-y-0.5" />,
          strong: (props) => <strong {...props} className="font-semibold text-white" />,
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const text = String(children ?? '');
            const isBlock = (className?.includes('language-') ?? false) || text.includes('\n');
            return isBlock ? (
              <code {...props} className="block whitespace-pre overflow-x-auto rounded-lg bg-black/60 p-2.5 font-mono text-[12px] ring-1 ring-zinc-800">
                {children}
              </code>
            ) : (
              <code {...props} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[12px]">
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default function SaidAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1) }), // drop the seeded greeting
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply ?? '…' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Connection error — please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-3">
      {/* Chat panel */}
      <div
        className={`flex w-[360px] max-w-[calc(100vw-3rem)] origin-bottom-left flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-black/95 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-200 ${
          open
            ? 'pointer-events-auto h-[480px] max-h-[70vh] scale-100 opacity-100'
            : 'pointer-events-none h-0 scale-95 opacity-0'
        }`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-zinc-800 px-4 py-3">
          <img src="/logo-dark.png" alt="SAID" width={20} height={20} className="block" />
          <div className="flex-1 leading-tight">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              SAID Assistant
              {/* Verified on-chain: a registered + verified SAID agent
                  (8GReKrDQyvCjFcQ3HASeLtS4gsTw6H6x3Ck2GhDq8Veb). Links to its profile. */}
              <a
                href="https://www.saidprotocol.com/agents/8GReKrDQyvCjFcQ3HASeLtS4gsTw6H6x3Ck2GhDq8Veb"
                target="_blank"
                rel="noopener noreferrer"
                title="Verified SAID agent — view on-chain profile"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 transition-colors hover:text-emerald-400"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
                Verified
              </a>
            </div>
            <div className="text-[11px] text-zinc-500">Trained on the SAID docs</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="rounded-full p-1 text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                  m.role === 'user'
                    ? 'whitespace-pre-wrap bg-white text-black'
                    : 'bg-zinc-900 text-zinc-200 ring-1 ring-zinc-800'
                }`}
              >
                {m.role === 'user' ? m.content : <Markdown>{m.content}</Markdown>}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl bg-zinc-900 px-3.5 py-3 ring-1 ring-zinc-800">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-zinc-800 p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SAID…"
            className="flex-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-zinc-200 disabled:opacity-40"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>

      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close SAID assistant' : 'Open SAID assistant'}
        className="group flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-950/90 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-xl transition hover:border-zinc-600 hover:bg-zinc-900"
      >
        <span className="relative flex">
          <img src="/logo-dark.png" alt="SAID" width={22} height={22} className="block" />
          <span className="absolute -right-1 -top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        </span>
        <span className="text-sm font-medium text-white">{open ? 'Close' : 'Ask SAID'}</span>
      </button>
    </div>
  );
}
