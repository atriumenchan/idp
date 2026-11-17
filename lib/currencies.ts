export const CURRENCIES = [
  { code: "usd", label: "USD", perUsd: 1, zeroDecimal: false },
  { code: "aed", label: "AED", perUsd: 3.67, zeroDecimal: false },
  { code: "aud", label: "AUD", perUsd: 1.55, zeroDecimal: false },
  { code: "cad", label: "CAD", perUsd: 1.4, zeroDecimal: false },
  { code: "cny", label: "CNY", perUsd: 7.2, zeroDecimal: false },
  { code: "eur", label: "EUR", perUsd: 0.92, zeroDecimal: false },
  { code: "gbp", label: "GBP", perUsd: 0.78, zeroDecimal: false },
  { code: "inr", label: "INR", perUsd: 84, zeroDecimal: false },
  { code: "jpy", label: "JPY", perUsd: 150, zeroDecimal: true },
  { code: "pln", label: "PLN", perUsd: 4, zeroDecimal: false },
  { code: "sgd", label: "SGD", perUsd: 1.35, zeroDecimal: false },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export function findCurrency(code: string) {
  return CURRENCIES.find((item) => item.code === code.toLowerCase());
}

export function isCurrencyCode(code: string): code is CurrencyCode {
  return Boolean(findCurrency(code));
}

/** Fixed rate table, not a live foreign-exchange feed. */
export function convertFromUsdCents(usdCents: number, code: string) {
  const currency = findCurrency(code);
  if (!currency) {
    throw new Error("Unsupported currency");
  }
  const major = (usdCents / 100) * currency.perUsd;
  if (currency.zeroDecimal) {
    return Math.max(1, Math.round(major));
  }
  return Math.max(1, Math.round(major * 100));
}

export function formatMoney(amountMinor: number, code: string) {
  const currency = findCurrency(code);
  const upper = (currency?.code ?? code).toUpperCase();
  const value = currency?.zeroDecimal ? amountMinor : amountMinor / 100;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: upper,
  }).format(value);
}
