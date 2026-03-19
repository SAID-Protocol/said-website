'use client';

import { useEffect, useRef, useState } from 'react';

export default function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termInstanceRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!containerRef.current || termInstanceRef.current) return;
    let disposed = false;

    (async () => {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('@xterm/addon-fit');

      if (disposed || !containerRef.current) return;

      const term = new Terminal({
        theme: { background: '#000000', foreground: '#d4d4d8', cursor: '#f59e0b', selectionBackground: '#f59e0b33' },
        fontFamily: 'JetBrains Mono, Menlo, monospace',
        fontSize: 13,
        cursorBlink: true,
        convertEol: true,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(containerRef.current);
      fitAddon.fit();

      term.writeln('\x1b[38;2;245;158;11m  SAID Agent Terminal v1.0\x1b[0m');
      term.writeln('');
      term.writeln('  Agent:  \x1b[1mDemo Agent\x1b[0m');
      term.writeln('  Status: \x1b[32mRunning\x1b[0m');
      term.writeln('');
      term.write('$ ');

      let currentLine = '';
      term.onData((data: string) => {
        if (data === '\r') {
          term.writeln('');
          const cmd = currentLine.trim();
          if (cmd === 'help') {
            term.writeln('  \x1b[38;2;245;158;11mCommands:\x1b[0m status, logs, config, restart, help');
          } else if (cmd === 'status') {
            term.writeln('  \x1b[32mRunning\x1b[0m | Uptime: 3d 14h | Credits: 3.2/5.0');
          } else if (cmd) {
            term.writeln(`  \x1b[90mUnknown: ${cmd}\x1b[0m`);
          }
          currentLine = '';
          term.write('$ ');
        } else if (data === '\x7f') {
          if (currentLine.length > 0) { currentLine = currentLine.slice(0, -1); term.write('\b \b'); }
        } else if (data >= ' ') {
          currentLine += data;
          term.write(data);
        }
      });

      const ro = new ResizeObserver(() => { try { fitAddon.fit(); } catch {} });
      if (containerRef.current) ro.observe(containerRef.current);

      termInstanceRef.current = { term, ro };
      setConnected(true);
    })();

    return () => {
      disposed = true;
      if (termInstanceRef.current) {
        termInstanceRef.current.ro.disconnect();
        termInstanceRef.current.term.dispose();
        termInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-xl border border-white/10 bg-black overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-medium text-zinc-400">Terminal</span>
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
          {connected ? 'Connected' : 'Connecting...'}
        </span>
      </div>
      <div ref={containerRef} className="flex-1 p-1" />
    </div>
  );
}
