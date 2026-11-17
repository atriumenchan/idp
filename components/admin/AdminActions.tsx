"use client";

import { useState } from "react";

export function AdminActions({ id, print }: { id: string; print: boolean }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: "regenerate" | "resend" | "refund" | "ship") {
    setBusy(true);
    setMessage("");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = (await res.json()) as { error?: string; version?: number };
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error || "The action failed");
      return;
    }
    setMessage(action === "regenerate" ? `New version ${data.version ?? ""}`.trim() : "Done");
    if (action !== "resend") window.location.reload();
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button type="button" disabled={busy} className="rounded-md border border-line px-3 py-2 text-sm" onClick={() => void run("regenerate")}>
        Regenerate file
      </button>
      <button type="button" disabled={busy} className="rounded-md border border-line px-3 py-2 text-sm" onClick={() => void run("resend")}>
        Resend email
      </button>
      {print ? (
        <button type="button" disabled={busy} className="rounded-md border border-line px-3 py-2 text-sm" onClick={() => void run("ship")}>
          Mark shipped
        </button>
      ) : null}
      <button type="button" disabled={busy} className="rounded-md border border-red-300 px-3 py-2 text-sm" onClick={() => void run("refund")}>
        Refund
      </button>
      {message ? <p className="w-full text-sm">{message}</p> : null}
    </div>
  );
}
