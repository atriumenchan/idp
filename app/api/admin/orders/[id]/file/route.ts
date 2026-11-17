import { prisma } from "@/lib/db";
import { jsonError, requestOrigin } from "@/lib/http";
import { signedDownloadUrl } from "@/lib/storage";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const type = new URL(req.url).searchParams.get("type");
  const order = await prisma.order
    .findUnique({
      where: { id },
      include: { uploads: true, documents: { orderBy: { version: "desc" }, take: 1 } },
    })
    .catch(() => null);
  if (!order) return jsonError("Order not found", 404);
  const upload = order.uploads.find((item) => item.type === type);
  const key = upload?.storageKey || (type === "pdf" ? order.documents[0]?.pdfKey : undefined);
  if (!key) return jsonError("File not found", 404);
  const url = await signedDownloadUrl(key, requestOrigin(req), 120);
  return Response.redirect(url);
}
