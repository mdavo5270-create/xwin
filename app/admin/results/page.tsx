import { listAllPronos } from "@/lib/store";
import { settleAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await listAllPronos();
  return (
    <>
      <h1>Solder les résultats</h1>
      <p className="muted">Hit / miss / void uniquement. Le pronostic publié ne change pas.</p>
      {rows.length === 0 ? <p className="empty">Aucun prono.</p> : (
        <div className="grid">
          {rows.map((p) => (
            <div className="card" key={p.id}>
              <strong>{p.eventName}</strong>
              <div className="muted">{p.pick} · cote {p.odd || "—"} · {p.result}</div>
              {p.result === "pending" ? (
                <div style={{ display: "flex", gap: ".4rem", marginTop: ".7rem" }}>
                  {(["hit", "miss", "void"] as const).map((r) => (
                    <form key={r} action={settleAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="result" value={r} />
                      <button className="btn" type="submit">{r}</button>
                    </form>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
