"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Sign-in failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label htmlFor="password" className="text-sm font-medium">Password</label>
      <input id="password" name="password" type="password" required className="mt-1 w-full rounded-md border border-line px-3 py-2" />
      {error ? <p role="alert" className="text-sm text-red-800">{error}</p> : null}
      <button type="submit" disabled={busy} className="rounded-md bg-pine px-4 py-2 text-sm text-pine2 disabled:opacity-60">
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
