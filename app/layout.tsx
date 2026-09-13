import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XWIN",
  description: "Pronos et montantes",
  applicationName: "XWIN",
  appleWebApp: { capable: true, title: "XWIN", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0b3d3a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="phone">{children}</div>
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker" in navigator){navigator.serviceWorker.register("/sw.js")}`,
          }}
        />
      </body>
    </html>
  );
}
