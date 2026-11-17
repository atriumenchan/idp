import { z } from "zod";
import { prisma } from "@/lib/db";
import { jsonError, requestOrigin } from "@/lib/http";
import { emailLatestDocument, ensureDocument } from "@/lib/fulfill";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const bodySchema = z.object({
  action: z.enum(["regenerate", "resend", "refund", "ship"]),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Unknown action", 400);
  const order = await prisma.order.findUnique({ where: { id } }).catch(() => null);
  if (!order) return jsonError("Order not found", 404);

  try {
    if (parsed.data.action === "regenerate") {
      if (!["paid", "ready", "shipped", "failed"].includes(order.status)) {
        return jsonError("This order is not paid yet", 409);
      }
      const document = await ensureDocument(order.id, true);
      if (order.status === "paid" || order.status === "failed") {
        await prisma.order.update({ where: { id: order.id }, data: { status: "ready" } });
      }
      return Response.json({ ok: true, version: document.version });
    }

    if (parsed.data.action === "resend") {
      const result = await emailLatestDocument(order.id, requestOrigin(req));
      if (!result.ok) return jsonError(result.reason, 503);
      return Response.json({ ok: true });
    }

    if (parsed.data.action === "ship") {
      if (order.deliveryType !== "print_digital") return jsonError("This order has no printed card", 409);
      if (order.status !== "ready" && order.status !== "shipped") return jsonError("The file is not ready", 409);
      await prisma.order.update({ where: { id: order.id }, data: { status: "shipped" } });
      return Response.json({ ok: true });
    }

    if (order.downloadedAt) return jsonError("The file has already been downloaded", 409);
    if (order.status === "shipped") return jsonError("The printed card has been marked shipped", 409);
    const ageMs = Date.now() - order.createdAt.getTime();
    if (ageMs > 14 * 24 * 60 * 60 * 1000) return jsonError("The 14-day refund window has passed", 409);

    const stripe = getStripe();
    if (!stripe || !order.stripeSessionId) return jsonError("This order has no payment to refund", 409);
    const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (!paymentIntent) return jsonError("No payment was captured for this order", 409);
    await stripe.refunds.create({ payment_intent: paymentIntent });
    await prisma.order.update({ where: { id: order.id }, data: { status: "refunded" } });
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The action failed";
    return jsonError(message, 400);
  }
}
