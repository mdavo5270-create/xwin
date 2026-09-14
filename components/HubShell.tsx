import Link from "next/link";
import type { Member } from "@/lib/types";
import "@/app/hub.css";

const TABS = [
  { href: "/accueil", label: "Marché" },
  { href: "/pronostics", label: "Sports" },
  { href: "/montantes", label: "Montante" },
  { href: "/service", label: "Stratégie" },
  { href: "/premium", label: "Autre" },
] as const;

export function HubShell({
  member,
  tab,
  children,
}: {
  member: Member | null;
  tab: (typeof TABS)[number]["href"];
  children: React.ReactNode;
}) {
  const name = member?.name || "Invité";
  return (
    <div className="hub">
      <div className="hub-frame">
        <header className="hub-top">
          <div className="hub-ava" aria-hidden>☺</div>
          <Link className="hub-who" href={member ? "/app" : "/connexion"}>
            <strong>{name}</strong>
            <span>Profil personnel</span>
          </Link>
          <Link className="hub-ico" href="/contact" aria-label="Messages">✉</Link>
          <Link className="hub-ico" href={member ? "/app/settings" : "/connexion"} aria-label="Réglages">⚙</Link>
        </header>
        <nav className="hub-tabs">
          {TABS.map((t) => (
            <Link key={t.href} className={t.href === tab ? "on" : ""} href={t.href}>{t.label}</Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
