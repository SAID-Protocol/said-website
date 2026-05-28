import { NextRequest } from 'next/server';
import { proxyGet } from '@/lib/proxy';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  return proxyGet('/api/agents', url.search);
}
