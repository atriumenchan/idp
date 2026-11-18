import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/marketing/FaqList";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Help</p>
      <h1 className="mt-2 font-serif text-5xl">Questions</h1>
      <p className="mt-4 text-lg leading-relaxed text-mute">
        What the translation is, what it is not, and how an order moves from the form to the file.
      </p>
      <div className="mt-8">
        <FaqList />
      </div>
      <Link href="/apply" className="btn mt-8">
        Start application
      </Link>
    </article>
  );
}
