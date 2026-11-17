import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="font-serif text-4xl">Shipping</h1>
      <p className="mt-4">
        Digital files are not shipped. A download link is emailed after payment is confirmed, and the same file is available from the order page.
      </p>
      <p className="mt-3">
        If you choose print + digital, we store the address you enter so a printed card of the same translation can be posted. This site does not promise a delivery day or name a carrier. The order status changes to shipped when the operator marks it sent.
      </p>
      <p className="mt-3">A printed order can be refunded only before it is marked shipped, and only if the digital file has not been downloaded and the 14-day window is still open.</p>
    </article>
  );
}
