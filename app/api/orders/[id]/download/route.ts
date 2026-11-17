import { authorizeOrder } from "@/lib/orders";
import { prisma } from "@/lib/db";
import { jsonError, requestOrigin } from "@/lib/http";
import { signedDownloadUrl } from "@/lib/storage";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const token = new URL(req.url).searchParams.get("token") || "";
  const order = await authorizeOrder(id, token).catch(() => null);
  if (!order) return jsonError("Order not found", 404);
  const document = [...order.documents].sort((a, b) => b.version - a.version)[0];
  if (!document) return jsonError("The file is not ready yet", 404);
  if (!order.downloadedAt) {
    await prisma.order.update({ where: { id: order.id }, data: { downloadedAt: new Date() } });
  }
  const url = await signedDownloadUrl(document.pdfKey, requestOrigin(req), 300);
  return Response.redirect(url);
}
