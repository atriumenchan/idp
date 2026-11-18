export type CountryRecord = {
  country: string;
  code: string;
  officialDocumentName: string;
  issuingBody: string;
  officialUrl: string;
  /** True only after a human has checked the official source. All starter rows are false. */
  verified: boolean;
  notes: string;
};

const STARTER: Array<Pick<CountryRecord, "country" | "code">> = [
  { country: "United States", code: "US" },
  { country: "United Kingdom", code: "GB" },
  { country: "India", code: "IN" },
  { country: "United Arab Emirates", code: "AE" },
  { country: "Germany", code: "DE" },
  { country: "France", code: "FR" },
  { country: "Australia", code: "AU" },
  { country: "Canada", code: "CA" },
  { country: "Japan", code: "JP" },
  { country: "Brazil", code: "BR" },
  { country: "Italy", code: "IT" },
  { country: "Spain", code: "ES" },
  { country: "Thailand", code: "TH" },
  { country: "Portugal", code: "PT" },
  { country: "Greece", code: "GR" },
  { country: "Singapore", code: "SG" },
];

export function flagEmoji(code: string) {
  return [...code.toUpperCase()].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join("");
}

export const COUNTRIES: CountryRecord[] = STARTER.map((item) => ({
  ...item,
  officialDocumentName: "International Driving Permit",
  issuingBody: "An authorised issuer in the country that issued the licence",
  officialUrl: "https://example.com/todo-verify",
  verified: false,
  notes: `The driving rules for ${item.country} have not been verified in this demonstration database. Confirm them with an official source before you travel.`,
}));

export const POPULAR_DESTINATIONS = ["France", "Japan", "United Arab Emirates", "Italy", "United Kingdom", "Thailand"];

export function findCountry(name: string) {
  return COUNTRIES.find((item) => item.country === name);
}
