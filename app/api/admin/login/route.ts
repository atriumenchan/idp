import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSessionToken } from "@/lib/admin-token";
import { clientIp, jsonError } from "@/lib/http";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";

export const runtime = "nodejs";

function sameSecret(input: string, expected: string) {
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export async function POST(req: Request) {
  const limited = rateLimit(`login:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Enter the password", 400);
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret || !sameSecret(parsed.data.password, password)) {
    return jsonError("That password is not correct", 401);
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, await adminSessionToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return Response.json({ ok: true });
}
