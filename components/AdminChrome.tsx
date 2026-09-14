import Link from "next/link";

const LINKS = [
  ["/admin", "Vue générale"],
  ["/admin/users", "Utilisateurs"],
  ["/admin/predictions", "Pronostics"],
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
        <Link className="brand admin-brand" href="/admin" aria-label="XWIN admin">
          <img src="/brand/xwin-logo.png" alt="XWIN" height={18} />
          <span>Admin</span>
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
