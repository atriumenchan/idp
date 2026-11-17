import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-card">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg">{PRODUCT_NAME}</p>
          <p className="mt-2 text-sm leading-relaxed">
            A private translation service. It is not a government body and it is not an automobile club. You are ordering a
            translation of your existing driving licence. It is not a substitute for that licence.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Service</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/countries">Country checker</Link></li>
            <li><Link href="/how-it-works">How it works</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/apply">Start application</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/legal-disclaimer">Legal disclaimer</Link></li>
            <li><Link href="/refund">Refund policy</Link></li>
            <li><Link href="/shipping">Shipping policy</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-mute">
        © {new Date().getFullYear()} {PRODUCT_NAME}
      </p>
    </footer>
  );
}
