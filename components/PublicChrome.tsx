import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/types";
import logo from "@/public/logo-full.png";

export function PublicChrome({ member, children }: { member: Member | null; children: React.ReactNode }) {
  return (
    <div className="site">
      <header className="pub-head">
        <Link className="logo" href="/accueil">
          <Image src={logo} alt="XWIN" priority />
        </Link>
        <nav className="pub-nav">
          <Link href="/accueil">Accueil</Link>
          <Link href="/montantes">Programmes</Link>
          <Link href="/pronostics">Match</Link>
          <Link href="/resultats">Historique</Link>
          <Link href="/premium">Tarifs</Link>
          <Link href="/service">Service</Link>
        </nav>
        <div className="pub-auth">
          {member ? <Link className="btn-sm" href="/accueil">Espace</Link> : (
            <>
              <Link href="/connexion">Connexion</Link>
              <Link className="btn-sm" href="/connexion?tab=inscription">S’inscrire</Link>
            </>
          )}
        </div>
      </header>
      <div className="site-body">{children}</div>
      <nav className="pub-mobile">
        <Link href="/accueil">Accueil</Link>
        <Link href="/montantes">Programmes</Link>
        <Link href="/pronostics">Match</Link>
        <Link href="/resultats">Historique</Link>
        <Link href="/service">Service</Link>
        <Link href={member ? "/accueil" : "/connexion"}>Moi</Link>
      </nav>
      <footer className="pub-foot">
        <div className="foot-top">
          <div className="foot-brand">
            <Link className="logo" href="/accueil"><Image src={logo} alt="XWIN" /></Link>
            <p>Bureau d’analyse sportive. Chaque pronostic publié reste public, résultat compris.</p>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h4>Plateforme</h4>
              <Link href="/pronostics">Pronostics</Link>
              <Link href="/montantes">Montantes</Link>
              <Link href="/premium">Premium</Link>
              <Link href="/service">Service</Link>
              <Link href="/resultats">Résultats</Link>
            </div>
            <div className="foot-col">
              <h4>Compte</h4>
              {member ? <Link href="/accueil">Mon espace</Link> : (
                <>
                  <Link href="/connexion">Connexion</Link>
                  <Link href="/connexion?tab=inscription">S’inscrire</Link>
                </>
              )}
              <Link href="/contact">Contact</Link>
            </div>
            <div className="foot-col">
              <h4>À propos</h4>
              <Link href="/a-propos">Qui on est</Link>
              <Link href="/jeu-responsable">Jeu responsable</Link>
            </div>
            <div className="foot-col">
              <h4>Légal</h4>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/conditions">Conditions</Link>
              <Link href="/confidentialite">Confidentialité</Link>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} XWIN</span>
          <span>18+ · Analyse sportive, pas un bookmaker</span>
        </div>
      </footer>
    </div>
  );
}
