import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/currencies";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let dbError = "";
  try {
    orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  } catch {
    dbError = "The database is not available. Check DATABASE_URL and run npx prisma migrate dev.";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">Orders</h1>
        <div className="flex gap-3 text-sm">
          <a className="underline" href="/api/admin/export">Export CSV</a>
          <form action="/api/admin/logout" method="post">
            <button className="underline" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
      {dbError ? <p className="mt-4 text-sm">{dbError}</p> : null}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-3">Created</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Amount</th>
              <th className="py-2">Order</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line">
                <td className="py-2 pr-3">{order.createdAt.toISOString().slice(0, 10)}</td>
                <td className="py-2 pr-3">{order.email}</td>
                <td className="py-2 pr-3">{order.status}</td>
                <td className="py-2 pr-3">{formatMoney(order.amountCents, order.currency)}</td>
                <td className="py-2">
                  <Link className="underline" href={`/admin/orders/${order.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !dbError ? <p className="mt-4 text-sm">No orders yet.</p> : null}
      </div>
    </div>
  );
}
