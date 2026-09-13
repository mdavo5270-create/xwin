import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "XWIN",
  description: "Pronos et montantes — contenu publié par l’équipe, pas de fiches fictives.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <nav className="top">
          <Link className="brand" href="/">XWIN</Link>
          <Link href="/pronos">Pronos</Link>
          <Link href="/montantes">Montantes</Link>
          <Link href="/admin" className="muted" style={{ marginLeft: "auto" }}>
            Admin
          </Link>
        </nav>
        {children}
        <footer className="bot">
          <span>18+ · Analyses / pronos — pas un bookmaker.</span>
          <Link href="/admin">Espace équipe</Link>
        </footer>
      </body>
    </html>
  );
}
