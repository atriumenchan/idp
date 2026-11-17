import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refunds" };

export default function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="font-serif text-4xl">Refunds</h1>
      <p className="mt-4">
        You can ask for a refund before the translation file is downloaded, and within 14 days of the order date if it has not been downloaded. Once the file has been downloaded, it is not refunded.
      </p>
      <p className="mt-3">
        If you ordered a printed card, a refund is also unavailable after the order is marked shipped.
      </p>
      <p className="mt-3">
        Resending the digital file while the order is active is free and is not a refund. Write through the contact form, or the operator can refund the Stripe payment from the order screen when the rule above is met.
      </p>
    </article>
  );
}
