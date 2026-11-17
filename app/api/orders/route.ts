import { clientIp, jsonError } from "@/lib/http";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createOrder, toOrderView } from "@/lib/orders";
import { detailsSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(`orders:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);
  const parsed = detailsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Check the licence details and try again", 400);
  try {
    const { order, accessToken } = await createOrder(parsed.data);
    return Response.json({ order: toOrderView(order), accessToken });
  } catch {
    return jsonError("The order could not be saved. Check the database connection.", 503);
  }
}
