import { NextRequest } from 'next/server';
import { forwardTo, type ProxyCtx } from '@/lib/upstream-proxy';

/** Same-origin passthrough to the protocol API. See lib/upstream-proxy.ts. */
const UPSTREAM = 'https://api.saidprotocol.com';

export const dynamic = 'force-dynamic';

const go = async (req: NextRequest, ctx: ProxyCtx) =>
  forwardTo(UPSTREAM, req, (await ctx.params).path);

export const GET = go;
export const POST = go;
export const PATCH = go;
export const PUT = go;
export const DELETE = go;
