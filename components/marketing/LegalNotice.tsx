import { BUY_NOTICE } from "@/lib/copy";

export function LegalNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`legal-note rounded-xl px-4 py-3 text-sm leading-relaxed ${className}`} role="note">
      {BUY_NOTICE}
    </p>
  );
}
