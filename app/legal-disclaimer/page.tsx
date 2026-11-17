import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Legal disclaimer" };

export default function LegalDisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="font-serif text-4xl">Legal disclaimer</h1>
      <p className="mt-4">
        Halden Licence Translation is a private company in the sense of this product: a private translation service. It is not a government authority, embassy, consulate, or licensing authority, and it is not an automobile club.
      </p>
      <p className="mt-3">
        An International Driving Permit is an official document. Where a destination asks for one, it is issued by an authorised body in the country that issued your driving licence. This website does not issue that document. The{" "}
        <Link className="underline" href="/countries">
          country checker
        </Link>{" "}
        lists a placeholder issuer link marked TODO_VERIFY until those sources are filled in.
      </p>
      <p className="mt-3">Nothing on this site promises that another person or organisation must accept the translation.</p>
    </article>
  );
}
