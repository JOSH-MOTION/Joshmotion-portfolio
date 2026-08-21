import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joshmotion.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/rates`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
