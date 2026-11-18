import type { Metadata } from "next";
import { FaqList } from "@/components/marketing/FaqList";
import { PriceTable } from "@/components/marketing/PriceTable";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Plans</p>
      <h1 className="mt-2 font-serif text-5xl leading-tight">Pricing</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">
        Digital file, or digital file and a printed card, kept available for 1, 2, or 3 years. The amount is calculated on the server from the package you choose.
      </p>
      <div className="mt-10">
        <PriceTable />
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-2xl">Shipping</h2>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            The printed card is posted to the address on the order. This site does not promise a delivery day. Status changes when the order is marked shipped.
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-2xl">Refunds</h2>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            Available before the file is downloaded, or within 14 days of payment if it has not been downloaded. Printed orders can be refunded before the card is marked shipped.
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-2xl">Resend</h2>
          <p className="mt-2 text-sm leading-relaxed text-mute">While the order is active, another email of the digital file is free.</p>
        </article>
      </div>
      <h2 className="mt-14 font-serif text-3xl">Pricing questions</h2>
      <div className="mt-6">
        <FaqList limit={5} />
      </div>
    </article>
  );
}
