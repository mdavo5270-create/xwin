import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listOffers } from "@/lib/offers";
import { ensureSchema } from "@/lib/schema";
import "../browse.css";

export const dynamic = "force-dynamic";

export default async function ServicePage() {
  await ensureSchema();
  const member = await getMember();
  const rows = await listOffers("service", true);
  return (
    <PublicChrome member={member}>
      <section className="billboard">
        <p className="kicker">Service</p>
        <h1>Stratégies, expliquées avant d’être vendues.</h1>
        <p className="meta">Prix en base. Encaissement coupé.</p>
      </section>
      <main className="wrap">
        {rows.length === 0 ? <p className="empty">Aucun service publié.</p> : (
          <div className="grid two">
            {rows.map((s) => (
              <section className="card" key={s.id}>
                <h3>{s.title}</h3>
                <p className="vs"><span>{s.price} {s.currency}</span><span>{s.period}</span></p>
                <p className="muted">{s.description}</p>
                <button className="btn" type="button" disabled>Paiement pas encore activé</button>
              </section>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
