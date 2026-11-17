import "server-only";
import { randomBytes, timingSafeEqual } from "crypto";
import type { DeliveryType, Order, Applicant, Upload, Document } from "@prisma/client";
import { prisma } from "@/lib/db";
import { convertFromUsdCents, isCurrencyCode } from "@/lib/currencies";
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/copy";
import { isValidityYears, planId, usdCentsFor, type DeliveryType as PlanDelivery } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";
import { objectExists } from "@/lib/storage";
import type { detailsSchema, planSchema } from "@/lib/validators";
import type { z } from "zod";

export type OrderRecord = Order & {
  applicant: Applicant | null;
  uploads: Upload[];
  documents: Document[];
};

function parseUtcDay(value: string) {
  const [year, month, date] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date));
}

function formatUtcDay(value: Date) {
  return value.toISOString().slice(0, 10);
}

function tokensMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const include = { applicant: true, uploads: true, documents: true } as const;

export async function authorizeOrder(id: string, accessToken: string) {
  const order = await prisma.order.findUnique({ where: { id }, include });
  if (!order || !tokensMatch(order.accessToken, accessToken)) return null;
  return order;
}

export function toOrderView(order: OrderRecord) {
  return {
    id: order.id,
    email: order.email,
    status: order.status,
    plan: order.plan,
    validityYears: order.validityYears,
    deliveryType: order.deliveryType,
    amountCents: order.amountCents,
    currency: order.currency,
    planSelected: order.planSelected,
    noticeAccepted: order.noticeAccepted,
    destinationCountry: order.destinationCountry,
    licenceCountry: order.licenceCountry,
    shipName: order.shipName,
    shipLine1: order.shipLine1,
    shipLine2: order.shipLine2,
    shipCity: order.shipCity,
    shipRegion: order.shipRegion,
    shipPostal: order.shipPostal,
    shipCountry: order.shipCountry,
    uploads: order.uploads.map((upload) => ({ type: upload.type })),
    hasDocument: order.documents.length > 0,
    applicant: order.applicant
      ? {
          fullName: order.applicant.fullName,
          dob: formatUtcDay(order.applicant.dob),
          licenceCountry: order.applicant.licenceCountry,
          licenceNumber: order.applicant.licenceNumber,
          licenceClass: order.applicant.licenceClass,
          issueDate: formatUtcDay(order.applicant.issueDate),
          expiryDate: formatUtcDay(order.applicant.expiryDate),
        }
      : null,
  };
}

export async function createOrder(input: z.infer<typeof detailsSchema>) {
  const accessToken = randomBytes(32).toString("hex");
  const order = await prisma.order.create({
    data: {
      accessToken,
      email: input.email,
      licenceCountry: input.licenceCountry,
      destinationCountry: input.destinationCountry,
      applicant: {
        create: {
          fullName: input.fullName,
          dob: parseUtcDay(input.dob),
          licenceCountry: input.licenceCountry,
          licenceNumber: input.licenceNumber,
          licenceClass: input.licenceClass,
          issueDate: parseUtcDay(input.issueDate),
          expiryDate: parseUtcDay(input.expiryDate),
        },
      },
    },
    include,
  });
  return { order, accessToken };
}

export async function updateDetails(orderId: string, input: z.infer<typeof detailsSchema>) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      email: input.email,
      licenceCountry: input.licenceCountry,
      destinationCountry: input.destinationCountry,
    },
  });
  await prisma.applicant.upsert({
    where: { orderId },
    update: {
      fullName: input.fullName,
      dob: parseUtcDay(input.dob),
      licenceCountry: input.licenceCountry,
      licenceNumber: input.licenceNumber,
      licenceClass: input.licenceClass,
      issueDate: parseUtcDay(input.issueDate),
      expiryDate: parseUtcDay(input.expiryDate),
    },
    create: {
      orderId,
      fullName: input.fullName,
      dob: parseUtcDay(input.dob),
      licenceCountry: input.licenceCountry,
      licenceNumber: input.licenceNumber,
      licenceClass: input.licenceClass,
      issueDate: parseUtcDay(input.issueDate),
      expiryDate: parseUtcDay(input.expiryDate),
    },
  });
}

