import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XWIN",
    short_name: "XWIN",
    description: "Pronos et montantes",
    start_url: "/",
    display: "standalone",
    background_color: "#0b3d3a",
    theme_color: "#0b3d3a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
