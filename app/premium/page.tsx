import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

export default async function PremiumPage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <main className="wrap" style={{ textAlign: "center" }}>
        <p className="kicker">XWIN Premium</p>
        <h1>Deux formules. Encaissement encore coupé.</h1>
        <p className="muted">Prix affichés pour que l’offre soit lisible. Le bouton reste inactif tant que le paiement n’est pas branché.</p>
        <div className="grid two" style={{ textAlign: "left", marginTop: "1.4rem" }}>
          <section className="card">
            <h3>Essentiel</h3>
            <p className="vs"><span>4 900 F CFA</span><span>/ semaine</span></p>
            <p>Tickets premium 7 jours</p>
            <p>Historique public inclus</p>
            <p className="muted">Liste d’attente — paiement off</p>
            <Link className="btn ghost" href="/inscription">Prévenir à l’ouverture</Link>
          </section>
          <section className="card" style={{ borderColor: "rgba(62,186,75,.4)" }}>
            <span className="badge pay">Recommandé</span>
            <h3>Pro</h3>
            <p className="vs"><span>14 900 F CFA</span><span>/ mois</span></p>
            <p>Tickets + analyses</p>
            <p>Montantes du mois</p>
            <p className="muted">Liste d’attente — paiement off</p>
            <Link className="btn ghost" href="/inscription">Prévenir à l’ouverture</Link>
          </section>
        </div>
        <p style={{ marginTop: "1.2rem" }}><Link href="/resultats">Lire d’abord l’historique public</Link></p>
      </main>
    </PublicChrome>
  );
}
