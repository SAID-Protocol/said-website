'use client';

import { usePathname } from 'next/navigation';
import SaidNav from '@/components/said/SaidNav';

/**
 * Renders the navbar once, at the layout level, so it survives route changes.
 *
 * Previously every page rendered its own <SaidNav/> inside the page tree,
 * which meant the nav was torn down and rebuilt on every navigation: its
 * avatar refetched, its scroll state reset, and the rebuild showed as a
 * flicker. Mounting it here keeps a single persistent instance.
 *
 * The routes below still use the pre-redesign <Navbar/> in their own markup,
 * so they're skipped to avoid rendering two navbars. Remove them from this
 * list as each page is ported.
 */
const LEGACY_NAV_ROUTES = ['/mint-passport', '/admin'];

export default function SiteNav() {
  const pathname = usePathname();
  if (LEGACY_NAV_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    return null;
  }
  return <SaidNav />;
}