export async function updatePlan(orderId: string, input: z.infer<typeof planSchema>) {
  if (!isCurrencyCode(input.currency) || !isValidityYears(input.validityYears)) {
    throw new Error("Choose a listed plan");
  }
  const delivery = input.deliveryType as PlanDelivery;
  const amountCents = convertFromUsdCents(usdCentsFor(delivery, input.validityYears), input.currency);
  const print = delivery === "print_digital";
  await prisma.order.update({
    where: { id: orderId },
    data: {
      deliveryType: delivery as DeliveryType,
      validityYears: input.validityYears,
      currency: input.currency,
      amountCents,
      plan: planId(delivery, input.validityYears),
      planSelected: true,
      shipName: print ? input.shipName || null : null,
      shipLine1: print ? input.shipLine1 || null : null,
      shipLine2: print ? input.shipLine2 || null : null,
      shipCity: print ? input.shipCity || null : null,
      shipRegion: print ? input.shipRegion || null : null,
      shipPostal: print ? input.shipPostal || null : null,
      shipCountry: print ? input.shipCountry || null : null,
    },
  });
}

export async function attachUpload(orderId: string, type: "licence_front" | "licence_back" | "portrait", storageKey: string) {
  if (!storageKey.startsWith(`orders/${orderId}/`)) throw new Error("That file does not belong to this order");
  if (!(await objectExists(storageKey))) throw new Error("Upload was not found. Please try that file again.");
  await prisma.upload.upsert({
    where: { orderId_type: { orderId, type } },
    update: { storageKey },
    create: { orderId, type, storageKey },
  });
}

export async function acceptNotice(orderId: string) {
  await prisma.order.update({ where: { id: orderId }, data: { noticeAccepted: true } });
}

export async function createCheckout(orderId: string, origin: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include });
  if (!order?.applicant) throw new Error("Enter the licence details first");
  const years = order.validityYears;
  if (!order.planSelected || !isValidityYears(years)) throw new Error("Choose a plan first");
  const have = new Set(order.uploads.map((upload) => upload.type));
  if (!have.has("licence_front") || !have.has("licence_back") || !have.has("portrait")) {
    throw new Error("Upload the front, the back, and a portrait photo");
  }
  if (order.deliveryType === "print_digital" && (!order.shipLine1 || !order.shipCity || !order.shipCountry)) {
    throw new Error("Enter a shipping address for the printed card");
  }
  if (order.status === "ready" || order.status === "shipped" || order.status === "paid") {
    return { alreadyPaid: true as const, url: `${origin}/order/${order.id}?token=${order.accessToken}` };
  }
  if (order.status === "refunded") throw new Error("This order was refunded");

  const amountCents = convertFromUsdCents(usdCentsFor(order.deliveryType, years), order.currency);
  await prisma.order.update({
    where: { id: order.id },
    data: { amountCents, plan: planId(order.deliveryType, years) },
  });

  const stripe = getStripe();
  if (!stripe) throw new Error("Payments are not configured. Add STRIPE_SECRET_KEY.");

  if (order.stripeSessionId) {
    const existing = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    if (existing.status === "complete") {
      return { alreadyPaid: true as const, url: `${origin}/order/${order.id}?token=${order.accessToken}` };
    }
    if (existing.status === "open" && existing.url && existing.amount_total === amountCents) {
      return { alreadyPaid: false as const, url: existing.url };
    }
  }

  const yearsLabel = order.validityYears === 1 ? "1 year" : `${order.validityYears} years`;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.email,
    client_reference_id: order.id,
    metadata: { orderId: order.id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: order.currency,
          unit_amount: amountCents,
          product_data: {
            name: `${PRODUCT_NAME} (${yearsLabel})`,
            description: PRODUCT_DESCRIPTION,
          },
        },
      },
    ],
    success_url: `${origin}/order/${order.id}?token=${order.accessToken}&paid=1`,
    cancel_url: `${origin}/apply`,
  });

  if (!session.url?.startsWith("https://checkout.stripe.com")) {
    throw new Error("Payment session could not be opened");
  }
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id, status: "pending_payment" },
  });
  return { alreadyPaid: false as const, url: session.url };
}
