import { HubShell } from "@/components/HubShell";
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
  const rows = [
    ...fromOffers.map((m) => ({ id: m.id, title: m.title, meta: `${m.price} ${m.currency}` })),
    ...legacy.map((m) => ({ id: m.id, title: m.title, meta: `${m.steps} paliers · ${m.entryAmount} ${m.currency}` })),
  ];
  return (
    <HubShell member={member} tab="/montantes">
      <div className="hub-body">
        <h1>Montante</h1>
        {rows.length === 0 ? <p className="empty">Aucune montante ouverte.</p> : rows.map((m) => (
          <article className="hub-row" key={m.id}>
            <span><strong>{m.title}</strong><em>{m.meta}</em></span>
          </article>
        ))}
        <p className="muted">Paiement pas encore activé.</p>
      </div>
    </HubShell>
  );
}
