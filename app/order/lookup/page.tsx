import type { Metadata } from "next";
import { LookupForm } from "@/app/order/lookup/LookupForm";

export const metadata: Metadata = { title: "Check an order" };

export default function LookupPage() {
  return (
    <article className="mx-auto max-w-xl px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Orders</p>
      <h1 className="mt-2 font-serif text-5xl">Check an order</h1>
      <p className="mt-4 text-lg leading-relaxed text-mute">
        Enter the order id and the email used on the application. The status is shown only when both match.
      </p>
      <div className="mt-8 rounded-[28px] border border-line bg-card p-6">
        <LookupForm />
      </div>
    </article>
  );
}
