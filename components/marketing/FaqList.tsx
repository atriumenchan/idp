"use client";

import { useState } from "react";
import { FAQS } from "@/lib/copy";

export function FaqList({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? FAQS.slice(0, limit) : FAQS;
  const [open, setOpen] = useState<string | null>(items[0]?.q ?? null);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
      {items.map((item) => {
        const expanded = open === item.q;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-ivory"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : item.q)}
            >
              <span className="font-medium">{item.q}</span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ivory text-pine" aria-hidden="true">
                {expanded ? "–" : "+"}
              </span>
            </button>
            <div className={`faq-panel ${expanded ? "open" : ""}`}>
              <div>
                <p className="px-5 pb-5 text-sm leading-relaxed text-mute">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
