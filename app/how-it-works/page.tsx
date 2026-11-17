import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STEPS } from "@/lib/copy";

const stepImages = [
  { src: "/images/upload-desk.jpg", alt: "A phone and a blank sheet on a navy desk" },
  { src: "/images/translation-sheet.jpg", alt: "A sheet laid out in two language columns" },
  { src: "/images/printed-card.jpg", alt: "A blank card beside a closed notebook" },
];

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">How it works</h1>
      <p className="mt-4 text-sm leading-relaxed">
        You already hold a valid driving licence. We translate the details you provide into a private digital file, with an optional printed card.
      </p>
      <ol className="mt-8 space-y-8">
        {STEPS.map((step, index) => (
          <li key={step.title} className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
            <Image src={stepImages[index].src} alt={stepImages[index].alt} width={640} height={480} className="h-36 w-full rounded-xl border border-line object-cover" />
            <div>
              <h2 className="font-serif text-2xl">
                {index + 1}. {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm leading-relaxed">
        Driving rules are set by the place you visit. This translation does not decide them. If you want the official document some destinations ask for, use the{" "}
        <Link className="underline" href="/countries">
          country checker
        </Link>{" "}
        and the issuer link there.
      </p>
      <div className="mt-8">
        <Link href="/apply" className="inline-flex rounded-md bg-pine px-4 py-2 text-sm text-pine2">
          Start application
        </Link>
      </div>
    </article>
  );
}
