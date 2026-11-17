import type { Metadata } from "next";
import { LookupForm } from "@/app/order/lookup/LookupForm";

export const metadata: Metadata = { title: "Check an order" };

export default function LookupPage() {
  return (
    <article className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-serif text-4xl">Check an order</h1>
      <p className="mt-3 text-sm">Enter the order id and the email used on the application. The status is shown only when both match.</p>
      <LookupForm />
    </article>
  );
}
