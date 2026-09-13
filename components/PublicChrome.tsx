import Link from "next/link";
import type { Member } from "@/lib/types";

export function PublicChrome({
  member,
  children,
}: {
  member: Member | null;
  children: React.ReactNode;
}) {
  return (
    <div className="site">
      <header className="pub-head">
        <Link className="logo" href="/">XWIN</Link>
        <nav className="pub-nav">
          <Link href="/">Accueil</Link>
          <Link href="/pronostics">Pronostics</Link>
          <Link href="/analyses">Analyses</Link>
          <Link href="/resultats">Résultats</Link>
          <Link href="/premium">Premium</Link>
          <Link href="/a-propos">À propos</Link>
        </nav>
        <div className="pub-auth">
          {member ? (
            <Link className="btn-sm" href="/app">Espace</Link>
          ) : (
            <>
              <Link href="/connexion">Connexion</Link>
              <Link className="btn-sm" href="/inscription">S’inscrire</Link>
            </>
          )}
        </div>
      </header>
      <div className="site-body">{children}</div>
      <footer className="pub-foot">
        <div>
          <strong>XWIN</strong>
          <p>Analyses. Pronostics. Stratégie. Pas un bookmaker.</p>
        </div>
        <div className="pub-foot-links">
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/mentions-legales">Mentions</Link>
          <Link href="/conditions">Conditions</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/jeu-responsable">18+ jeu responsable</Link>
        </div>
      </footer>
    </div>
  );
}
