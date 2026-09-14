import { listSubscriptions } from "@/lib/commerce";
import { ensureSchema } from "@/lib/schema";
export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const rows = await listSubscriptions();
  return (
    <>
      <h1>Abonnements</h1>
      {rows.length === 0 ? <p className="empty">Aucun abonnement — paiement pas encore activé.</p> : (
        <div className="admin-tiles">{rows.map((r) => (
          <div className="admin-tile" key={String(r.id)}>
            <strong>{String(r.status)}</strong>
            <div className="muted">user {String(r.user_id)} · offre {String(r.offer_id)}</div>
          </div>
        ))}</div>
      )}
    </>
  );
}
