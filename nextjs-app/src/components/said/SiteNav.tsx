import SaidNav from '@/components/said/SaidNav';

/**
 * Renders the navbar once, at the layout level, so it survives route changes.
 *
 * Every page used to render its own <SaidNav/>, which meant the nav was torn
 * down and rebuilt on every navigation: its avatar refetched, its scroll
 * state reset, and the rebuild showed as a flicker. Mounting it here keeps a
 * single persistent instance.
 */
export default function SiteNav() {
  return <SaidNav />;
}
