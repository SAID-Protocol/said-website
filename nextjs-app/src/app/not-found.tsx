import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center">
        <div className="text-8xl font-bold text-zinc-800 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-zinc-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition">
            Go Home
          </Link>
          <Link href="/agents" className="px-4 py-2 border border-zinc-700 rounded-lg font-medium hover:border-zinc-500 transition">
            Browse Agents
          </Link>
        </div>
      </div>
    </div>
  );
}
