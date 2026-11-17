import type { Metadata } from "next";
import { ApplyWizard } from "@/components/forms/ApplyWizard";

export const metadata: Metadata = { title: "Apply" };

export default function ApplyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">Application</h1>
      <p className="mt-3 text-sm leading-relaxed">
        Four steps: licence details, uploads, plan, then review. Progress is saved on the server once the first step is accepted.
      </p>
      <div className="mt-8">
        <ApplyWizard />
      </div>
    </article>
  );
}
