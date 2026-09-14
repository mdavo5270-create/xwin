import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listOffers } from "@/lib/offers";
import { ensureSchema } from "@/lib/schema";
import "../browse.css";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  await ensureSchema();
  const member = await getMember();
  const plans = await listOffers("abonnement", true);
  return (
    <PublicChrome member={member}>
      <section className="billboard">
        <p className="kicker">Club</p>
        <h1>Abonnements. Paiement encore fermé.</h1>
        <p className="meta">Les prix viennent de la base. L’encaissement reste coupé.</p>
      </section>
      <main className="wrap">
        {plans.length === 0 ? <p className="empty">Aucun abonnement publié.</p> : (
          <div className="grid two">
            {plans.map((p) => (
              <section className="card" key={p.id}>
                <h3>{p.title}</h3>
                <p className="vs"><span>{p.price} {p.currency}</span><span>{p.period}</span></p>
                <p className="muted">{p.description}</p>
                <button className="btn" type="button" disabled>Paiement pas encore activé</button>
              </section>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
