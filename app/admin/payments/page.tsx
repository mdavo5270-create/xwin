import { listPayments } from "@/lib/commerce";
import { ensureSchema } from "@/lib/schema";
export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const rows = await listPayments();
  return (
    <>
      <h1>Paiements</h1>
      <p className="muted">Trace réelle. Vide tant que l’encaissement n’est pas branché.</p>
      {rows.length === 0 ? <p className="empty">Aucun paiement.</p> : (
        <div className="admin-tiles">{rows.map((r) => (
          <div className="admin-tile" key={String(r.id)}>
            <strong>{String(r.amount)}</strong>
            <div className="muted">{String(r.provider)} · {String(r.status)}</div>
          </div>
        ))}</div>
      )}
    </>
  );
}
