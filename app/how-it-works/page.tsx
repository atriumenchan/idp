import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LegalNotice } from "@/components/marketing/LegalNotice";
import { STEPS } from "@/lib/copy";

const images = [
  { src: "/images/desk-booklet.jpg", alt: "An open booklet and a small card on a linen desk" },
  { src: "/images/card-walnut.jpg", alt: "A plain ivory card on walnut" },
  { src: "/images/airport-dusk.jpg", alt: "An empty seat by an airport window at dusk" },
];

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">The application</p>
      <h1 className="mt-2 font-serif text-5xl leading-tight">How it works</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">
        You already hold a valid driving licence. Halden translates the details you provide into a private digital file, with an optional printed card.
      </p>
      <ol className="mt-10 space-y-8">
        {STEPS.map((step, index) => (
          <li key={step.title} className="grid items-center gap-5 overflow-hidden rounded-[28px] border border-line bg-card sm:grid-cols-[220px_1fr]">
            <Image src={images[index].src} alt={images[index].alt} width={800} height={600} className="h-48 w-full object-cover sm:h-full" />
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pine">Step {index + 1}</p>
              <h2 className="mt-2 font-serif text-3xl">{step.title}</h2>
              <p className="mt-2 leading-relaxed text-mute">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm leading-relaxed">
        Driving rules are set by the place you visit. This translation does not decide them. If a destination asks for the official document, use the{" "}
        <Link className="font-semibold text-pine" href="/countries">
          country checker
        </Link>{" "}
        and confirm the issuer yourself.
      </p>
      <LegalNotice className="mt-6" />
      <Link href="/apply" className="btn mt-4">
        Start application
      </Link>
    </article>
  );
}
