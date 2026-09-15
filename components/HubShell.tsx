import Link from "next/link";
import type { Member } from "@/lib/types";
import "@/app/hub.css";

const TABS = [
  { href: "/abonnement", label: "Abonnement" },
  { href: "/accueil", label: "Sports" },
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
  tab: string;
  children: React.ReactNode;
}) {
  const title = member?.publicId || (member ? member.name : "Invité");
  const active = tab === "/pronostics" ? "/accueil" : tab;
  return (
    <div className="hub">
      <div className="hub-frame">
        <header className="hub-top">
          <div className="hub-ava" aria-hidden />
          <Link className="hub-who" href={member ? "/app/profil" : "/connexion"}>
            <strong>{title}</strong>
            <span>Profil personnel</span>
          </Link>
          <Link className="hub-ico" href="/contact" aria-label="Messages">@</Link>
          <Link className="hub-ico" href={member ? "/app/securite" : "/connexion"} aria-label="Réglages">*</Link>
        </header>
        <nav className="hub-tabs">
          {TABS.map((t) => (
            <Link key={t.href} className={t.href === active ? "on" : ""} href={t.href}>{t.label}</Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
