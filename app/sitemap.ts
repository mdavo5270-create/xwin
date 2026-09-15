import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/pronostics", "/analyses", "/resultats", "/premium", "/montantes", "/a-propos", "/faq", "/contact"];
  return paths.map((path) => ({ url: SITE_URL + path, changeFrequency: "daily", priority: path === "/" ? 1 : 0.7 }));
}
