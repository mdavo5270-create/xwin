import { listAdminSessions } from "@/lib/commerce";
import { ensureSchema } from "@/lib/schema";
import { formatDateTime } from "@/lib/format-date";
export const dynamic = "force-dynamic";
export default async function Page() {
  await ensureSchema();
  const rows = await listAdminSessions();
  return (
    <>
      <h1>Sécurité</h1>
      <p className="muted">Un seul rôle admin (ADMIN_SECRET). Historique des tentatives de connexion.</p>
      {rows.length === 0 ? <p className="empty">Aucune connexion enregistrée pour l’instant.</p> : (
        <div className="grid">{rows.map((r) => (
          <div className="card" key={String(r.id)}>
            <strong>{r.ok ? "OK" : "Échec"}</strong>
            <div className="muted">{formatDateTime(String(r.created_at))} · {String(r.note)}</div>
          </div>
        ))}</div>
      )}
    </>
  );
}
