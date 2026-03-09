'use client';

import { useEffect, useRef, useState } from 'react';
import { TerminalIcon } from '@/components/host/icons';

export default function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [connected] = useState(true);

  useEffect(() => {
    let term: import('xterm').Terminal | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let mounted = true;

    const boot = async () => {
      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
        import('xterm'),
        import('@xterm/addon-fit'),
        import('@xterm/addon-web-links'),
      ]);
      await import('xterm/css/xterm.css');

      if (!mounted || !terminalRef.current) return;

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      term = new Terminal({
        cursorBlink: true,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: 13,
        lineHeight: 1.35,
        theme: {
          background: '#000000',
          foreground: '#4ADE80',
          cursor: '#F59E0B',
          selectionBackground: 'rgba(245, 158, 11, 0.25)',
          black: '#000000',
          green: '#4ADE80',
          brightGreen: '#86EFAC',
          white: '#E4E4E7',
          brightWhite: '#FFFFFF',
        },
      });

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln('SAID Agent Terminal v1.0');
      term.writeln('Agent: Demo Agent');
      term.writeln('Status: Running');
      term.writeln('');
      term.write('$ ');

      let currentLine = '';
      term.onData((data) => {
        if (data === '\r') {
          term.write('\r\n');
          if (currentLine.trim()) {
            term.writeln(`echo: ${currentLine}`);
          }
          currentLine = '';
          term.write('$ ');
          return;
        }

        if (data === '\u007F') {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
          return;
        }

        if (data >= ' ') {
          currentLine += data;
          term.write(data);
        }
      });

      resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminalRef.current);
    };

    boot();

    return () => {
      mounted = false;
      resizeObserver?.disconnect();
      term?.dispose();
    };
  }, []);

  return (
    <section className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
        <div>
          <div className="flex items-center gap-2 text-white">
            <TerminalIcon size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Terminal</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Interactive runtime shell preview for your hosted agent.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <div className="flex-1 bg-black p-3 sm:p-4">
        <div ref={terminalRef} className="h-full min-h-[240px] w-full rounded-lg border border-white/10 bg-black p-2" />
      </div>
    </section>
  );
}
