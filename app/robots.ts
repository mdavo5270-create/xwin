import type { MetadataRoute } from "next";

const BASE_URL = "https://xwin-staiglobal0-6471.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/app"] }, sitemap: `${BASE_URL}/sitemap.xml` };
}
