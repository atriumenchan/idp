"use client";

import { useEffect } from "react";

export function StatusRefresh({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => window.location.reload(), 4000);
    return () => window.clearTimeout(timer);
  }, [active]);
  if (!active) return null;
  return <p className="text-sm">Payment is confirmed. This page will refresh when the file is ready.</p>;
}
