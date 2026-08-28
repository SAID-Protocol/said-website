# Handoff: SAID Protocol Website

## Overview
Complete redesign of saidprotocol.com (and agent.saidprotocol.com): 11 pages in a shared editorial design language — warm cream/ink palette, Helvetica Neue, living dot-field animations, dark/light theming. Ports all content from the live Next.js site into the new visual system.

## About the Design Files
These files are **design references created in HTML** — working prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase** (the existing site is Next.js — reuse that) using its established patterns. All pages run standalone in a browser for reference: open `SAID Home.html`.

## Fidelity
**High-fidelity.** Colors, typography, spacing, animations, and copy are final unless marked placeholder. Recreate pixel-perfectly.

## Files
- `SAID Home.html` — protocol homepage (self-contained)
- `SAID Docs.html` — documentation with sidebar scrollspy (self-contained)
- `SAID Token.html` — $SAID token page (self-contained)
- `SAID Agent.html` — agent.saidprotocol.com product page, ultra-minimal one-screen, dark-first (self-contained)
- `SAID Directory.html`, `SAID Create Agent.html`, `SAID Grants.html`, `SAID Security.html`, `SAID Blog.html`, `SAID Changelog.html`, `SAID Terms.html`, `SAID Privacy.html` — shared-asset pages
- `assets/said.css` — shared tokens/components for the 8 shared-asset pages
- `assets/said.js` — shared runtime: theme persistence, nav/footer injection (`saidNav(active)`, `saidFooter()`), scroll reveals, copy buttons, simplex-noise dot engines
- `assets/logo-black.png`, `assets/logo-white.png` — brand marks (light/dark)

## Design Tokens
Light: `--bg:#f6f4ef` `--card:#efece4` `--ink:#101010` `--dim:#5c5a54` `--faint:#a09d95` `--line:rgba(16,16,16,.12)` `--navbg:rgba(246,244,239,.85)` `--good:#3da35d`
Dark (`html[data-theme="dark"]`): `--bg:#101010` `--card:#191917` `--ink:#f2f0ec` `--dim:#a3a09a` `--faint:#6b6963` `--line:rgba(255,255,255,.12)` `--navbg:rgba(16,16,16,.8)`
Type: "Helvetica Neue", Helvetica, system fallbacks; mono = ui-monospace/"SF Mono"/Menlo. Headlines weight 500, letter-spacing -0.03em. Body 14–16px, line-height 1.65–1.7. Kickers 11–12px, letter-spacing .14–.18em, `--faint`.
Radii: pills/buttons 99px; cards/inputs 12–20px; hero CTA cards 32px; phone/chat 24px. Monochrome accent policy: NO accent colors except `--good` for online dots; hierarchy comes from ink vs dim vs faint.
Spacing: sections `clamp(40px,7vh,72px)` vertical, `clamp(20px,4vw,48px)` horizontal gutters, 1280px max content width (1440px for CTA wrap).

## Key Behaviors (all in the files, recreate faithfully)
- **Theme**: `localStorage['said-theme']`, `.5s` background/color transitions sitewide; logo/theme-icon crossfade. Agent page defaults dark.
- **Living dot mark (Home hero)**: simplex-noise dot field masked by the SAID wordmark; assembles on load (1.6s), dissolves on scroll (scatter + scale), soft brightness hover (150px gaussian falloff). Full engine in `SAID Home.html`.
- **Dot seams**: 64px canvas strips between sections; noise-driven dots fading to all edges (`.dotdiv` in said.js).
- **Ink CTA cards**: dark rounded-32 cards with ambient breathing dots + corner `+` marks; scale/fade reveal.
- **Scroll reveals**: rect-based (not IntersectionObserver — fast scrolls must not skip), threshold `top < innerHeight*.88`, translateY(28px)+opacity, `cubic-bezier(.16,1,.3,1)`.
- **Count-ups**: 1.2–1.4s cubic ease-out when stats enter viewport.
- **Docs**: sticky sidebar scrollspy (active at `top<140px`), copy buttons on every code block/address.
- **Directory**: search + sort tabs (Top reputation/Newest/Most active), top-3 "Most Trusted" cards (#1 gets ink treatment with breathing dots), rows with avatar initials, trust meter, tier chips. **Demo data — wire to `GET /api/agents`.**

## State / Data Wiring
- Directory list, stats band figures, and Token page burn figures (`data-live` slots, currently "—") need real API/on-chain data.
- Create Agent + Grants forms are unwired; POST to `api/agents/register` and grants endpoint respectively.
- Blog, Changelog, Terms, Privacy copy is **placeholder** — flagged in-page.
- Known open question: verification price appears as 0.01 SOL in docs (matching live site) and 0.1 SOL was mentioned for protocol-level verification in conversation — confirm before shipping.

## Assets
Brand marks in `assets/`. No other imagery; all decoration is generated canvas dots.
