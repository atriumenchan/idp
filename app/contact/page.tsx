import type { Metadata } from "next";
import { ContactForm } from "@/app/contact/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-serif text-4xl">Contact</h1>
      <p className="mt-3 text-sm leading-relaxed">
        Send a message and we will reply by email. The form works when Resend is configured. There is no live chat on this site.
      </p>
      <ContactForm />
    </article>
  );
}
