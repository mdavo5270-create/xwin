import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { computePerformance } from "@/lib/performance";

export const dynamic = "force-dynamic";

export default async function ResultatsPage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const s = computePerformance(all);
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Résultats</h1>
        <p className="muted">Uniquement les pronos publiés puis soldés. Pas de sélection des gagnants.</p>
        <div className="grid two">
          <div className="card">Publiés {s.published}</div>
          <div className="card">Soldés {s.settled}</div>
          <div className="card">Hit {s.hits}</div>
          <div className="card">Miss {s.miss}</div>
          <div className="card">Void {s.voids}</div>
          <div className="card">En attente {s.pending}</div>
          <div className="card">Taux {s.rate === null ? "—" : `${s.rate} %`}</div>
          <div className="card">Cote moy. {s.avgOdd ?? "—"}</div>
        </div>
        {!s.sampleOk ? (
          <p className="empty" style={{ marginTop: "1rem" }}>
            Échantillon trop petit pour parler de rendement ({s.settled} soldés, seuil usuel 30+).
          </p>
        ) : null}
        <h2>Historique</h2>
        {all.length === 0 ? <p className="empty">Pas encore d’historique.</p> : (
          <div className="grid">
            {all.map((p) => (
              <div className="card" key={p.id}>
                <strong>{p.eventName}</strong>
                <div className="muted">{new Date(p.createdAt).toLocaleString("fr-FR")} · {p.pick} · cote {p.odd || "—"} · {p.result}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
