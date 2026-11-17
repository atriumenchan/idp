import "server-only";
import { existsSync } from "fs";
import path from "path";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import { TranslationDocument, type TranslationPdfData } from "@/lib/pdf/document";

const FONT_FILES: Record<string, string> = {
  NotoSans: "NotoSans-Regular.ttf",
  NotoSansArabic: "NotoSansArabic-Regular.ttf",
  NotoSansDevanagari: "NotoSansDevanagari-Regular.ttf",
  NotoSansSC: "NotoSansSC-Regular.otf",
  NotoSansJP: "NotoSansJP-Regular.otf",
  NotoSansKR: "NotoSansKR-Regular.otf",
};

let registered = false;

export function registeredPdfFonts() {
  if (!registered) {
    registered = true;
    Font.registerHyphenationCallback((word) => [word]);
    for (const [family, file] of Object.entries(FONT_FILES)) {
      const full = path.join(process.cwd(), "assets", "fonts", file);
      if (existsSync(full)) Font.register({ family, src: full });
    }
  }
  return new Set(
    Object.entries(FONT_FILES)
      .filter(([, file]) => existsSync(path.join(process.cwd(), "assets", "fonts", file)))
      .map(([family]) => family),
  );
}

export async function renderTranslationPdf(data: Omit<TranslationPdfData, "fonts">) {
  const fonts = registeredPdfFonts();
  const buffer = await renderToBuffer(<TranslationDocument data={{ ...data, fonts }} />);
  return Buffer.from(buffer);
}
