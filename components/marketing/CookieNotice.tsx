"use client";

import { useEffect, useState } from "react";

export function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("halden-cookie")) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-line bg-card px-4 py-3 shadow-lift sm:inset-x-auto sm:right-4 sm:max-w-md">
      <div className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed">
          This site stores a currency choice in this browser and, if you sign in as an operator, an essential session cookie. Read the{" "}
          <a className="underline" href="/privacy">
            privacy page
          </a>
          .
        </p>
        <button
          type="button"
          className="btn"
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
