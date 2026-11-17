import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function cell(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { applicant: true },
  });
  const header = [
    "id",
    "email",
    "status",
    "plan",
    "validityYears",
    "deliveryType",
    "amountCents",
    "currency",
    "createdAt",
    "fullName",
    "licenceCountry",
    "destinationCountry",
    "shipCity",
    "shipCountry",
  ];
  const lines = orders.map((order) =>
    [
      order.id,
      order.email,
      order.status,
      order.plan,
      order.validityYears,
      order.deliveryType,
      order.amountCents,
      order.currency,
      order.createdAt.toISOString(),
      order.applicant?.fullName ?? "",
      order.licenceCountry ?? "",
      order.destinationCountry ?? "",
      order.shipCity ?? "",
      order.shipCountry ?? "",
    ]
      .map(cell)
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=orders.csv",
    },
  });
}
