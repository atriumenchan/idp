import type { Metadata } from "next";
import { ApplyWizard } from "@/components/forms/ApplyWizard";

export const metadata: Metadata = { title: "Apply" };

export default function ApplyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Application</p>
      <h1 className="mt-2 font-serif text-5xl">Start your translation</h1>
      <p className="mt-4 text-lg leading-relaxed text-mute">
        Confirm the licence is valid, enter the details printed on it, upload three files, choose a package, then review. The first save is stored on the server.
      </p>
      <div className="mt-8 rounded-[28px] border border-line bg-card p-5 sm:p-8">
        <ApplyWizard />
      </div>
    </article>
  );
}
