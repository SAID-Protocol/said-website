import { NextResponse } from 'next/server';
import { fetchBurnsData } from '@/lib/burns';

// Cache the route response for 6h. Combined with the in-memory TTL in
// fetchBurnsData, this bounds Helius enhanced-tx usage no matter who hits it.
export const revalidate = 21600;

export async function GET() {
  const data = await fetchBurnsData();
  if (data.error && data.events.length === 0) {
    return NextResponse.json(data, { status: 502 });
  }
  return NextResponse.json(data);
}
