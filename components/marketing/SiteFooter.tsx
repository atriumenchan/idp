import Link from "next/link";
import { LogoMark } from "@/components/marketing/Logo";
import { PRODUCT_DESCRIPTION, PRODUCT_FULL_NAME } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <LogoMark />
            <p className="font-serif text-2xl">{PRODUCT_FULL_NAME}</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ivory/75">{PRODUCT_DESCRIPTION}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Service</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li><Link href="/how-it-works">How it works</Link></li>
            <li><Link href="/countries">Country checker</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/apply">Start application</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/order/lookup">Check an order</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/refund">Refund policy</Link></li>
            <li><Link href="/shipping">Shipping policy</Link></li>
            <li><Link href="/legal-disclaimer">Legal disclaimer</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Before you pay</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/75">
            Halden is a private translation service. It is not a government body and it is not an automobile club. You are
            ordering a translation of your existing driving licence. Carry that licence with you, and check the rules at your
            destination.
          </p>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-xs text-ivory/60">
        © {new Date().getFullYear()} {PRODUCT_FULL_NAME}
      </p>
    </footer>
  );
}
