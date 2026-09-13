import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://xwin-staiglobal0-6471.vercel.app";
  const paths = ["/", "/pronostics", "/analyses", "/resultats", "/premium", "/a-propos", "/faq", "/contact"];
  return paths.map((path) => ({ url: base + path, changeFrequency: "daily", priority: path === "/" ? 1 : 0.7 }));
}
