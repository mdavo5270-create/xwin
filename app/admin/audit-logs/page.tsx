import { sql } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";
export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const rows = await sql()`select actor, action, resource, created_at from audit_logs order by created_at desc limit 100`;
  return (
    <>
      <h1>Journal</h1>
      {rows.length === 0 ? <p className="empty">Aucune action journalisée.</p> : (
        <div className="grid">{rows.map((r, i) => (
          <div className="card" key={i}>
            <strong>{String(r.action)}</strong>
            <div className="muted">{String(r.actor)} · {String(r.resource)} · {String(r.created_at)}</div>
          </div>
        ))}</div>
      )}
    </>
  );
}
