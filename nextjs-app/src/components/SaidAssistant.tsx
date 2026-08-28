'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const text = String(children ?? '');
            const isBlock = (className?.includes('language-') ?? false) || text.includes('\n');
            return isBlock ? (
              <code {...props} className="block">{children}</code>
            ) : (
              <code {...props}>{children}</code>
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

  // Escape closes the panel — it's a modal-ish surface over the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
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
    <div className="said-assistant">
      {/* Chat panel */}
      <div className={`sa-panel${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="sa-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lb" src="/logo-black.png" alt="" width={20} height={20} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lw" src="/logo-white.png" alt="" width={20} height={20} />
          <div className="sa-title">
            <div className="sa-name">
              SAID Assistant
              {/* Verified on-chain: a registered + verified SAID agent. Links to its profile. */}
              <Link
                className="sa-verified mono"
                href="/agents/8GReKrDQyvCjFcQ3HASeLtS4gsTw6H6x3Ck2GhDq8Veb"
                title="Verified SAID agent — view on-chain profile"
                onClick={() => setOpen(false)}
              >
                <span className="sa-check">✓</span> VERIFIED
              </Link>
            </div>
            <div className="sa-sub">Trained on the SAID docs</div>
          </div>
          <button className="sa-close" onClick={() => setOpen(false)} aria-label="Close assistant">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="sa-msgs" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`sa-row ${m.role}`}>
              <div className="sa-bubble">
                {m.role === 'user' ? m.content : <Markdown>{m.content}</Markdown>}
              </div>
            </div>
          ))}
          {loading && (
            <div className="sa-row assistant">
              <div className="sa-bubble sa-typing">
                {[0, 150, 300].map((d) => (
                  <span key={d} style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
          {messages.length === 1 && !loading && (
            <div className="sa-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}
        </div>

        <form className="sa-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SAID…"
          />
          <button type="submit" disabled={!input.trim() || loading} aria-label="Send">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>

      {/* Launcher */}
      <button className="sa-launch" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close SAID assistant' : 'Open SAID assistant'}>
        <span className="sa-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lb" src="/logo-black.png" alt="" width={20} height={20} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lw" src="/logo-white.png" alt="" width={20} height={20} />
          <span className="sa-live" />
        </span>
        <span className="sa-launch-label">{open ? 'Close' : 'Ask SAID'}</span>
      </button>

      <style>{`
        .said-assistant{position:fixed;bottom:24px;left:24px;z-index:60;display:flex;flex-direction:column;align-items:flex-start;gap:12px}

        /* logo swaps with theme, like the nav mark */
        .said-assistant .lw{display:none}
        html[data-theme="dark"] .said-assistant .lb{display:none}
        html[data-theme="dark"] .said-assistant .lw{display:block}

        .said-assistant .sa-panel{
          display:flex;flex-direction:column;overflow:hidden;
          width:380px;max-width:calc(100vw - 48px);
          background:var(--bg);border:1px solid var(--line);border-radius:20px;
          box-shadow:0 24px 70px rgba(0,0,0,.18);
          transform-origin:bottom left;
          transition:height .22s cubic-bezier(.16,1,.3,1),opacity .18s,transform .22s cubic-bezier(.16,1,.3,1),background-color .5s,border-color .5s;
          height:0;opacity:0;transform:scale(.96);pointer-events:none;
        }
        .said-assistant .sa-panel.open{height:500px;max-height:70vh;opacity:1;transform:none;pointer-events:auto}

        .said-assistant .sa-head{display:flex;align-items:center;gap:11px;padding:14px 16px;border-bottom:1px solid var(--line);background:var(--card);transition:background-color .5s,border-color .5s}
        .said-assistant .sa-title{flex:1;min-width:0;line-height:1.3}
        .said-assistant .sa-name{display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:600;letter-spacing:-.01em}
        .said-assistant .sa-verified{display:inline-flex;align-items:center;gap:5px;font-size:9px;letter-spacing:.12em;color:var(--dim);border:1px solid var(--line);border-radius:99px;padding:3px 8px;text-decoration:none}
        .said-assistant .sa-verified:hover{color:var(--good);border-color:var(--good)}
        .said-assistant .sa-check{color:var(--good);font-size:9px}
        .said-assistant .sa-sub{margin-top:3px;font-size:11px;color:var(--faint)}
        .said-assistant .sa-close{background:none;border:0;padding:5px;border-radius:50%;color:var(--faint);cursor:pointer;display:flex}
        .said-assistant .sa-close:hover{color:var(--ink)}

        .said-assistant .sa-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
        .said-assistant .sa-row{display:flex}
        .said-assistant .sa-row.user{justify-content:flex-end}
        .said-assistant .sa-row.assistant{justify-content:flex-start}
        .said-assistant .sa-bubble{max-width:86%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.6}
        .said-assistant .sa-row.user .sa-bubble{background:var(--ink);color:var(--bg);white-space:pre-wrap;border-bottom-right-radius:6px}
        .said-assistant .sa-row.assistant .sa-bubble{background:var(--card);color:var(--ink);border:1px solid var(--line);border-bottom-left-radius:6px}

        .said-assistant .sa-typing{display:flex;gap:5px;padding:14px}
        .said-assistant .sa-typing span{width:5px;height:5px;border-radius:50%;background:var(--faint);animation:sa-bounce 1.1s infinite}
        @keyframes sa-bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}

        .said-assistant .sa-suggest{display:flex;flex-wrap:wrap;gap:6px;padding-top:2px}
        .said-assistant .sa-suggest button{font-size:11.5px;color:var(--dim);background:none;border:1px solid var(--line);border-radius:99px;padding:6px 12px;cursor:pointer;font-family:inherit}
        .said-assistant .sa-suggest button:hover{color:var(--ink);border-color:var(--ink)}

        .said-assistant .sa-form{display:flex;align-items:center;gap:8px;padding:12px;border-top:1px solid var(--line);background:var(--card);transition:background-color .5s,border-color .5s}
        .said-assistant .sa-form input{flex:1;min-width:0;padding:9px 14px;border:1px solid var(--line);border-radius:99px;background:var(--bg);color:var(--ink);font-size:13px;font-family:inherit;outline:none}
        .said-assistant .sa-form input::placeholder{color:var(--faint)}
        .said-assistant .sa-form input:focus{border-color:var(--ink)}
        .said-assistant .sa-form button{flex:none;width:32px;height:32px;border-radius:50%;border:0;background:var(--ink);color:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:opacity .2s}
        .said-assistant .sa-form button:disabled{opacity:.35;cursor:default}

        .said-assistant .sa-launch{display:flex;align-items:center;gap:10px;padding:11px 18px 11px 14px;border-radius:99px;border:1px solid var(--line);background:var(--bg);cursor:pointer;font-family:inherit;box-shadow:0 10px 30px rgba(0,0,0,.10);transition:border-color .3s,background-color .5s}
        .said-assistant .sa-launch:hover{border-color:var(--ink)}
        .said-assistant .sa-mark{position:relative;display:flex}
        .said-assistant .sa-live{position:absolute;top:-2px;right:-3px;width:7px;height:7px;border-radius:50%;background:var(--good);box-shadow:0 0 0 2px var(--bg)}
        .said-assistant .sa-launch-label{font-size:13.5px;font-weight:500;color:var(--ink)}

        /* markdown inside assistant bubbles */
        .said-assistant .md > :first-child{margin-top:0}
        .said-assistant .md > :last-child{margin-bottom:0}
        .said-assistant .md p{margin:6px 0}
        .said-assistant .md a{color:var(--ink);text-decoration:underline;text-underline-offset:2px;word-break:break-word}
        .said-assistant .md h1,.said-assistant .md h2{font-size:13px;font-weight:600;margin:8px 0 4px}
        .said-assistant .md h3{font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin:8px 0 4px}
        .said-assistant .md ul,.said-assistant .md ol{margin:6px 0;padding-left:18px}
        .said-assistant .md li{margin:3px 0}
        .said-assistant .md strong{font-weight:600}
        .said-assistant .md hr{border:0;border-top:1px solid var(--line);margin:8px 0}
        .said-assistant .md code{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:11.5px;background:var(--bg);border:1px solid var(--line);border-radius:5px;padding:1px 5px}
        .said-assistant .md code.block{display:block;white-space:pre;overflow-x:auto;padding:10px 12px;border-radius:10px;margin:8px 0}

        @media (max-width:640px){
          .said-assistant{bottom:16px;left:16px}
          .said-assistant .sa-panel{width:calc(100vw - 32px)}
        }
      `}</style>
    </div>
  );
}
