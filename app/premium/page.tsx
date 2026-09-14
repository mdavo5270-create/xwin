import { HubShell } from "@/components/HubShell";
import { getMember } from "@/lib/members";
import { listOffers } from "@/lib/offers";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  await ensureSchema();
  const member = await getMember();
  const plans = await listOffers("abonnement", true);
  return (
    <HubShell member={member} tab="/premium">
      <div className="hub-body">
        <h1>Autre</h1>
        {plans.length === 0 ? <p className="empty">Aucun abonnement publié.</p> : plans.map((p) => (
          <article className="hub-row" key={p.id}>
            <span><strong>{p.title}</strong><em>{p.price} {p.currency} · paiement off</em></span>
          </article>
        ))}
      </div>
    </HubShell>
  );
}
