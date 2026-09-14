import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-full.png";
import { adminHref } from "@/lib/admin-path";

const LINKS = [
  // Main
  ["", "📊 Vue générale"],
  
  // Content Management
  ["predictions", "🎯 Pronostics"],
  ["offers", "💰 Offres"],
  ["subscriptions", "📋 Abonnements"],
  ["results", "✓ Résultats"],
  
  // Analytics
  ["analyses", "📈 Analyses"],
  ["stats", "📉 Statistiques"],
  
  // Setup
  ["sports", "⚽ Sports"],
  ["competitions", "🏆 Compétitions"],
  ["content", "📝 Contenu"],
  ["automation", "⚙️ Automatisation"],
  
  // Operations
  ["users", "👥 Utilisateurs"],
  ["orders", "📦 Commandes"],
  ["payments", "💳 Paiements"],
  
  // Admin
  ["admins", "👨‍💼 Administrateurs"],
  ["profile", "👤 Mon Profil"],
  ["audit-logs", "📋 Journal"],
  ["security", "🔒 Sécurité"],
  ["settings", "⚙️ Paramètres"],
] as const;

export function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="app admin-app">
      <aside className="side">
        <Link className="logo admin-logo" href={adminHref()}>
          <Image src={logo} alt="XWIN" />
          <span className="admin-tag">Ops</span>
        </Link>
        <nav>
          {LINKS.map(([path, label]) => (
            <Link key={path || "home"} href={adminHref(path)}>{label}</Link>
          ))}
        </nav>
      </aside>
      <div className="main">
        <div className="content admin-content">{children}</div>
      </div>
    </div>
  );
}
