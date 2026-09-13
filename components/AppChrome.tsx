import Link from "next/link";
import { logoutMember } from "@/lib/members";
import { redirect } from "next/navigation";
import type { Member } from "@/lib/types";

async function logoutAction() {
  "use server";
  await logoutMember();
  redirect("/connexion");
}

export function AppChrome({ member, children }: { member: Member; children: React.ReactNode }) {
  return (
    <div className="app">
      <aside className="side">
        <Link className="logo" href="/app">
          <img src="/logo-full.png" alt="XWIN" width={120} height={44} />
        </Link>
        <nav>
          <Link href="/app">Tableau de bord</Link>
          <Link href="/app/pronostics">Pronostics</Link>
          <Link href="/app/favoris">Favoris</Link>
          <Link href="/app/achats">Achats</Link>
          <Link href="/app/abonnement">Abonnement</Link>
          <Link href="/app/notifications">Notifications</Link>
          <Link href="/app/profil">Profil</Link>
          <Link href="/app/securite">Sécurité</Link>
          <Link href="/app/parametres">Paramètres</Link>
          <Link href="/">Site public</Link>
        </nav>
        <form action={logoutAction}><button type="submit">Déconnexion</button></form>
      </aside>
      <div className="main">
        <header className="head">
          <strong>{member.name}</strong>
          <span className="muted">{member.email}</span>
        </header>
        <div className="content">{children}</div>
        <nav className="mobile-nav">
          <Link href="/app">Home</Link>
          <Link href="/app/pronostics">Pronos</Link>
          <Link href="/app/abonnement">Premium</Link>
          <Link href="/app/profil">Profil</Link>
        </nav>
      </div>
    </div>
  );
}
