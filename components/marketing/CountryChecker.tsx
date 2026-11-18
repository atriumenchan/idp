"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LegalNotice } from "@/components/marketing/LegalNotice";
import { COUNTRIES, findCountry, flagEmoji } from "@/lib/countries";

export function CountryChecker({
  idPrefix = "country",
  initialLicence,
  initialDestination,
}: {
  idPrefix?: string;
  initialLicence?: string;
  initialDestination?: string;
}) {
  const [query, setQuery] = useState("");
  const [licence, setLicence] = useState(initialLicence && findCountry(initialLicence) ? initialLicence : COUNTRIES[0].country);
  const [destination, setDestination] = useState(
    initialDestination && findCountry(initialDestination) ? initialDestination : COUNTRIES[3].country,
  );
  const [result, setResult] = useState(false);
  const [problem, setProblem] = useState("");

  const options = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COUNTRIES;
    return COUNTRIES.filter((item) => item.country.toLowerCase().includes(needle) || item.code.toLowerCase().includes(needle));
  }, [query]);

  const licenceRecord = findCountry(licence);
  const destinationRecord = findCountry(destination);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!licenceRecord || !destinationRecord) {
      setProblem("Choose a licence country and a destination from the list.");
      setResult(false);
      return;
    }
    setProblem("");
    setResult(true);
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor={`${idPrefix}-search`} className="text-xs font-semibold uppercase tracking-[0.14em] text-mute">
          Search the list
        </label>
        <input
          id={`${idPrefix}-search`}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setResult(false);
          }}
          className="mt-1 w-full px-3 py-3"
          placeholder="France, Japan, AE…"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-licence`} className="text-sm font-medium">
            Licence issued in
          </label>
          <select
            id={`${idPrefix}-licence`}
            value={licence}
            onChange={(event) => {
              setLicence(event.target.value);
              setResult(false);
            }}
            className="mt-1 w-full px-3 py-3"
          >
            {options.map((item) => (
              <option key={item.code} value={item.country}>
                {flagEmoji(item.code)} {item.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-destination`} className="text-sm font-medium">
            Destination
          </label>
          <select
            id={`${idPrefix}-destination`}
            value={destination}
            onChange={(event) => {
              setDestination(event.target.value);
              setResult(false);
            }}
            className="mt-1 w-full px-3 py-3"
          >
            {options.map((item) => (
              <option key={item.code} value={item.country}>
                {flagEmoji(item.code)} {item.country}
              </option>
            ))}
          </select>
        </div>
      </div>
      {options.length === 0 ? <p className="notice-warn rounded-xl px-3 py-2 text-sm">No country matches that search.</p> : null}
      {problem ? (
        <p role="alert" className="notice-error rounded-xl px-3 py-2 text-sm">
          {problem}
        </p>
      ) : null}
      <button type="submit" className="btn w-full">
        Check this route
      </button>
      {result && licenceRecord && destinationRecord ? (
        <div className="rise rounded-2xl border border-line bg-ivory p-4 text-sm leading-relaxed">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand">
            {flagEmoji(destinationRecord.code)} {destinationRecord.country}
          </p>
          <p className="mt-2">{destinationRecord.notes}</p>
          <p className="mt-2">
            Where an official document is required, it is an {licenceRecord.officialDocumentName}, issued by{" "}
            {licenceRecord.issuingBody.toLowerCase()}. Halden does not issue that document. The issuer link on this demo is a
            placeholder until a source is checked.
          </p>
          {licence === destination ? (
            <p className="notice-info mt-3 rounded-xl px-3 py-2">
              The licence country and the destination are the same. A translation is usually for a trip somewhere else.
            </p>
          ) : null}
          <LegalNotice className="mt-3" />
          <Link
            href={`/apply?licenceCountry=${encodeURIComponent(licence)}&destination=${encodeURIComponent(destination)}`}
            className="btn mt-3"
          >
            Continue application
          </Link>
        </div>
      ) : null}
    </form>
  );
}
