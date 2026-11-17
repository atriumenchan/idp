import Link from "next/link";
import { CurrencyMenu } from "@/components/marketing/CurrencyMenu";
import { PRODUCT_NAME } from "@/lib/copy";

const LINKS = [
  ["How it works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
  ["Countries", "/countries"],
  ["Contact", "/contact"],
  ["Check an order", "/order/lookup"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl text-pine">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-pine text-sm font-semibold text-pine2" aria-hidden="true">
            H
          </span>
          <span className="hidden sm:inline">{PRODUCT_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-pine">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CurrencyMenu />
          <Link href="/apply" className="rounded-md bg-pine px-3 py-2 text-sm text-pine2">
            Start application
          </Link>
        </div>
      </div>
      <details className="border-t border-line px-4 py-2 md:hidden">
        <summary className="cursor-pointer text-sm">Menu</summary>
        <nav className="flex flex-col gap-2 py-2 text-sm" aria-label="Mobile">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
