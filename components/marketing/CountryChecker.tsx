"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

export function CountryChecker({ idPrefix = "country" }: { idPrefix?: string }) {
  const [query, setQuery] = useState("");
  const [licence, setLicence] = useState(COUNTRIES[0]?.country ?? "");
  const [destination, setDestination] = useState(COUNTRIES[1]?.country ?? COUNTRIES[0]?.country ?? "");

  const options = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COUNTRIES;
    return COUNTRIES.filter((item) => item.country.toLowerCase().includes(needle));
  }, [query]);

  const licenceRecord = COUNTRIES.find((item) => item.country === licence);
  const destinationRecord = COUNTRIES.find((item) => item.country === destination);

  return (
    <form className="space-y-4" action="/apply">
      <div>
        <label htmlFor={`${idPrefix}-search`} className="text-sm font-medium">
          Search countries
        </label>
        <input
          id={`${idPrefix}-search`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2"
          placeholder="Type a country name"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-licence`} className="text-sm font-medium">
            Where was your licence issued?
          </label>
          <select
            id={`${idPrefix}-licence`}
            name="licenceCountry"
            value={licence}
            onChange={(event) => setLicence(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2"
          >
            {options.map((item) => (
              <option key={item.country} value={item.country}>
                {item.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-destination`} className="text-sm font-medium">
            Where are you going?
          </label>
          <select
            id={`${idPrefix}-destination`}
            name="destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2"
          >
            {options.map((item) => (
              <option key={item.country} value={item.country}>
                {item.country}
              </option>
            ))}
          </select>
        </div>
      </div>
      {licenceRecord && destinationRecord ? (
        <div className="rounded-lg border border-line bg-card p-4 text-sm leading-relaxed">
          <p>{destinationRecord.notes}</p>
          <p className="mt-2">
            The official document listed for a {licenceRecord.country} licence is {licenceRecord.officialDocumentName}, issued by{" "}
            {licenceRecord.issuingBody}.{" "}
            <a className="underline" href={licenceRecord.officialUrl}>
              Issuer link (placeholder)
            </a>
            .
          </p>
          </div>
      ) : null}
      <p className="text-sm text-mute">About 2 minutes to complete.</p>
      <Link
        href={`/apply?licenceCountry=${encodeURIComponent(licence)}&destination=${encodeURIComponent(destination)}`}
        className="inline-flex rounded-md bg-pine px-4 py-2 text-sm text-pine2"
      >
        Get started
      </Link>
    </form>
  );
}
