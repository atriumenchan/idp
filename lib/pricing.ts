export const DELIVERY_TYPES = ["digital", "print_digital"] as const;
export type DeliveryType = (typeof DELIVERY_TYPES)[number];
export const VALIDITY_YEARS = [1, 2, 3] as const;
export type ValidityYears = (typeof VALIDITY_YEARS)[number];

/** USD minor units (cents). Other currencies are converted in lib/currencies.ts. */
export const USD_CENTS: Record<DeliveryType, Record<ValidityYears, number>> = {
  digital: { 1: 4900, 2: 5500, 3: 5900 },
  print_digital: { 1: 6900, 2: 7500, 3: 7900 },
};

export function isDeliveryType(value: string): value is DeliveryType {
  return value === "digital" || value === "print_digital";
}

export function isValidityYears(value: number): value is ValidityYears {
  return value === 1 || value === 2 || value === 3;
}

export function usdCentsFor(delivery: DeliveryType, years: ValidityYears) {
  return USD_CENTS[delivery][years];
}

export function planId(delivery: DeliveryType, years: ValidityYears) {
  return `${delivery}_${years}`;
}

export function deliveryLabel(delivery: DeliveryType) {
  return delivery === "digital" ? "Digital copy" : "Print + digital";
}
