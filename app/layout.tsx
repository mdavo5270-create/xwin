import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getMember } from "@/lib/members";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "XWIN",
  description: "Plateforme pronos et montantes",
  applicationName: "XWIN",
};

export const viewport: Viewport = {
  themeColor: "#0b3d3a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const member = await getMember();
  return (
    <html lang="fr">
      <body>{member ? <Shell member={member}>{children}</Shell> : children}</body>
    </html>
  );
}
