import { getMember } from "@/lib/members";
import { listOrders } from "@/lib/commerce";
import { ensureSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const member = await getMember();
  if (!member) redirect("/connexion");
  const rows = await listOrders(member.id);
  return (
    <>
      <h1>Achats</h1>
      {rows.length === 0 ? <p className="empty">Aucun achat. Paiement pas encore activé.</p> : (
        <div className="grid">{rows.map((r) => (
          <div className="card" key={String(r.id)}>
            <strong>{String(r.amount)} {String(r.currency)}</strong>
            <div className="muted">{String(r.status)}</div>
          </div>
        ))}</div>
      )}
    </>
  );
}
