import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function ResultatsPage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const settled = all.filter((p) => p.status === "settled");
  const hits = settled.filter((p) => p.result === "hit").length;
  const miss = settled.filter((p) => p.result === "miss").length;
  const pending = all.filter((p) => p.result === "pending").length;
  const rate = settled.length ? Math.round((hits / settled.length) * 100) : null;
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Résultats / performances</h1>
        <div className="grid two">
          <div className="card">Total publiés : {all.length}</div>
          <div className="card">Gagnés : {hits}</div>
          <div className="card">Perdus : {miss}</div>
          <div className="card">En attente : {pending}</div>
          <div className="card">Taux : {rate === null ? "— tant qu’aucun prono n’est soldé" : `${rate} %`}</div>
        </div>
        {all.length === 0 ? <p className="empty">Pas encore d’historique.</p> : (
          <div className="grid" style={{ marginTop: "1rem" }}>
            {all.map((p) => (
              <div className="card" key={p.id}>
                <strong>{p.eventName}</strong>
                <div className="muted">{p.pick} · {p.result} · {p.status}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
