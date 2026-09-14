import { HubShell } from "@/components/HubShell";
import { getMember } from "@/lib/members";
import { listOffers } from "@/lib/offers";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function ServicePage() {
  await ensureSchema();
  const member = await getMember();
  const rows = await listOffers("service", true);
  return (
    <HubShell member={member} tab="/service">
      <div className="hub-body">
        <h1>Stratégie</h1>
        {rows.length === 0 ? <p className="empty">Aucune méthode publiée.</p> : rows.map((s) => (
          <article className="hub-row" key={s.id}>
            <span><strong>{s.title}</strong><em>{s.price} {s.currency} · paiement off</em></span>
          </article>
        ))}
      </div>
    </HubShell>
  );
}
