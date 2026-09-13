import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XWIN",
    short_name: "XWIN",
    description: "Pronos et montantes",
    start_url: "/",
    display: "standalone",
    background_color: "#0D1013",
    theme_color: "#0D1013",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
