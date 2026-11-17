"use client";

import { useEffect, useState } from "react";

export function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("halden-cookie")) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed">
          This site stores a currency choice in this browser and, if you sign in as an operator, an essential session cookie. Read the{" "}
          <a className="underline" href="/privacy">
            privacy page
          </a>
          .
        </p>
        <button
          type="button"
          className="rounded-md bg-pine px-3 py-2 text-sm text-pine2"
          onClick={() => {
            window.localStorage.setItem("halden-cookie", "1");
            setOpen(false);
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
