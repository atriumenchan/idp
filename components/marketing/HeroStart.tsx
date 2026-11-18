"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, findCountry, flagEmoji } from "@/lib/countries";

export function HeroStart() {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");

  const options = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COUNTRIES;
    return COUNTRIES.filter(
      (item) => item.country.toLowerCase().includes(needle) || item.code.toLowerCase().includes(needle),
    );
  }, [query]);

  function choose(country: string) {
    setQuery(country);
    setOpen(false);
    setError("");
  }

  function start(event: React.FormEvent) {
    event.preventDefault();
    const exact = findCountry(query.trim()) ?? options.find((item) => item.country.toLowerCase() === query.trim().toLowerCase());
    const picked = exact ?? (options.length === 1 ? options[0] : undefined);
    if (!picked) {
      setError(options.length === 0 ? "No country matches that." : "Choose a country from the list.");
      setOpen(true);
      return;
    }
    router.push(`/apply?destination=${encodeURIComponent(picked.country)}`);
  }

  return (
    <form onSubmit={start} className="mx-auto mt-8 max-w-3xl text-left">
      <label htmlFor="hero-destination" className="text-sm text-ivory/90">
        Where are you going?
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div ref={box} className="relative min-w-0 flex-1">
          <input
            id="hero-destination"
            role="combobox"
            aria-expanded={open}
            aria-controls="hero-destination-list"
            aria-autocomplete="list"
            autoComplete="off"
            placeholder="Select the country"
            value={query}
            className="h-14 w-full rounded-xl border-0 bg-white px-4 text-base text-ink shadow-none"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
              setOpen(true);
              setError("");
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
                setActive((index) => Math.min(index + 1, Math.max(options.length - 1, 0)));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(index - 1, 0));
              } else if (event.key === "Escape") {
                setOpen(false);
              } else if (event.key === "Enter" && open && options[active]) {
                event.preventDefault();
                choose(options[active].country);
              }
            }}
          />
          {open ? (
            <ul
              id="hero-destination-list"
              role="listbox"
              className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-line bg-white py-1 text-ink shadow-lift"
            >
              {options.length === 0 ? (
                <li className="px-4 py-3 text-sm text-mute">No country matches that.</li>
              ) : (
                options.map((item, index) => (
                  <li key={item.code} role="option" aria-selected={query === item.country}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${index === active ? "bg-ivory" : ""}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => choose(item.country)}
                    >
                      <span aria-hidden="true">{flagEmoji(item.code)}</span>
                      <span>{item.country}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
        <button type="submit" className="btn btn-gold sm:w-auto">
          Get started →
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-3 rounded-xl bg-[#3a2a14] px-3 py-2 text-sm text-[#f6e2b8]">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-center text-sm text-ivory/70 sm:text-left">About 2 minutes.</p>
      )}
    </form>
  );
}
