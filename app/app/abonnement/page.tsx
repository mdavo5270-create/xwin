import { getMember } from "@/lib/members";
import { listSubscriptions } from "@/lib/commerce";
import { ensureSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const member = await getMember();
  if (!member) redirect("/connexion");
  const rows = await listSubscriptions(member.id);
  const active = rows.find((r) => String(r.status) === "active");
  return (
    <>
      <h1>Abonnement</h1>
      <p>Plan actuel : {active ? String(active.offer_id) : "aucun"}</p>
      <p className="muted">Lu dans la table subscriptions. Paiement pas encore activé.</p>
    </>
  );
}
