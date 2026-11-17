import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="font-serif text-4xl">Terms</h1>
      <p className="mt-4">
        Halden Licence Translation is a private service. By placing an order you ask us to prepare a multilingual translation of the driving licence details you submit. You confirm that the licence is yours and that the details are accurate.
      </p>
      <p className="mt-3">You are responsible for checking the rules at your destination.</p>
      <p className="mt-3">
        Prices are shown before you pay and charged by Stripe in the currency stored on the order. The access period you choose is how long we keep the digital file available. It does not change the expiry date on your licence.
      </p>
      <p className="mt-3">Refunds follow the refund page. Shipping follows the shipping page.</p>
    </article>
  );
}
