import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
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
  portrait?: Buffer;
  portraitFormat?: "jpg" | "png";
};

const A5 = { width: 419.53, height: 595.28 };

const styles = StyleSheet.create({
  page: {
    width: A5.width,
    height: A5.height,
    backgroundColor: "#e4e4e1",
    padding: 18,
    color: "#1a1a1a",
    fontSize: 9,
  },
  frame: {
    flex: 1,
    borderWidth: 1.2,
    borderColor: "#2a2a2a",
    padding: 12,
  },
  kicker: { fontSize: 8, letterSpacing: 1.2, marginBottom: 8 },
  coverTitle: { fontSize: 22, marginTop: 28, marginBottom: 8 },
  coverSub: { fontSize: 11, lineHeight: 1.4, maxWidth: 280 },
  coverMeta: { marginTop: 28, fontSize: 10, lineHeight: 1.5 },
  coverFoot: { marginTop: "auto", fontSize: 8, lineHeight: 1.4 },
  head: {
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingBottom: 6,
    marginBottom: 8,
    fontSize: 8,
    letterSpacing: 0.8,
  },
  identity: { flexDirection: "row" },
  photo: {
    width: 92,
    height: 118,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#f3f3f1",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  photoImage: { width: 90, height: 116, objectFit: "cover" },
  photoHint: { fontSize: 7, textAlign: "center", paddingHorizontal: 6 },
  fields: { flex: 1 },
  field: { borderBottomWidth: 0.6, borderBottomColor: "#8a8a86", paddingBottom: 3, marginBottom: 4 },
  fieldLabel: { fontSize: 6.5, color: "#3f3f3c", marginBottom: 1 },
  fieldValue: { fontSize: 11 },
  classBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 6,
  },
  foot: { marginTop: 8, fontSize: 7, lineHeight: 1.35 },
  langPageTitle: { fontSize: 12, marginBottom: 6 },
  langNote: { fontSize: 8, marginBottom: 8, lineHeight: 1.35 },
  cardOuter: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    width: 243,
    height: 153,
    backgroundColor: "#f7f6f2",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 10,
  },
  cardKicker: { fontSize: 7, letterSpacing: 0.8 },
  cardName: { fontSize: 13, marginTop: 8, marginBottom: 6 },
  cardLine: { fontSize: 8, marginTop: 2 },
});

function fontFor(preferred: string, fonts: Set<string>) {
  if (fonts.has(preferred)) return preferred;
  if (fonts.has("NotoSans")) return "NotoSans";
  return "Helvetica";
}

const beside = PDF_LANGUAGES.filter((language) => ["en", "fr", "es"].includes(language.code));

export function TranslationDocument({ data }: { data: TranslationPdfData }) {
  const bodyFont = fontFor("NotoSans", data.fonts);
  const rows = [
    { key: "fullName" as const, value: data.fullName },
    { key: "dob" as const, value: data.dob },
    { key: "licenceCountry" as const, value: data.licenceCountry },
    { key: "licenceNumber" as const, value: data.licenceNumber },
    { key: "issueDate" as const, value: data.issueDate },
    { key: "expiryDate" as const, value: data.expiryDate },
  ];

  return (
    <Document title={`${PDF_PRODUCT} driving licence translation`} author={PDF_PRODUCT}>
      <Page size={A5} style={[styles.page, { fontFamily: bodyFont }]}>
        <View style={styles.frame}>
          <Text style={styles.kicker}>{PDF_PRODUCT.toUpperCase()}</Text>
          <Text style={styles.coverTitle}>Driving licence translation</Text>
          <Text style={styles.coverSub}>
            The details below are a translation of a licence the holder already has. This file is not a government document.
          </Text>
          <Text style={styles.coverMeta}>
            {data.fullName}
            {"\n"}
            Prepared {data.preparedOn}
            {"\n"}
            Digital file available for {data.validityYears} {data.validityYears === 1 ? "year" : "years"} from that date.
            {"\n"}
            Licence expiry on the original: {data.expiryDate}
          </Text>
          <Text style={styles.coverFoot}>
            Carry the original valid licence with this translation. The dates above do not replace the expiry printed on that licence.
          </Text>
        </View>
      </Page>

      <Page size={A5} style={[styles.page, { fontFamily: bodyFont }]}>
        <View style={styles.frame}>
          <Text style={styles.head}>PARTICULARS OF THE LICENCE HOLDER</Text>
          <View style={styles.identity}>
            <View style={styles.photo}>
              {data.portrait && data.portraitFormat ? (
                <Image style={styles.photoImage} src={{ data: data.portrait, format: data.portraitFormat }} />
              ) : (
                <Text style={styles.photoHint}>Portrait is supplied with the application</Text>
              )}
            </View>
            <View style={styles.fields}>
              {rows.map((row) => (
                <View key={row.key} style={styles.field}>
                  <Text style={styles.fieldLabel}>
                    {beside.map((language) => language[row.key]).join("  ·  ")}
                  </Text>
                  <Text style={styles.fieldValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.classBox}>
            <Text style={styles.fieldLabel}>
              {beside.map((language) => language.licenceClass).join("  ·  ")}
            </Text>
            <Text style={styles.fieldValue}>{data.licenceClass}</Text>
          </View>
          <Text style={styles.foot}>
            Class is copied from the original licence. This translation does not add or confirm any category.
          </Text>
        </View>
      </Page>

      {PDF_LANGUAGES.filter((language) => !["en"].includes(language.code)).map((language) => (
        <Page key={language.code} size={A5} style={[styles.page, { fontFamily: fontFor(language.font, data.fonts) }]}>
          <View style={styles.frame}>
            <Text style={styles.head}>{language.name.toUpperCase()}</Text>
            <Text style={styles.langPageTitle}>{language.title}</Text>
            <Text style={styles.langNote}>{language.note}</Text>
            {rows.map((row) => (
              <View key={row.key} style={styles.field}>
                <Text style={styles.fieldLabel}>{language[row.key]}</Text>
                <Text style={styles.fieldValue}>{row.value}</Text>
              </View>
            ))}
            <View style={styles.classBox}>
              <Text style={styles.fieldLabel}>{language.licenceClass}</Text>
              <Text style={styles.fieldValue}>{data.licenceClass}</Text>
            </View>
          </View>
        </Page>
      ))}

      <Page size={A5} style={[styles.page, { fontFamily: bodyFont }]}>
        <View style={styles.frame}>
          <Text style={styles.head}>PRINTED CARD</Text>
          <View style={styles.cardOuter}>
            <View style={styles.card}>
              <Text style={styles.cardKicker}>{PDF_PRODUCT} · LICENCE TRANSLATION</Text>
              <Text style={styles.cardName}>{data.fullName}</Text>
              <Text style={styles.cardLine}>{data.licenceCountry}</Text>
              <Text style={styles.cardLine}>{data.licenceNumber}</Text>
              <Text style={styles.cardLine}>Class {data.licenceClass}</Text>
              <Text style={styles.cardLine}>Original expiry {data.expiryDate}</Text>
            </View>
          </View>
          <Text style={styles.foot}>
            Card size is about 86 × 54 mm. It repeats the translation. It is not a substitute for the original licence.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
