import Link from "next/link";
import type { Member } from "@/lib/types";

export function PublicChrome({ member, children }: { member: Member | null; children: React.ReactNode }) {
  return (
    <div className="site">
      <header className="pub-head">
        <Link className="logo" href="/">
          <img src="/logo-full.png" alt="XWIN" width={120} height={44} />
        </Link>
        <nav className="pub-nav">
          <Link href="/">Accueil</Link>
          <Link href="/pronostics">Pronostics</Link>
          <Link href="/montantes">Montantes</Link>
          <Link href="/analyses">Analyses</Link>
          <Link href="/resultats">Résultats</Link>
          <Link href="/premium">Premium</Link>
          <Link href="/a-propos">À propos</Link>
        </nav>
        <div className="pub-auth">
          {member ? <Link className="btn-sm" href="/app">Espace</Link> : (
            <>
              <Link href="/connexion">Connexion</Link>
              <Link className="btn-sm" href="/inscription">S’inscrire</Link>
            </>
          )}
        </div>
      </header>
      <div className="site-body">{children}</div>
      <nav className="pub-mobile">
        <Link href="/">Accueil</Link>
        <Link href="/pronostics">Pronos</Link>
        <Link href="/resultats">Stats</Link>
        <Link href="/premium">Premium</Link>
        <Link href={member ? "/app" : "/connexion"}>Profil</Link>
      </nav>
      <footer className="pub-foot">
        <span>18+ · Analyse, pas un bookmaker</span>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/a-propos">À propos</Link>
        <Link href="/mentions-legales">Mentions</Link>
        <Link href="/conditions">Conditions</Link>
        <Link href="/confidentialite">Confidentialité</Link>
        <Link href="/politique-remboursement">Remboursement</Link>
        <Link href="/jeu-responsable">Jeu responsable</Link>
      </footer>
    </div>
  );
}
