import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

// ── Per-IP rate limiting + input caps ───────────────────────────────────
// The endpoint proxies to a paid LLM on the site's key, so it needs an abuse
// guard. In-memory sliding window: solid on a single long-running Node server,
// a soft cap on serverless (per-instance). Good enough as a v1 deterrent.
const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX = 12; // requests per IP per window
const MAX_MSG_CHARS = 2_000; // per message
const MAX_TOTAL_CHARS = 8_000; // across the submitted history
const rlHits = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rlHits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  hits.push(now);
  rlHits.set(ip, hits);
  if (rlHits.size > 5_000) {
    for (const [k, v] of rlHits) if (v.every((t) => now - t >= RL_WINDOW_MS)) rlHits.delete(k);
  }
  return hits.length > RL_MAX;
}

// SAID docs are small + clean, so we stuff them straight into the system prompt
// (no RAG needed for v1). Cached in memory after first read.
let docsCache: string | null = null;
async function loadDocs(): Promise<string> {
  if (docsCache) return docsCache;
  const pub = path.join(process.cwd(), 'public');
  const parts: string[] = [];
  for (const file of ['skill.md', 'INTEGRATION.md']) {
    try {
      parts.push(`### ${file}\n\n${await readFile(path.join(pub, file), 'utf8')}`);
    } catch {
      /* file optional */
    }
  }
  docsCache = parts.join('\n\n---\n\n');
  return docsCache;
}

function systemPrompt(docs: string): string {
  return `You are the **SAID Assistant**, a SAID-verified AI agent embedded on the SAID Protocol website (saidprotocol.com).

SAID is on-chain identity, reputation, and trust infrastructure for AI agents on Solana, plus a cross-chain agent-to-agent (A2A) messaging layer.

Your job: help visitors register an agent, get verified, understand reputation/trust scoring, activity heartbeats, SAID Passports, the Grants program, the $SAID token, and integrate SAID into their own agents or platforms.

Rules:
- Answer ONLY from the SAID knowledge base below. If something isn't covered, say you're not certain and point to the docs or @saidinfra — never invent prices, addresses, endpoints, or features.
- This is a small chat bubble, not a docs page. Keep answers SHORT — 2–4 sentences or a few short bullets — and lead with the direct answer. Do NOT use markdown headings (#, ##) or long multi-section responses; a brief bullet list or one short code snippet is fine only when it genuinely helps.
- Be concrete with exact figures (register is free, ~0.002 SOL rent; verify is 0.01 SOL; passport 0.05 SOL; grants 1–5 SOL/mo) and real commands/links.
- If asked something unrelated to SAID, briefly steer back.
- You genuinely are a SAID-verified agent — own that, but stay helpful and grounded, never salesy.

=== SAID KNOWLEDGE BASE ===
${docs}`;
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) {
    return Response.json(
      { reply: "You're sending messages too fast — give it a few seconds and try again." },
      { status: 429 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ reply: 'Bad request.' }, { status: 400 });
  }

  const submitted = Array.isArray(body.messages) ? body.messages : [];
  const totalChars = submitted.reduce(
    (n, m) => n + (typeof m?.content === 'string' ? m.content.length : 0),
    0,
  );
  if (
    totalChars > MAX_TOTAL_CHARS ||
    submitted.some((m) => typeof m?.content === 'string' && m.content.length > MAX_MSG_CHARS)
  ) {
    return Response.json({ reply: 'That message is too long — please shorten it.' }, { status: 413 });
  }

  const history = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10);

  const baseUrl = process.env.ASSISTANT_LLM_BASE_URL;
  const apiKey = process.env.ASSISTANT_LLM_API_KEY;
  const model = process.env.ASSISTANT_LLM_MODEL;
  const docs = await loadDocs();

  // Graceful degradation so the UI is fully testable before creds are set.
  if (!baseUrl || !apiKey || !model) {
    return Response.json({
      reply:
        "I'm not wired to a model yet — set ASSISTANT_LLM_BASE_URL, ASSISTANT_LLM_API_KEY and ASSISTANT_LLM_MODEL in .env.local and I'll answer live from the SAID docs.\n\nIn the meantime: registering an agent is free (~0.002 SOL rent), verification is 0.01 SOL, and there's a Grants program (1–5 SOL/mo). The Docs tab has the full flow.",
      configured: false,
    });
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 700,
        messages: [{ role: 'system', content: systemPrompt(docs) }, ...history],
      }),
    });

    if (!res.ok) {
      console.warn(`[assistant] model error ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return Response.json({
        reply: `I hit an error reaching the model (${res.status}). Try again in a moment.`,
      });
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return Response.json({ reply: reply || "Sorry, I couldn't generate a response — try rephrasing?" });
  } catch (err) {
    console.warn('[assistant] request failed:', err instanceof Error ? err.message : err);
    return Response.json({ reply: 'Something went wrong reaching the model. Try again shortly.' });
  }
}
