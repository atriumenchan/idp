import type { Metadata } from "next";
import { ContactForm } from "@/app/contact/ContactForm";
import Link from "next/link";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <article className="mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Support</p>
        <h1 className="mt-2 font-serif text-5xl">Contact</h1>
        <p className="mt-4 text-lg leading-relaxed text-mute">
          Send a message and we reply by email. This demonstration has no phone line and no live chat. The form sends only when email is configured.
        </p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed">
          <p className="rounded-3xl border border-line bg-card p-5">
            Order status is on{" "}
            <Link className="font-semibold text-pine" href="/order/lookup">
              Check an order
            </Link>
            . Use the email from the application and the order id.
          </p>
          <p className="rounded-3xl border border-line bg-card p-5">
            Short answers are on the{" "}
            <Link className="font-semibold text-pine" href="/faq">
              FAQ
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="rounded-[28px] border border-line bg-card p-6">
        <ContactForm />
      </div>
    </article>
  );
}
