'use client';

import { useEffect, useRef, useState } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { CircleIcon, CpuIcon } from '@/components/host/icons';

interface TerminalPanelProps {
  agentName?: string;
}

export default function TerminalPanel({ agentName = 'Atlas-01' }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const [connected] = useState(true);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.45,
      convertEol: true,
      theme: {
        background: '#000000',
        foreground: '#F4F4F5',
        cursor: '#F59E0B',
        cursorAccent: '#000000',
        selectionBackground: 'rgba(245, 158, 11, 0.25)',
        black: '#09090B',
        brightBlack: '#52525B',
        red: '#EF4444',
        brightRed: '#F87171',
        green: '#22C55E',
        brightGreen: '#4ADE80',
        yellow: '#F59E0B',
        brightYellow: '#FBBF24',
        blue: '#3B82F6',
        brightBlue: '#60A5FA',
        magenta: '#A855F7',
        brightMagenta: '#C084FC',
        cyan: '#06B6D4',
        brightCyan: '#22D3EE',
        white: '#E4E4E7',
        brightWhite: '#FFFFFF',
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(new WebLinksAddon());
    terminal.open(terminalRef.current);
    fitAddon.fit();

    terminal.writeln('\u001b[1;33mWelcome to your SAID agent terminal\u001b[0m');
    terminal.writeln(`Agent: ${agentName}`);
    terminal.writeln('\u001b[32mStatus: Running\u001b[0m');
    terminal.writeln("Type 'help' for available commands");
    terminal.writeln('');
    terminal.write('$ ');

    xtermRef.current = terminal;

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      xtermRef.current?.dispose();
      xtermRef.current = null;
    };
  }, [agentName]);

  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
        <div>
          <div className="flex items-center gap-2 text-white">
            <CpuIcon size={16} className="text-amber-500" />
            <h2 className="text-base font-semibold">Terminal</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Embedded CLI access for your running agent container. WebSocket connectivity will be wired in next.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-medium text-zinc-300">
          <CircleIcon size={10} color={connected ? '#22C55E' : '#EF4444'} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="flex-1 bg-black p-3 sm:p-4">
        <div className="h-full min-h-[320px] rounded-lg border border-white/10 bg-black p-2">
          <div ref={terminalRef} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
