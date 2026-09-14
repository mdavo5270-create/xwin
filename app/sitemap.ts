import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://xwin-mu.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/pronostics", "/montantes", "/analyses", "/resultats", "/premium", "/a-propos", "/faq", "/contact"];
  return paths.map((path) => ({ url: BASE + path, changeFrequency: "daily", priority: path === "/" ? 1 : 0.7 }));
}
