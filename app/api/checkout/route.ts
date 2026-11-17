import { clientIp, jsonError, requestOrigin } from "@/lib/http";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { authorizeOrder, createCheckout } from "@/lib/orders";
import { checkoutSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(`checkout:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Order not found", 400);
  const order = await authorizeOrder(parsed.data.orderId, parsed.data.accessToken).catch(() => null);
  if (!order) return jsonError("Order not found", 404);
  try {
    const result = await createCheckout(order.id, requestOrigin(req));
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout could not be started";
    const status = message.includes("not configured") ? 503 : 400;
    return jsonError(message, status);
  }
}
