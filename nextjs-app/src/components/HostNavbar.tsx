'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect, useRef } from 'react';

interface HostNavbarProps {
  noCollapse?: boolean;
}

export default function HostNavbar({ noCollapse = false }: HostNavbarProps) {
  const { login, logout, authenticated, user } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  // Close dropdown on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.host-avatar-wrap')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menuOpen]);

  // Scroll collapse
  useEffect(() => {
    if (noCollapse) return;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY.current;
      if (scrollY > 100 && scrollingDown) {
        setCollapsed(true);
      } else if (!scrollingDown) {
        setCollapsed(false);
      }
      if (scrollY <= 20) setCollapsed(false);
      lastScrollY.current = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [noCollapse]);

  const getInitial = () => {
    if (user?.email?.address) return user.email.address[0].toUpperCase();
    if (user?.twitter?.username) return user.twitter.username[0].toUpperCase();
    if (user?.google?.name) return user.google.name[0].toUpperCase();
    return '?';
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={`
            flex items-center gap-2 rounded-full
            border border-zinc-800/60
            transition-all duration-500 ease-in-out
            ${collapsed
              ? 'px-3 py-2 bg-zinc-950/95 backdrop-blur-xl shadow-lg shadow-black/30 scale-95'
              : 'px-3 py-2 bg-zinc-950/50 backdrop-blur-md'
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 px-2">
            <Image src="/logo-said-host.png" alt="SAID" width={24} height={24} priority />
            <span className="text-sm font-bold tracking-wide">SAID</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 border border-white/10 px-1.5 py-0.5 rounded ml-0.5">HOST</span>
          </Link>

          {/* Collapsible section */}
          <div
            className={`
              hidden md:flex items-center gap-2 transition-all duration-500 ease-in-out overflow-hidden
              ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[600px] opacity-100'}
            `}
          >
            <div className="w-px h-5 bg-zinc-700/50 shrink-0" />

            <div className="flex items-center shrink-0">
              <a href="/#features" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition rounded-full hover:bg-zinc-800/50 whitespace-nowrap">
                Features
              </a>
              <a href="/#pricing" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition rounded-full hover:bg-zinc-800/50 whitespace-nowrap">
                Pricing
              </a>
              <a href="https://www.saidprotocol.com/docs" className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition rounded-full hover:bg-zinc-800/50 whitespace-nowrap">
                Docs
              </a>
            </div>

            <div className="w-px h-5 bg-zinc-700/50 shrink-0" />

            <div className="flex items-center gap-1 shrink-0">
              <a href="https://x.com/saidinfra" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition rounded-full hover:bg-zinc-800/50" aria-label="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://discord.gg/saidprotocol" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition rounded-full hover:bg-zinc-800/50" aria-label="Discord">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="https://github.com/kaiclawd/said" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition rounded-full hover:bg-zinc-800/50" aria-label="GitHub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Auth — OUTSIDE collapsible so dropdown is never clipped */}
          {authenticated ? (
            <div className="relative shrink-0 hidden md:block host-avatar-wrap">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700 text-white text-[13px] font-semibold flex items-center justify-center transition-all cursor-pointer"
              >
                {getInitial()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] min-w-[160px] bg-zinc-950 border border-white/[.08] rounded-[10px] p-1 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,.5)] z-[100]">
                  <Link href="/dashboard" className="block w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-300 rounded-md hover:bg-white/5 hover:text-white transition text-left" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/billing" className="block w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-300 rounded-md hover:bg-white/5 hover:text-white transition text-left" onClick={() => setMenuOpen(false)}>
                    Billing
                  </Link>
                  <Link href="/dashboard?tab=settings" className="block w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-300 rounded-md hover:bg-white/5 hover:text-white transition text-left" onClick={() => setMenuOpen(false)}>
                    Settings
                  </Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full px-3.5 py-2.5 text-[13px] font-medium text-red-500 rounded-md hover:bg-red-500/[.08] transition text-left cursor-pointer">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => login()}
                className="hidden md:block px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition rounded-full hover:bg-zinc-800/50 whitespace-nowrap bg-transparent border-none cursor-pointer"
              >
                Log In
              </button>
              <a
                href="#pricing"
                className="hidden md:block px-3 py-1.5 text-sm font-semibold text-black bg-white rounded-full hover:bg-zinc-200 transition whitespace-nowrap no-underline"
              >
                Start Free Trial
              </a>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition ml-auto"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-4 right-4 z-40 md:hidden">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl">
            <div className="flex flex-col gap-2">
              <a href="/#features" className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="/#pricing" className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="https://www.saidprotocol.com/docs" className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>
                Docs
              </a>

              <div className="h-px bg-white/10 my-2" />

              <div className="flex items-center gap-3 px-4 py-2">
                <a href="https://x.com/saidinfra" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-800/50" aria-label="X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://discord.gg/saidprotocol" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-800/50" aria-label="Discord">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a href="https://github.com/kaiclawd/said" target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-zinc-800/50" aria-label="GitHub">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>

              <div className="h-px bg-white/10 my-2" />

              {authenticated ? (
                <>
                  <Link href="/dashboard" className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/billing" className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>
                    Billing
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="px-4 py-3 text-red-400 hover:bg-zinc-800/50 rounded-lg transition text-left">
                    Log Out
                  </button>
                </>
              ) : (
                <button onClick={() => { login(); setMobileMenuOpen(false); }} className="px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition text-center">
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
