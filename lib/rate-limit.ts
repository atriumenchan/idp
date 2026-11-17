import "server-only";

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || now > existing.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true as const };
  }
  if (existing.count >= limit) {
    return { ok: false as const, retryAfter: Math.max(1, Math.ceil((existing.reset - now) / 1000)) };
  }
  existing.count += 1;
  return { ok: true as const };
}

export function rateLimitResponse(retryAfter: number) {
  return Response.json(
    { error: "Too many requests. Wait a moment and try again." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
