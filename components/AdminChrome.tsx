import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-full.png";
import { adminHref } from "@/lib/admin-path";

const LINKS = [
  ["", "Vue générale"],
  ["predictions", "Pronostics"],
  ["offers", "Offres"],
  ["results", "Résultats"],
  ["automation", "Automatisation"],
  ["stats", "Statistiques"],
  ["users", "Utilisateurs"],
  ["settings", "Paramètres"],
] as const;

export function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link className="admin-brand" href={adminHref()}>
          <Image src={logo} alt="XWIN" width={92} height={24} />
          <span>Ops</span>
        </Link>
        <nav>
          {LINKS.map(([path, label]) => (
            <Link key={path || "home"} href={adminHref(path)}>{label}</Link>
          ))}
        </nav>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
