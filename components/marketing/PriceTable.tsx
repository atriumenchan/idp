"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrency } from "@/components/marketing/CurrencyProvider";
import { LegalNotice } from "@/components/marketing/LegalNotice";
import { convertFromUsdCents, formatMoney } from "@/lib/currencies";
import { deliveryLabel, USD_CENTS, VALIDITY_YEARS, type DeliveryType, type ValidityYears } from "@/lib/pricing";

const POINTS: Record<DeliveryType, string[]> = {
  print_digital: [
    "Digital PDF and a printed card posted to your address",
    "The same details in 12 languages",
    "Free resend of the digital file while the order is active",
    "Shipping status updated on the order after it is marked shipped",
  ],
  digital: [
    "Digital PDF after payment is confirmed",
    "The same details in 12 languages",
    "Free resend of the digital file while the order is active",
    "No shipping address required",
  ],
};

export function PriceTable() {
  const { currency } = useCurrency();
  const [years, setYears] = useState<ValidityYears>(1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="How long we keep the file">
        {VALIDITY_YEARS.map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={years === option}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              years === option ? "bg-navy text-ivory" : "border border-line bg-card text-ink hover:border-pine"
            }`}
            onClick={() => setYears(option)}
          >
            {option} {option === 1 ? "year" : "years"}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-mute">
        The year you pick is how long the digital file stays available. It does not change the expiry on your licence.
        Amounts other than USD use the fixed rate table on this site. The server calculates what you pay.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {(["print_digital", "digital"] as DeliveryType[]).map((delivery) => {
          const amount = convertFromUsdCents(USD_CENTS[delivery][years], currency);
          const featured = delivery === "print_digital";
          const href = `/apply?delivery=${delivery}&years=${years}`;
          return (
            <article
              key={delivery}
              className={`flex flex-col rounded-3xl p-6 ${featured ? "bg-navy text-ivory shadow-lift" : "border border-line bg-card"}`}
            >
              <p className={`text-xs uppercase tracking-[0.16em] ${featured ? "text-gold" : "text-sand"}`}>
                {featured ? "Digital file and printed card" : "Digital file"}
              </p>
              <h3 className="mt-2 font-serif text-3xl">{deliveryLabel(delivery)}</h3>
              <p className="mt-3 font-serif text-5xl">{formatMoney(amount, currency)}</p>
              <ul className={`mt-5 flex-1 space-y-2 text-sm leading-relaxed ${featured ? "text-ivory/80" : "text-ink/80"}`}>
                {POINTS[delivery].map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden="true" className={featured ? "text-gold" : "text-pine"}>
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LegalNotice className={featured ? "bg-white/10 text-ivory border-white/15" : ""} />
                <Link href={href} className={`btn mt-3 w-full ${featured ? "" : "btn-ink"}`}>
                  Continue with this package
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
