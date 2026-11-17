export type CountryRecord = {
  country: string;
  officialDocumentName: string;
  issuingBody: string;
  officialUrl: string;
  notes: string;
};

const STARTER = [
  "United States",
  "United Kingdom",
  "India",
  "United Arab Emirates",
  "Germany",
  "France",
  "Australia",
  "Canada",
  "Japan",
  "Brazil",
] as const;

export const COUNTRIES: CountryRecord[] = STARTER.map((country) => ({
  country,
  officialDocumentName: "TODO_VERIFY International Driving Permit",
  issuingBody: "TODO_VERIFY authorised issuer",
  officialUrl: "https://example.com/todo-verify",
  notes: `TODO_VERIFY: confirm whether ${country} commonly asks visitors for the official document issued in the driver's home country.`,
}));

export function findCountry(name: string) {
  return COUNTRIES.find((item) => item.country === name);
}
