import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { CookieNotice } from "@/components/marketing/CookieNotice";
import { CurrencyProvider } from "@/components/marketing/CurrencyProvider";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/copy";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif" });
const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: PRODUCT_NAME,
    template: `%s · ${PRODUCT_NAME}`,
  },
  description: PRODUCT_DESCRIPTION,
  openGraph: {
    title: PRODUCT_NAME,
    description: PRODUCT_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} bg-paper font-sans text-ink antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-pine focus:px-3 focus:py-2 focus:text-pine2">
          Skip to content
        </a>
        <CurrencyProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CookieNotice />
        </CurrencyProvider>
      </body>
    </html>
  );
}
