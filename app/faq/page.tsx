import type { Metadata } from "next";
import Link from "next/link";
import { FAQS } from "@/lib/copy";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">Questions</h1>
      <div className="mt-8 space-y-3">
        {FAQS.map((item) => (
          <details key={item.q} className="rounded-lg border border-line bg-card px-4 py-3">
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <p className="mt-2 text-sm leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/apply" className="inline-flex rounded-md bg-pine px-4 py-2 text-sm text-pine2">
          Start application
        </Link>
      </div>
    </article>
  );
}
