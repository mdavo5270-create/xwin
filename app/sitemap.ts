import type { MetadataRoute } from "next";

const BASE_URL = "https://xwin-staiglobal0-6471.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/pronostics", "/analyses", "/resultats", "/premium", "/montantes", "/a-propos", "/faq", "/contact"];
  return paths.map((path) => ({ url: BASE_URL + path, changeFrequency: "daily", priority: path === "/" ? 1 : 0.7 }));
}
