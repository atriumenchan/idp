import type { Metadata } from "next";
import Image from "next/image";
import { PriceTable } from "@/components/marketing/PriceTable";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_240px]">
        <div>
          <h1 className="font-serif text-4xl">Pricing</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed">
            Choose a digital file, or a digital file and a printed card, for 1, 2, or 3 years of file access. The price is set on the server from the plan you choose.
          </p>
        </div>
        <Image src="/images/printed-card.jpg" alt="A blank card beside a closed notebook" width={800} height={600} className="h-40 w-full rounded-2xl border border-line object-cover" />
      </div>
      <div className="mt-8">
        <PriceTable />
      </div>
    </article>
  );
}
