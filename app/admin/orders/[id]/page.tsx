import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminActions } from "@/components/admin/AdminActions";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/currencies";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function day(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default async function AdminOrderPage({ params }: Params) {
  const { id } = await params;
  const order = await prisma.order
    .findUnique({
      where: { id },
      include: { applicant: true, uploads: true, documents: { orderBy: { version: "desc" } } },
    })
    .catch(() => null);
  if (!order) notFound();

  return (
    <article>
      <p className="text-sm">
        <Link className="underline" href="/admin">
          All orders
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-3xl">{order.email}</h1>
      <p className="mt-2 text-sm">
        {order.status} · {order.plan} · {formatMoney(order.amountCents, order.currency)}
      </p>
      {order.applicant ? (
        <dl className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="font-medium">Name</dt><dd>{order.applicant.fullName}</dd></div>
          <div><dt className="font-medium">Date of birth</dt><dd>{day(order.applicant.dob)}</dd></div>
          <div><dt className="font-medium">Licence country</dt><dd>{order.applicant.licenceCountry}</dd></div>
          <div><dt className="font-medium">Destination</dt><dd>{order.destinationCountry}</dd></div>
          <div><dt className="font-medium">Licence number</dt><dd>{order.applicant.licenceNumber}</dd></div>
          <div><dt className="font-medium">Class</dt><dd>{order.applicant.licenceClass}</dd></div>
          <div><dt className="font-medium">Issued</dt><dd>{day(order.applicant.issueDate)}</dd></div>
          <div><dt className="font-medium">Expiry</dt><dd>{day(order.applicant.expiryDate)}</dd></div>
        </dl>
      ) : (
        <p className="mt-4 text-sm">No applicant details yet.</p>
      )}
      {order.deliveryType === "print_digital" ? (
        <p className="mt-4 text-sm">
          Ship to {order.shipName}, {order.shipLine1} {order.shipLine2}, {order.shipCity} {order.shipRegion} {order.shipPostal}, {order.shipCountry}
        </p>
      ) : null}
      <h2 className="mt-8 font-serif text-2xl">Files</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {order.uploads.map((upload) => (
          <li key={upload.id}>
            <a className="underline" href={`/api/admin/orders/${order.id}/file?type=${upload.type}`}>
              {upload.type}
            </a>
          </li>
        ))}
        {order.documents[0] ? (
          <li>
            <a className="underline" href={`/api/admin/orders/${order.id}/file?type=pdf`}>
              Translation version {order.documents[0].version}
            </a>
          </li>
        ) : null}
      </ul>
      <AdminActions id={order.id} print={order.deliveryType === "print_digital"} />
    </article>
  );
}
