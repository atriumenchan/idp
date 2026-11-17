import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Privacy" };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">Privacy</h1>
      <p className="mt-3 text-sm">This page describes what Halden Licence Translation stores when you use the site.</p>
      <Section title="What we collect">
        <p>If you apply, we store your email, the licence details you type, the country you are visiting, and the files you upload (licence front, licence back, and a portrait photo). If you choose a printed card, we store the shipping address. Payment card numbers are handled by Stripe, not stored on this server.</p>
      </Section>
      <Section title="Why">
        <p>We use those details to prepare the translation, take payment, email the file, and, if you asked for a printed card, to post it. Messages sent through the contact form are emailed to the operator.</p>
      </Section>
      <Section title="Where files live">
        <p>Uploads and generated PDFs are stored in a private bucket (Cloudflare R2) when that service is configured. Otherwise they stay on the server that runs this app. Downloads use short-lived links.</p>
      </Section>
      <Section title="Cookies and local storage">
        <p>The currency menu stores your choice in local storage. The operator sign-in uses an httpOnly session cookie. The cookie notice stores a dismissal flag in local storage.</p>
      </Section>
      <Section title="How long">
        <p>The digital file stays available for the 1, 2, or 3 years you choose. You can ask us to delete an order by writing through the contact form.</p>
      </Section>
    </article>
  );
}
