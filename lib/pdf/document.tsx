import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PDF_LANGUAGES, PDF_PRODUCT } from "@/lib/pdf/labels";

export type TranslationPdfData = {
  fullName: string;
  dob: string;
  licenceCountry: string;
  licenceNumber: string;
  licenceClass: string;
  issueDate: string;
  expiryDate: string;
  validityYears: number;
  preparedOn: string;
  fonts: Set<string>;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 42,
    paddingBottom: 96,
    fontSize: 11,
    color: "#1c1917",
  },
  kicker: { fontSize: 10, marginBottom: 6, color: "#0b0f1a" },
  title: { fontSize: 18, marginBottom: 10 },
  paragraph: { fontSize: 11, marginBottom: 8, lineHeight: 1.4 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e3dcd0",
    paddingVertical: 5,
  },
  label: { width: "42%" },
  value: { width: "58%" },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 42,
    right: 42,
    fontSize: 8,
    lineHeight: 1.35,
    color: "#44403c",
  },
});

function fontFor(preferred: string, fonts: Set<string>) {
  if (fonts.has(preferred)) return preferred;
  if (fonts.has("NotoSans")) return "NotoSans";
  return "Helvetica";
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function TranslationDocument({ data }: { data: TranslationPdfData }) {
  const coverFont = fontFor("NotoSans", data.fonts);
  const rows = [
    ["fullName", data.fullName],
    ["dob", data.dob],
    ["licenceCountry", data.licenceCountry],
    ["licenceNumber", data.licenceNumber],
    ["licenceClass", data.licenceClass],
    ["issueDate", data.issueDate],
    ["expiryDate", data.expiryDate],
  ] as const;

  return (
    <Document title={`${PDF_PRODUCT}`} author={PDF_PRODUCT}>
      <Page size="A4" style={[styles.page, { fontFamily: coverFont }]}>
        <Text style={styles.kicker}>{PDF_PRODUCT}</Text>
        <Text style={styles.title}>Driving licence translation</Text>
        <Text style={styles.paragraph}>
          A multilingual translation of a valid licence to help others read these details abroad.
        </Text>
        <Text style={styles.paragraph}>Prepared for {data.fullName} on {data.preparedOn}.</Text>
        <Text style={styles.paragraph}>
          Digital file access period: {data.validityYears} {data.validityYears === 1 ? "year" : "years"} from {data.preparedOn}. This period does not change the licence expiry date.
        </Text>
      </Page>
      {PDF_LANGUAGES.map((language) => (
        <Page key={language.code} size="A4" style={[styles.page, { fontFamily: fontFor(language.font, data.fonts) }]}>
          <Text style={styles.kicker}>{language.name}</Text>
          <Text style={styles.title}>{language.title}</Text>
          <Text style={styles.paragraph}>{language.note}</Text>
          {rows.map(([key, value]) => (
            <Field key={key} label={language[key]} value={value} />
          ))}
        </Page>
      ))}
    </Document>
  );
}
