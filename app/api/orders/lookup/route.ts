import { prisma } from "@/lib/db";
import { clientIp, jsonError, requestOrigin } from "@/lib/http";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { signedDownloadUrl } from "@/lib/storage";
import { lookupSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimit(`lookup:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);
  const parsed = lookupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Enter the order id and email", 400);
  const order = await prisma.order
    .findUnique({
      where: { id: parsed.data.orderId },
      include: { documents: { orderBy: { version: "desc" }, take: 1 } },
    })
    .catch(() => null);
  if (!order || order.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return jsonError("No order matches that email and id", 404);
  }
  const document = order.documents[0];
  if (document && !order.downloadedAt) {
    await prisma.order.update({ where: { id: order.id }, data: { downloadedAt: new Date() } });
  }
  const downloadUrl = document ? await signedDownloadUrl(document.pdfKey, requestOrigin(req), 300) : null;
  return Response.json({
    id: order.id,
    status: order.status,
    hasDocument: Boolean(document),
    downloadUrl,
  });
}
