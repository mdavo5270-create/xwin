import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-full.png";
import { adminHref } from "@/lib/admin-path";

const GROUPS: { title: string; links: [string, string][] }[] = [
  { title: "", links: [["", "Vue générale"]] },
  { title: "Contenu", links: [["predictions", "Pronostics"], ["results", "Résultats"], ["analyses", "Analyses"], ["automation", "Automatisation"]] },
  { title: "Vente", links: [["offers", "Offres"], ["subscriptions", "Abonnements"], ["orders", "Commandes"], ["payments", "Paiements"]] },
  { title: "Site", links: [["content", "Messages"], ["users", "Utilisateurs"], ["stats", "Statistiques"], ["audit-logs", "Journal"]] },
  { title: "Compte", links: [["security", "Sécurité"], ["settings", "Paramètres"], ["admins", "Admin"]] },
];

export function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link className="admin-brand" href={adminHref()}>
          <Image src={logo} alt="XWIN" width={92} height={24} />
          <span>Ops</span>
        </Link>
        <nav>
          {GROUPS.map((g) => (
            <div key={g.title || "home"} className="admin-nav-group">
              {g.title ? <p className="admin-nav-label">{g.title}</p> : null}
              {g.links.map(([path, label]) => (
                <Link key={path || "home"} href={adminHref(path)}>{label}</Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
