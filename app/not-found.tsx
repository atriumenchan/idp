import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-serif text-3xl">Page not found</h1>
      <p className="mt-3 text-sm">That address is not on this site.</p>
      <Link href="/" className="mt-4 inline-flex text-sm underline">
        Back to the home page
      </Link>
    </div>
  );
}
