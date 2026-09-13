import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/types";
import logo from "@/public/logo-full.png";

export function PublicChrome({ member, children }: { member: Member | null; children: React.ReactNode }) {
  return (
    <div className="site">
      <header className="pub-head">
        <Link className="logo" href="/">
          <Image src={logo} alt="XWIN" priority />
        </Link>
        <nav className="pub-nav">
          <Link href="/pronostics">Pronos</Link>
          <Link href="/resultats">Live book</Link>
          <Link href="/montantes">Montantes</Link>
          <Link href="/analyses">Notes</Link>
          <Link href="/premium">Club</Link>
        </nav>
        <div className="pub-auth">
          {member ? <Link className="btn-sm" href="/app">Espace</Link> : (
            <>
              <Link href="/connexion">Entrer</Link>
              <Link className="btn-sm" href="/inscription">Rejoindre</Link>
            </>
          )}
        </div>
      </header>
      <div className="site-body">{children}</div>
      <nav className="pub-mobile">
        <Link href="/">Home</Link>
        <Link href="/pronostics">Pronos</Link>
        <Link href="/resultats">Book</Link>
        <Link href="/premium">Club</Link>
        <Link href={member ? "/app" : "/connexion"}>Moi</Link>
      </nav>
      <footer className="pub-foot">
        <span>18+ · Analyse, pas un bookmaker</span>
        <Link href="/a-propos">À propos</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/mentions-legales">Mentions</Link>
        <Link href="/conditions">Conditions</Link>
        <Link href="/confidentialite">Confidentialité</Link>
        <Link href="/jeu-responsable">Jeu responsable</Link>
      </footer>
    </div>
  );
}
