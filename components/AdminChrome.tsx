import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-full.png";

const LINKS = [
  ["/admin", "Vue générale"],
  ["/admin/users", "Utilisateurs"],
  ["/admin/predictions", "Pronostics"],
  ["/admin/automation", "Automatisation"],
  ["/admin/results", "Résultats"],
  ["/admin/analyses", "Analyses"],
  ["/admin/sports", "Sports"],
  ["/admin/competitions", "Compétitions"],
  ["/admin/offers", "Offres"],
  ["/admin/orders", "Commandes"],
  ["/admin/payments", "Paiements"],
  ["/admin/subscriptions", "Abonnements"],
  ["/admin/notifications", "Notifications"],
  ["/admin/stats", "Statistiques"],
  ["/admin/content", "Contenu"],
  ["/admin/admins", "Administrateurs"],
  ["/admin/audit-logs", "Journal"],
  ["/admin/security", "Sécurité"],
  ["/admin/settings", "Paramètres"],
] as const;

export function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="app admin-app">
      <aside className="side">
        <Link className="logo admin-logo" href="/admin">
          <Image src={logo} alt="XWIN" />
          <span className="admin-tag">Admin</span>
        </Link>
        <nav>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </aside>
      <div className="main">
        <div className="content admin-content">{children}</div>
      </div>
    </div>
  );
}
