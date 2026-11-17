import { z } from "zod";
import { jsonError } from "@/lib/http";
import {
  acceptNotice,
  attachUpload,
  authorizeOrder,
  toOrderView,
  updateDetails,
  updatePlan,
} from "@/lib/orders";
import { detailsSchema, planSchema } from "@/lib/validators";

export const runtime = "nodejs";

const patchSchema = z.object({
  accessToken: z.string().min(16),
  details: detailsSchema.optional(),
  plan: planSchema.optional(),
  upload: z
    .object({
      type: z.enum(["licence_front", "licence_back", "portrait"]),
      storageKey: z.string().min(8).max(200),
    })
    .optional(),
  noticeAccepted: z.literal(true).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const token = new URL(req.url).searchParams.get("token") || "";
  const order = await authorizeOrder(id, token).catch(() => null);
  if (!order) return jsonError("Order not found", 404);
  return Response.json({ order: toOrderView(order) });
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Check the form and try again", 400);
  const order = await authorizeOrder(id, parsed.data.accessToken).catch(() => null);
  if (!order) return jsonError("Order not found", 404);
  if (order.status !== "draft" && order.status !== "pending_payment" && order.status !== "failed") {
    return jsonError("This order can no longer be edited", 409);
  }
  try {
    if (parsed.data.details) await updateDetails(id, parsed.data.details);
    if (parsed.data.plan) await updatePlan(id, parsed.data.plan);
    if (parsed.data.upload) await attachUpload(id, parsed.data.upload.type, parsed.data.upload.storageKey);
    if (parsed.data.noticeAccepted) await acceptNotice(id);
    const fresh = await authorizeOrder(id, parsed.data.accessToken);
    if (!fresh) return jsonError("Order not found", 404);
    return Response.json({ order: toOrderView(fresh) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save this step";
    return jsonError(message, 400);
  }
}
