import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listOffers } from "@/lib/offers";
import { listOpenMontantes } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function MontantesPage() {
  await ensureSchema();
  const member = await getMember();
  const fromOffers = await listOffers("montante", true);
  const legacy = await listOpenMontantes();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Montantes</h1>
        <p className="muted">Des paliers à cadence fixe. L’entrée est affichée. Le paiement n’est pas encore ouvert.</p>
        {fromOffers.length === 0 && legacy.length === 0 ? (
          <p className="empty">Aucune montante ouverte. Crée-en une dans Admin → Offres, type Montante.</p>
        ) : (
          <div className="grid two">
            {fromOffers.map((m) => (
              <article className="card" key={m.id}>
                <strong>{m.title}</strong>
                <div className="muted">{m.steps ? `${m.steps} paliers · ` : ""}{m.price} {m.currency}</div>
                <p className="muted">{m.description}</p>
                <button className="btn" type="button" disabled>Paiement pas encore activé</button>
              </article>
            ))}
            {legacy.map((m) => (
              <Link className="card" key={m.id} href={`/montantes/${m.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                <strong>{m.title}</strong>
                <div className="muted">{m.steps} paliers · {m.entryAmount} {m.currency}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
