"use client";

import { usePathname } from "next/navigation";
import { BUY_NOTICE } from "@/lib/copy";

export function FooterNotice() {
  const path = usePathname();
  if (path !== "/") return null;
  return <p className="mx-auto max-w-3xl text-xs leading-relaxed text-ivory/70">{BUY_NOTICE}</p>;
}
