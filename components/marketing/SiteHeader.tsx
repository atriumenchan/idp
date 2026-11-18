"use client";

import Link from "next/link";
import { useState } from "react";
import { CurrencyMenu } from "@/components/marketing/CurrencyMenu";
import { LogoMark } from "@/components/marketing/Logo";
import { PRODUCT_NAME } from "@/lib/copy";

const LINKS = [
  ["How it works", "/how-it-works"],
  ["Destinations", "/countries"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Check an order", "/order/lookup"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="leading-tight">
            <span className="block font-serif text-xl tracking-tight">{PRODUCT_NAME}</span>
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-mute sm:block">Licence translation</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-ink/80 lg:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-pine">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CurrencyMenu />
          <Link href="/apply" className="btn hidden sm:inline-flex">
            Start application
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-line bg-ivory px-4 py-4 lg:hidden" aria-label="Mobile">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 text-base">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="py-1">
                {label}
              </Link>
            ))}
            <Link href="/apply" className="btn mt-2" onClick={() => setOpen(false)}>
              Start application
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
