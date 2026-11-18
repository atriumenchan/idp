import type { Metadata } from "next";
import Link from "next/link";
import { CountryChecker } from "@/components/marketing/CountryChecker";
import { COUNTRIES, flagEmoji } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Check a destination against the unverified starter list, and see where an official document would come from.",
};

type Props = { searchParams: Promise<{ destination?: string; licenceCountry?: string }> };

export default async function CountriesPage({ searchParams }: Props) {
  const query = await searchParams;
  return (
    <article className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Country checker</p>
          <h1 className="mt-2 font-serif text-5xl leading-tight">Destinations</h1>
          <p className="mt-4 text-lg leading-relaxed text-mute">
            Pick the country that issued your licence and the place you are visiting. Nothing in this list says the Halden translation is accepted there. Official rules still need a checked source.
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-card p-5 shadow-lift">
          <CountryChecker idPrefix="page" initialDestination={query.destination} initialLicence={query.licenceCountry} />
        </div>
      </div>
      <h2 className="mt-14 font-serif text-3xl">Directory</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COUNTRIES.map((item) => (
          <li key={item.code}>
            <Link
              href={`/countries?destination=${encodeURIComponent(item.country)}`}
              className="block rounded-3xl border border-line bg-card px-4 py-4 transition hover:border-pine"
            >
              <span className="text-2xl" aria-hidden="true">
                {flagEmoji(item.code)}
              </span>
              <span className="mt-2 block font-serif text-xl">{item.country}</span>
              <span className="mt-1 block text-sm text-mute">{item.verified ? "Verified" : "Not verified"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
