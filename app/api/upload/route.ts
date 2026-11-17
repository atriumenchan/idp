import { clientIp, jsonError, requestOrigin } from "@/lib/http";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { authorizeOrder } from "@/lib/orders";
import { createUploadTarget, newObjectKey } from "@/lib/storage";
import { uploadRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(`upload:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);
  const parsed = uploadRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Use a JPG, PNG, or PDF under 8MB", 400);
  const order = await authorizeOrder(parsed.data.orderId, parsed.data.accessToken).catch(() => null);
  if (!order) return jsonError("Order not found", 404);
  if (order.status !== "draft" && order.status !== "pending_payment" && order.status !== "failed") {
    return jsonError("This order can no longer accept files", 409);
  }
  const extension = parsed.data.contentType === "application/pdf" ? "pdf" : parsed.data.contentType === "image/png" ? "png" : "jpg";
  const storageKey = newObjectKey(order.id, `${parsed.data.type}.${extension}`);
  const target = await createUploadTarget(storageKey, parsed.data.contentType, requestOrigin(req));
  return Response.json({ storageKey, uploadUrl: target.url, method: target.method });
}
