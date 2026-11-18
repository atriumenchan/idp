import Image from "next/image";
import Link from "next/link";
import { HeroStart } from "@/components/marketing/HeroStart";
import { FaqList } from "@/components/marketing/FaqList";
import { FeatureIcon } from "@/components/marketing/FeatureIcon";
import { LegalNotice } from "@/components/marketing/LegalNotice";
import { PriceTable } from "@/components/marketing/PriceTable";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FEATURES, HERO, LANGUAGES, PRODUCT_DESCRIPTION, STEPS, TRUST } from "@/lib/copy";
import { COUNTRIES, flagEmoji, POPULAR_DESTINATIONS } from "@/lib/countries";

const featureIcons = ["file", "card", "calendar", "resend", "support"] as const;

export default function HomePage() {
  const popular = POPULAR_DESTINATIONS.map((name) => COUNTRIES.find((item) => item.country === name)).filter((item) => item != null);

  return (
    <div>
      <section className="bg-navy text-ivory">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <h1 className="font-serif text-4xl leading-tight text-ivory sm:text-6xl">{HERO.headline}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ivory/80">{HERO.support}</p>
          <HeroStart />
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ivory/80">
            <li>About 2 minutes</li>
            <li>Digital file after payment</li>
            <li>Optional printed card</li>
            <li>Free resend while the order is active</li>
          </ul>
          <p className="mt-6">
            <Link href="/countries" className="text-sm font-semibold text-gold">
              Check eligibility
            </Link>
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((item, index) => (
            <article key={item.title} className="rise" style={{ animationDelay: `${index * 70}ms` }}>
              <p className="font-serif text-2xl">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Three steps</p>
            <h2 className="mt-2 font-serif text-4xl">How the application works</h2>
          </div>
          <Link href="/how-it-works" className="text-sm font-semibold text-pine">
            Read the full steps
          </Link>
        </div>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="overflow-hidden rounded-[28px] border border-line bg-card">
              <Image
                src={index === 0 ? "/images/desk-booklet.jpg" : index === 1 ? "/images/card-walnut.jpg" : "/images/airport-dusk.jpg"}
                alt=""
                width={900}
                height={680}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pine">0{index + 1}</p>
                <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">What you receive</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight">A translation of the licence you already hold</h2>
            <p className="mt-4 text-base leading-relaxed text-mute">{PRODUCT_DESCRIPTION}</p>
            <p className="mt-3 text-sm leading-relaxed">Languages on the file: {LANGUAGES.join(", ")}.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {FEATURES.slice(0, 4).map((feature, index) => (
                <article key={feature.title}>
                  <FeatureIcon name={featureIcons[index] ?? "file"} />
                  <h3 className="mt-2 font-serif text-xl">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-mute">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Image
              src="/images/desk-booklet.jpg"
              alt="An open unbranded booklet and a small card on a linen desk"
              width={1200}
              height={900}
              className="h-72 w-full rounded-[28px] object-cover"
            />
            <Image
              src="/images/card-walnut.jpg"
              alt="A plain ivory card with a small H on walnut"
              width={1200}
              height={900}
              className="h-48 w-full rounded-[28px] object-cover"
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Pricing</p>
        <h2 className="mt-2 font-serif text-4xl">Choose the file, and whether you also want a card</h2>
        <div className="mt-8">
          <PriceTable />
        </div>
      </section>

      <section className="bg-navy text-ivory">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Destinations</p>
              <h2 className="mt-2 font-serif text-4xl">Check a country before you apply</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/75">
                These notes are not a statement that the translation is accepted there. Each record in this demo still needs an official source.
              </p>
            </div>
            <Link href="/countries" className="text-sm font-semibold text-gold">
              Open the full checker
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((item) => (
              <Link
                key={item.code}
                href={`/countries?destination=${encodeURIComponent(item.country)}`}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10"
              >
                <p className="text-2xl" aria-hidden="true">
                  {flagEmoji(item.code)}
                </p>
                <p className="mt-2 font-serif text-2xl">{item.country}</p>
                <p className="mt-1 text-sm text-ivory/70">Requirements not verified on this demo</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">FAQ</p>
        <h2 className="mt-2 font-serif text-4xl">Questions people ask before they pay</h2>
        <div className="mt-8">
          <FaqList limit={6} />
        </div>
        <Link href="/faq" className="mt-4 inline-flex text-sm font-semibold text-pine">
          All questions
        </Link>
      </section>

      <section className="relative mx-4 mb-16 overflow-hidden rounded-[32px] bg-navy">
        <Image src="/images/airport-dusk.jpg" alt="" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-ivory">
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">Bring the licence. We translate the details.</h2>
          <p className="mt-4 max-w-xl text-ivory/85">
            Carry the original valid licence with the translation, and confirm what your destination asks for before you travel.
          </p>
          <LegalNotice className="mt-6 bg-black/30 text-ivory border-white/20" />
          <Link href="/apply" className="btn mt-5">
            Start application
          </Link>
        </div>
      </section>
    </div>
  );
}
