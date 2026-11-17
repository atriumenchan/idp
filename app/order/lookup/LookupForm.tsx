"use client";

import { useState } from "react";

export function LookupForm() {
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setDownloadUrl(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: form.get("orderId"), email: form.get("email") }),
    });
    const data = (await res.json()) as { status?: string; downloadUrl?: string | null; error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "No order found");
      return;
    }
    setStatus(data.status || "");
    setDownloadUrl(data.downloadUrl || null);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <div>
        <label htmlFor="orderId" className="text-sm font-medium">Order id</label>
        <input id="orderId" name="orderId" required className="mt-1 w-full rounded-md border border-line px-3 py-2" />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-line px-3 py-2" />
      </div>
      {error ? <p role="alert" className="text-sm text-red-800">{error}</p> : null}
      {status ? <p className="text-sm">Status: {status.replaceAll("_", " ")}</p> : null}
      {downloadUrl ? (
        <a className="inline-flex text-sm underline" href={downloadUrl}>
          Download translation
        </a>
      ) : null}
      <button type="submit" disabled={busy} className="rounded-md bg-pine px-4 py-2 text-sm text-pine2 disabled:opacity-60">
        {busy ? "Checking…" : "Check order"}
      </button>
    </form>
  );
}
