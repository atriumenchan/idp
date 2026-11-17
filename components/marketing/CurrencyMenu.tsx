"use client";

import { CURRENCIES } from "@/lib/currencies";
import { useCurrency } from "@/components/marketing/CurrencyProvider";

export function CurrencyMenu() {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className="text-sm">
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as (typeof CURRENCIES)[number]["code"])}
        className="rounded-md border border-line bg-card text-ink px-2 py-1 text-sm"
      >
        {CURRENCIES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
