import { proxyGet } from '@/lib/proxy';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ wallet: string }> },
) {
  const { wallet } = await params;
  return proxyGet(`/api/agents/${encodeURIComponent(wallet)}/feedback`);
}
