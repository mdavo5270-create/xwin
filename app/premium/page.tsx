import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

export default async function PremiumPage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <section className="billboard">
        <p className="kicker">Club</p>
        <h1>Deux portes. Paiement encore fermé.</h1>
        <p className="meta">Les prix sont affichés. L’encaissement reste coupé.</p>
      </section>
      <main className="wrap">
        <div className="grid two">
          <section className="card">
            <h3>Essentiel</h3>
            <p className="vs"><span>4 900 F</span><span>/ sem.</span></p>
            <p className="muted">Tickets club 7 jours + historique public.</p>
            <Link className="btn ghost" href="/inscription">Me prévenir</Link>
          </section>
          <section className="card" style={{ boxShadow: "inset 0 0 0 1px rgba(200,245,66,.35)" }}>
            <span className="badge pay">Choix</span>
            <h3>Pro</h3>
            <p className="vs"><span>14 900 F</span><span>/ mois</span></p>
            <p className="muted">Tickets, notes, montantes du mois.</p>
            <Link className="btn ghost" href="/inscription">Me prévenir</Link>
          </section>
        </div>
      </main>
    </PublicChrome>
  );
}
