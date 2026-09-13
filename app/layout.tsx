import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X-Win",
  description:
    "UK skill-based prize competitions. Foundations only — product features are not live yet.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
