"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrency } from "@/components/marketing/CurrencyProvider";
import { convertFromUsdCents, formatMoney } from "@/lib/currencies";
import { deliveryLabel, USD_CENTS, VALIDITY_YEARS, type DeliveryType, type ValidityYears } from "@/lib/pricing";

export function PriceTable() {
  const { currency } = useCurrency();
  const [years, setYears] = useState<ValidityYears>(1);

  return (
    <div>
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Validity">
        {VALIDITY_YEARS.map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={years === option}
            className={`rounded-full px-3 py-1 text-sm ${years === option ? "bg-pine text-pine2" : "border border-line bg-card"}`}
            onClick={() => setYears(option)}
          >
            {option} {option === 1 ? "year" : "years"}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-mute">
        Amounts in currencies other than USD use a fixed rate table on this site. The amount you pay is calculated on the server in the currency you select.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {(["print_digital", "digital"] as DeliveryType[]).map((delivery) => {
          const amount = convertFromUsdCents(USD_CENTS[delivery][years], currency);
          const href = `/apply?delivery=${delivery}&years=${years}`;
          return (
            <article key={delivery} className="flex flex-col rounded-xl border border-line bg-card p-5">
              <h3 className="font-serif text-2xl">{deliveryLabel(delivery)}</h3>
              <p className="mt-2 text-3xl">{formatMoney(amount, currency)}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm leading-relaxed">
                {delivery === "print_digital" ? (
                  <>
                    <li>Digital file and a printed card posted to your address</li>
                    <li>Same translation in 12 languages</li>
                    <li>Free resend of the digital file while the order is active</li>
                  </>
                ) : (
                  <>
                    <li>Digital PDF after payment is confirmed</li>
                    <li>Same translation in 12 languages</li>
                    <li>Free resend of the digital file while the order is active</li>
                  </>
                )}
              </ul>
              <div className="mt-5">
                <Link href={href} className="inline-flex rounded-md bg-pine px-4 py-2 text-sm text-pine2">
                  Continue
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
