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
        <h1>Des méthodes de jeu, pas un ticket isolé.</h1>
        <p className="meta">Martingale, lecture d’image, séries encadrées. Les prix sont là. Le paiement n’est pas encore ouvert.</p>
      </section>
      <main className="wrap">
        {rows.length === 0 ? (
          <p className="empty">Aucune méthode publiée pour l’instant. Elles apparaîtront ici dès qu’une offre « service » est activée dans l’admin.</p>
        ) : (
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
