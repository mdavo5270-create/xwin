import { sql } from "@/lib/db";
import { ensureSchema } from "@/lib/schema";
export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const rows = await sql()`select name, email, subject, body, created_at from contact_messages order by created_at desc limit 50`;
  return (
    <>
      <h1>Messages contact</h1>
      {rows.length === 0 ? <p className="empty">Boîte vide.</p> : (
        <div className="grid">{rows.map((r, i) => (
          <div className="card" key={i}>
            <strong>{String(r.subject)}</strong>
            <div className="muted">{String(r.name)} · {String(r.email)}</div>
            <p>{String(r.body)}</p>
          </div>
        ))}</div>
      )}
    </>
  );
}
