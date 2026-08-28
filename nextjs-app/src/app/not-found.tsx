import Link from 'next/link';
import SaidFooter from '@/components/said/SaidFooter';

export default function NotFound() {
  return (
    <div className="said-page said-404">
      <div className="hero" style={{ textAlign: 'center' }}>
        <div className="kick mono">404</div>
        <h1>This page doesn&apos;t exist.</h1>
        <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          The page you were looking for has moved, or never existed.
        </p>
        <div className="ctas">
          <Link className="btn fill" href="/">Go home</Link>
          <Link className="btn" href="/agents">Browse the registry</Link>
        </div>
      </div>
      <SaidFooter />
      <style>{`
        .said-404 .hero{min-height:58vh;display:flex;flex-direction:column;justify-content:center}
        .said-404 .kick{font-size:12px;letter-spacing:.2em}
        .said-404 .ctas{display:flex;gap:12px;justify-content:center;margin-top:30px;flex-wrap:wrap}
      `}</style>
    </div>
  );
}
