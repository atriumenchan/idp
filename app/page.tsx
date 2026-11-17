import Image from "next/image";
import Link from "next/link";
import { CountryChecker } from "@/components/marketing/CountryChecker";
import { FeatureIcon } from "@/components/marketing/FeatureIcon";
import { PriceTable } from "@/components/marketing/PriceTable";
import { FEATURES, HERO, PRODUCT_DESCRIPTION, STEPS } from "@/lib/copy";

const featureIcons = ["file", "card", "calendar", "resend", "support"] as const;
const stepImages = [
  { src: "/images/upload-desk.jpg", alt: "A phone and a blank sheet on a navy desk" },
  { src: "/images/translation-sheet.jpg", alt: "A sheet laid out in two language columns" },
  { src: "/images/printed-card.jpg", alt: "A blank card beside a closed notebook" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-wide text-pine">Halden</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">{HERO.headline}</h1>
          <p className="mt-4 text-lg leading-relaxed">{PRODUCT_DESCRIPTION}</p>
          <p className="mt-3 text-sm leading-relaxed text-mute">{HERO.support}</p>
        </div>
        <Image
          src="/images/hero-travel.jpg"
          alt="Hands holding a blank sheet beside a suitcase"
          width={1280}
          height={720}
          priority
          className="h-auto w-full rounded-2xl border border-line object-cover"
        />
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-card p-5">
        <CountryChecker idPrefix="hero" />
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="What is included">
        {FEATURES.map((feature, index) => (
          <article key={feature.title} className="rounded-xl border border-line bg-card p-4">
            <FeatureIcon name={featureIcons[index] ?? "file"} />
            <h2 className="mt-3 font-serif text-xl">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{feature.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="overflow-hidden rounded-xl border border-line bg-card">
              <Image
                src={stepImages[index].src}
                alt={stepImages[index].alt}
                width={800}
                height={600}
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-pine">Step {index + 1}</p>
                <h3 className="mt-1 font-serif text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm">
          <Link className="underline" href="/how-it-works">
            Read the full steps
          </Link>
        </p>
      </section>

      <section className="mt-16 grid items-center gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <h2 className="font-serif text-3xl">Pricing</h2>
          <div className="mt-6">
            <PriceTable />
          </div>
        </div>
        <Image
          src="/images/printed-card.jpg"
          alt="A blank card beside a closed notebook"
          width={800}
          height={600}
          className="hidden h-auto w-full rounded-2xl border border-line lg:block"
        />
      </section>

      <section className="mt-16 grid items-start gap-8 lg:grid-cols-[280px_1fr]">
        <Image
          src="/images/translation-sheet.jpg"
          alt="A sheet laid out in two language columns"
          width={720}
          height={960}
          className="h-auto w-full rounded-2xl border border-line"
        />
        <div>
          <h2 className="font-serif text-3xl">Check a destination</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed">
            The notes below are placeholders marked TODO_VERIFY. They do not say that this translation is accepted anywhere.
          </p>
          <div className="mt-6 rounded-2xl border border-line bg-card p-5">
            <CountryChecker idPrefix="home" />
          </div>
        </div>
      </section>
    </div>
  );
}
