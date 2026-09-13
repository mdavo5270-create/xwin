import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

export default async function PremiumPage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <main className="wrap" style={{ textAlign: "center" }}>
        <p className="kicker">XWIN Premium</p>
        <h1>Passez à l’expérience complète.</h1>
        <p className="muted">Prix à figer avant encaissement. Boutons désactivés.</p>
        <div className="grid two" style={{ textAlign: "left", marginTop: "1.4rem" }}>
          <section className="card">
            <h3>Essentiel</h3>
            <p className="muted">/ semaine · FCFA</p>
            <p>Pronos premium 7 jours</p>
            <p>Historique</p>
            <button className="btn off" type="button" disabled>Choisir</button>
          </section>
          <section className="card" style={{ borderColor: "rgba(61,255,138,.35)" }}>
            <span className="badge pay">Recommandé</span>
            <h3>Pro</h3>
            <p className="muted">/ mois · FCFA</p>
            <p>Pronos + analyses</p>
            <p>Montantes du mois</p>
            <button className="btn off" type="button" disabled>Choisir</button>
          </section>
        </div>
        <p style={{ marginTop: "1.2rem" }}><Link href="/resultats">Voir d’abord les résultats publics</Link></p>
      </main>
    </PublicChrome>
  );
}
