import type { Metadata } from "next";
import Image from "next/image";
import { CountryChecker } from "@/components/marketing/CountryChecker";

export const metadata: Metadata = {
  title: "Countries",
  description: "Check whether a destination commonly asks for the official document, and where that document is issued.",
};

export default function CountriesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Image
        src="/images/hero-travel.jpg"
        alt="Hands holding a blank sheet beside a suitcase"
        width={1280}
        height={720}
        className="mb-8 h-52 w-full rounded-2xl border border-line object-cover"
      />
      <h1 className="font-serif text-4xl">Country checker</h1>
      <p className="mt-3 text-sm leading-relaxed">
        Pick the country that issued your licence and the place you are visiting. Every factual field in this starter list is marked TODO_VERIFY so it can be replaced with a checked source. The result names the official document and links to the listed issuer. It does not say this translation is valid there.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-card p-5">
        <CountryChecker idPrefix="page" />
      </div>
    </article>
  );
}
