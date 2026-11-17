import { NextResponse } from "next/server";
import { clientIp, jsonError } from "@/lib/http";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { verifyLocalFileToken } from "@/lib/storage";
import { putPrivateObject, readPrivateObject } from "@/lib/storage";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validators";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  const limited = rateLimit(`upload-put:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  const token = url.searchParams.get("token") || "";
  if (!verifyLocalFileToken("put", key, token)) return jsonError("This upload link is not valid", 403);
  const contentType = req.headers.get("content-type")?.split(";")[0] || "";
  if (!ALLOWED_UPLOAD_TYPES.includes(contentType as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
    return jsonError("Use a JPG, PNG, or PDF", 400);
  }
  const bytes = Buffer.from(await req.arrayBuffer());
  if (bytes.length < 1 || bytes.length > MAX_UPLOAD_BYTES) return jsonError("File must be under 8MB", 413);
  await putPrivateObject(key, bytes, contentType);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  const token = url.searchParams.get("token") || "";
  if (!verifyLocalFileToken("get", key, token)) return jsonError("This download link is not valid", 403);
  try {
    const bytes = await readPrivateObject(key);
    const filename = key.split("/").pop() || "file";
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": key.endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return jsonError("File not found", 404);
  }
}
