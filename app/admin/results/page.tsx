import { listActionablePronos } from "@/lib/store";
import { settleAction } from "@/app/admin/actions";
export const dynamic = "force-dynamic";
export default async function Page() {
  const rows = (await listActionablePronos()).filter((p) => p.status === "published" && p.result === "pending");
  return (<><h1>Solder les résultats</h1><p className="muted">Hit / miss / void uniquement. Le pronostic publié ne change pas.</p>{rows.length === 0 ? <p className="empty">Aucun prono en attente de résultat.</p> : <div className="grid">{rows.map((p) => <div className="card" key={p.id}><strong>{p.eventName}</strong><div className="muted">{p.pick} · cote {p.odd || "—"} · {p.result}</div><div style={{ display: "flex", gap: ".4rem", marginTop: ".7rem" }}>{(["hit", "miss", "void"] as const).map((r) => <form key={r} action={settleAction}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="result" value={r} /><button className="btn" type="submit">{r}</button></form>)}</div></div>)}</div>}</>);
}
