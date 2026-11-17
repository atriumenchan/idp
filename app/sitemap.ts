import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    "",
    "/how-it-works",
    "/pricing",
    "/faq",
    "/countries",
    "/contact",
    "/apply",
    "/order/lookup",
    "/privacy",
    "/terms",
    "/refund",
    "/legal-disclaimer",
    "/shipping",
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.6 }));
}
