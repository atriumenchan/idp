import type { Metadata } from "next";
import Link from "next/link";
import { StatusRefresh } from "@/components/order/StatusRefresh";
import { authorizeOrder } from "@/lib/orders";
import { formatMoney } from "@/lib/currencies";
import { PRODUCT_NAME } from "@/lib/copy";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order" };

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string; paid?: string }> };

export default async function OrderPage({ params, searchParams }: Params) {
  const { id } = await params;
  const query = await searchParams;
  const token = query.token || "";
  let order = null;
  let dbError = "";
  try {
    order = token ? await authorizeOrder(id, token) : null;
  } catch {
    dbError = "The database is not available.";
  }

  if (dbError) {
    return <p className="mx-auto max-w-xl px-4 py-16 text-sm">{dbError}</p>;
  }
  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-sm">
        <h1 className="font-serif text-3xl">Order</h1>
        <p className="mt-3">Open the link from your email, or look the order up with the email you used.</p>
        <Link className="mt-3 inline-flex underline" href="/order/lookup">
          Check an order
        </Link>
      </div>
    );
  }

  const latest = [...order.documents].sort((a, b) => b.version - a.version)[0];
  const waiting = query.paid === "1" && order.status !== "ready" && order.status !== "shipped" && !latest;

  return (
    <article className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-serif text-4xl">{PRODUCT_NAME}</h1>
      <p className="mt-3 text-sm">Order {order.id}</p>
      <p className="mt-2 text-sm">Status: {order.status.replaceAll("_", " ")}</p>
      <p className="mt-2 text-sm">
        {formatMoney(order.amountCents, order.currency)} · {order.validityYears} {order.validityYears === 1 ? "year" : "years"}
      </p>
      <StatusRefresh active={waiting || order.status === "paid"} />
      {latest ? (
        <a className="btn mt-6" href={`/api/orders/${order.id}/download?token=${encodeURIComponent(token)}`}>
          Download translation
        </a>
      ) : (
        <p className="mt-6 text-sm">The file is not ready yet.</p>
      )}
    </article>
  );
}
