import "server-only";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/copy";
import { renderTranslationPdf } from "@/lib/pdf/render";
import { newObjectKey, putPrivateObject, signedDownloadUrl } from "@/lib/storage";

function day(value: Date) {
  return value.toISOString().slice(0, 10);
}

export async function ensureDocument(orderId: string, force = false) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { applicant: true, documents: { orderBy: { version: "desc" }, take: 1 } },
  });
  if (!order?.applicant) throw new Error("Applicant details are missing");
  if (!force && order.documents[0]) return order.documents[0];

  const version = (order.documents[0]?.version ?? 0) + 1;
  const pdf = await renderTranslationPdf({
    fullName: order.applicant.fullName,
    dob: day(order.applicant.dob),
    licenceCountry: order.applicant.licenceCountry,
    licenceNumber: order.applicant.licenceNumber,
    licenceClass: order.applicant.licenceClass,
    issueDate: day(order.applicant.issueDate),
    expiryDate: day(order.applicant.expiryDate),
    validityYears: order.validityYears,
    preparedOn: day(new Date()),
  });
  const pdfKey = newObjectKey(order.id, `translation-v${version}.pdf`);
  await putPrivateObject(pdfKey, pdf, "application/pdf");
  return prisma.document.create({ data: { orderId: order.id, pdfKey, version } });
}

export async function emailLatestDocument(orderId: string, origin: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { documents: { orderBy: { version: "desc" }, take: 1 } },
  });
  if (!order) throw new Error("Order not found");
  const document = order.documents[0] ?? (await ensureDocument(orderId));
  const pageUrl = `${origin}/order/${order.id}?token=${order.accessToken}`;
  const fileUrl = await signedDownloadUrl(document.pdfKey, origin, 60 * 60);
  const result = await sendEmail({
    to: order.email,
    subject: `${PRODUCT_NAME}: your file is ready`,
    text: [
      `Your translation file is ready.`,
      PRODUCT_DESCRIPTION,
      `Order page: ${pageUrl}`,
      `Direct download (expires in one hour): ${fileUrl}`,
    ].join("\n\n"),
    html: `<p>Your translation file is ready.</p><p>${PRODUCT_DESCRIPTION}</p><p><a href="${pageUrl}">Open your order</a></p><p><a href="${fileUrl}">Download the file</a> (this link expires in one hour).</p>`,
  });
  if (result.ok) {
    await prisma.order.update({ where: { id: order.id }, data: { emailedAt: new Date() } });
  }
  return result;
}

export async function fulfillCheckoutSession(sessionId: string, eventId: string) {
  try {
    await prisma.webhookEvent.create({ data: { id: eventId } });
  } catch {
    return { duplicate: true as const };
  }

  try {
    const order = await prisma.order.findFirst({ where: { stripeSessionId: sessionId } });
    if (!order) throw new Error("No order matches this payment");
    if (order.status === "refunded") return { duplicate: false as const };
    if (order.status !== "ready" && order.status !== "shipped") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
      await ensureDocument(order.id);
      const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
      await emailLatestDocument(order.id, origin);
      await prisma.order.update({ where: { id: order.id }, data: { status: "ready" } });
    }
    return { duplicate: false as const };
  } catch (error) {
    await prisma.webhookEvent.delete({ where: { id: eventId } }).catch(() => undefined);
    await prisma.order
      .updateMany({
        where: { stripeSessionId: sessionId, status: { notIn: ["ready", "shipped", "refunded"] } },
        data: { status: "failed" },
      })
      .catch(() => undefined);
    throw error;
  }
}
