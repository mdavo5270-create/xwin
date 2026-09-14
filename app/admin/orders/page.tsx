import { listOrders } from "@/lib/commerce";
import { ensureSchema } from "@/lib/schema";
export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const rows = await listOrders();
  return (
    <>
      <h1>Commandes</h1>
      {rows.length === 0 ? <p className="empty">Aucune commande.</p> : (
        <div className="admin-tiles">{rows.map((r) => (
          <div className="admin-tile" key={String(r.id)}>
            <strong>{String(r.amount)} {String(r.currency)}</strong>
            <div className="muted">{String(r.status)}</div>
          </div>
        ))}</div>
      )}
    </>
  );
}
