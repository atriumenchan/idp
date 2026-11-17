import { jsonError } from "@/lib/http";
import { fulfillCheckoutSession } from "@/lib/fulfill";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return jsonError("Payments are not configured", 503);
  const signature = req.headers.get("stripe-signature");
  if (!signature) return jsonError("Missing signature", 400);
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return jsonError("Invalid signature", 400);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if ("id" in session && session.id) {
      try {
        await fulfillCheckoutSession(session.id, event.id);
      } catch (error) {
        console.error(error);
        return jsonError("The payment was received but the file could not be prepared", 500);
      }
    }
  }
  return Response.json({ received: true });
}
