import { getMember } from "@/lib/members";
import { listNotifications } from "@/lib/commerce";
import { ensureSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const member = await getMember();
  if (!member) redirect("/connexion");
  const rows = await listNotifications(member.id);
  return (
    <>
      <h1>Notifications</h1>
      {rows.length === 0 ? <p className="empty">Pas de notification.</p> : (
        <div className="grid">{rows.map((r) => (
          <div className="card" key={String(r.id)}>
            <strong>{String(r.title)}</strong>
            <p className="muted">{String(r.body)}</p>
          </div>
        ))}</div>
      )}
    </>
  );
}
