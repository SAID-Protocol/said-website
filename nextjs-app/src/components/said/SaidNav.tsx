"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/said/ThemeToggle";
import { API_URL } from '@/lib/api';
import { clearCache, readCache, writeCache } from '@/lib/cache';

const LINKS: Array<[string, string, boolean?]> = [
  ["Directory", "/agents"],
  ["Docs", "/docs"],
  ["$SAID", "/token"],
  ["Agent", "https://agent.saidprotocol.com", true],
];

/** Redesign navbar — handoff design language, existing Privy auth preserved. */
export default function SaidNav() {
  const pathname = usePathname();
  const { login, logout, authenticated } = usePrivy();
  const { sessionToken } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  // The nav remounts on every route change, so a bare fetch here made the
  // avatar visibly reload on each navigation. Paint the cached one first,
  // then revalidate — and only touch state if the value actually changed.
  useEffect(() => {
    if (!authenticated || !sessionToken) return;

    // Synchronous on purpose: localStorage is client-only, so seeding this via
    // a lazy useState initialiser would make the server and client first
    // renders disagree (hydration mismatch). Painting it in the effect costs
    // one extra render and avoids that.
    const cached = readCache<string>("nav-avatar", sessionToken, 30 * 60 * 1000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached) setAvatarUrl(cached);

    let cancelled = false;
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return;
        const next = d?.user?.avatarUrl || "";
        writeCache("nav-avatar", sessionToken, next);
        setAvatarUrl((prev) => (prev === next ? prev : next));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [authenticated, sessionToken]);

  const authControl = authenticated ? (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="themebtn"
        title="Account"
        style={{ overflow: "hidden" }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </button>
      {menuOpen && (
        <div
          style={{
            position: "absolute", right: 0, top: 44, width: 190, zIndex: 60,
            background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 14,
            boxShadow: "0 18px 50px rgba(0,0,0,.12)", overflow: "hidden", fontSize: 13.5,
          }}
        >
          <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 16px", color: "var(--dim)" }}>
            My Profile
          </Link>
          <Link href="/my-agents" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 16px", color: "var(--dim)" }}>
            My Agents
          </Link>
          <button
            onClick={() => { clearCache(); logout(); setMenuOpen(false); }}
            style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", color: "var(--dim)", background: "none", border: "none", borderTop: "1px solid var(--line)", cursor: "pointer", font: "inherit" }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={login}
      style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", fontSize: 13.5, color: "var(--dim)", padding: 0 }}
    >
      Log In
    </button>
  );

  return (
    <>
      <nav className="said">
        <Link className="said-logo" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lb" src="/logo-black.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lw" src="/logo-white.png" alt="" />
          <span>SAID</span>
        </Link>
        <div className="navlinks">
          {LINKS.map(([label, href, ext]) =>
            ext ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            ) : (
              <Link key={label} href={href} className={pathname === href ? "on" : undefined}>{label}</Link>
            )
          )}
        </div>
        <div className="navright">
          <ThemeToggle />
          <span className="nav-auth">{authControl}</span>
          <Link className="navcta" href="/create-agent">Register an agent</Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="themebtn said-burger"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            )}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div
          style={{
            position: "sticky", top: 63, zIndex: 9, background: "var(--navbg)",
            backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)",
            padding: "8px clamp(20px,4vw,48px) 16px", display: "flex", flexDirection: "column",
            gap: 4, fontSize: 14.5,
          }}
          className="said-mobile-menu"
        >
          {LINKS.map(([label, href, ext]) =>
            ext ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 0", color: "var(--dim)" }}>{label}</a>
            ) : (
              <Link key={label} href={href} onClick={() => setMobileOpen(false)} style={{ padding: "10px 0", color: "var(--dim)" }}>{label}</Link>
            )
          )}

          {/* Auth + primary CTA live here on mobile — the nav bar itself only
              has room for the mark, the theme toggle and this menu. */}
          <div className="said-mobile-actions">
            {authenticated ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)}>My Profile</Link>
                <Link href="/my-agents" onClick={() => setMobileOpen(false)}>My Agents</Link>
                <button onClick={() => { clearCache(); logout(); setMobileOpen(false); }}>Log Out</button>
              </>
            ) : (
              <button onClick={() => { login(); setMobileOpen(false); }}>Log In</button>
            )}
            <Link className="navcta" href="/create-agent" onClick={() => setMobileOpen(false)}>
              Register an agent
            </Link>
          </div>
        </div>
      )}
      <style>{`
        .said-burger { display: none; }
        @media (min-width: 861px) { .said-mobile-menu { display: none; } }

        @media (max-width: 860px) {
          /* Two columns, not three — the middle nav links are hidden here, and
             a 1fr middle column was squeezing the mark into the controls. */
          nav.said { grid-template-columns: 1fr auto; padding-left: 20px; padding-right: 20px; }
          .said-burger { display: flex; }
          /* the pill and the auth control move into the menu */
          nav.said .navcta,
          nav.said .nav-auth { display: none; }
          .navright { gap: 10px; }
        }

        .said-mobile-actions {
          display: flex; flex-direction: column; gap: 4px;
          margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--line);
        }
        .said-mobile-actions a,
        .said-mobile-actions button {
          padding: 10px 0; color: var(--dim); background: none; border: 0;
          font: inherit; font-size: 14.5px; text-align: left; cursor: pointer;
        }
        .said-mobile-actions .navcta {
          margin-top: 8px; text-align: center; padding: 12px 18px;
          color: var(--bg); background: var(--ink);
        }
      `}</style>
    </>
  );
}
