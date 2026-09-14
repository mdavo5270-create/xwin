import { listActionablePronos } from "@/lib/store";
import { runAutoSettleAction, settleAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = (await listActionablePronos()).filter((p) => p.status === "published" && p.result === "pending");
  return (
    <>
      <h1>Résultats</h1>
      <p className="muted">Le cron et le bouton ci-dessous interrogent TheSportsDB 2 h après le coup d’envoi (1/N/2, totals, BTTS). Le manuel reste un filet de sécurité.</p>
      <form action={runAutoSettleAction} className="admin-actions">
        <button className="btn" type="submit">Solder automatiquement maintenant</button>
      </form>
      {rows.length === 0 ? <p className="empty">Rien en attente.</p> : (
        <div className="admin-tiles">
          {rows.map((p) => (
            <div className="admin-tile" key={p.id}>
              <strong>{p.eventName}</strong>
              <div className="muted">{p.pick} · {p.kickoff || "heure manquante"}</div>
              <div className="admin-actions">
                {(["hit", "miss", "void"] as const).map((r) => (
                  <form key={r} action={settleAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="result" value={r} />
                    <button className="btn ghost" type="submit">{r}</button>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
