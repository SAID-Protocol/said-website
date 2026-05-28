import { NextResponse } from 'next/server';
import { fetchBurnsData } from '@/lib/burns';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await fetchBurnsData();
  if (data.error && data.events.length === 0) {
    return NextResponse.json(data, { status: 502 });
  }
  return NextResponse.json(data);
}
