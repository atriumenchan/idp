"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
        website: form.get("website"),
      }),
    });
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setStatus("error");
      setMessage(data?.error || "The message could not be sent.");
      return;
    }
    setStatus("sent");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input id="name" name="name" required className="mt-1 w-full rounded-md border border-line px-3 py-2" />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-line px-3 py-2" />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea id="message" name="message" required minLength={10} rows={5} className="mt-1 w-full rounded-md border border-line px-3 py-2" />
      </div>
      {message ? (
        <p role="alert" className="text-sm text-red-800">
          {message}
        </p>
      ) : null}
      {status === "sent" ? <p className="text-sm">Message sent.</p> : null}
      <button type="submit" disabled={status === "sending"} className="rounded-md bg-pine px-4 py-2 text-sm text-pine2 disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
