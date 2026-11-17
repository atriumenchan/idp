"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="mt-3 text-sm">This page could not be shown. You can try again.</p>
      <button type="button" onClick={reset} className="mt-4 rounded-md bg-pine px-4 py-2 text-sm text-pine2">
        Try again
      </button>
    </div>
  );
}
