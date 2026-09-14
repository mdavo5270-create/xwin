import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { getPerformanceSummary, listPublishedPronosPage } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { formatDateTime } from "@/lib/format-date";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function ResultatsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await ensureSchema();
  const member = await getMember();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [s, { rows, total }] = await Promise.all([
    getPerformanceSummary(),
    listPublishedPronosPage({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
        <p className="muted">{total} pronos au total · page {page} sur {pageCount}</p>
        {rows.length === 0 ? <p className="empty">Pas encore d’historique.</p> : (
          <div className="grid">
            {rows.map((p) => (
              <div className="card" key={p.id}>
                <strong>{p.eventName}</strong>
                <div className="muted">{formatDateTime(p.createdAt)} · {p.pick} · cote {p.odd || "—"} · {p.result}</div>
              </div>
            ))}
          </div>
        )}
        {pageCount > 1 ? (
          <div className="cta-row" style={{ marginTop: "1.2rem" }}>
            {page > 1 ? <Link className="btn ghost" href={`/resultats?page=${page - 1}`}>← Précédent</Link> : null}
            {page < pageCount ? <Link className="btn ghost" href={`/resultats?page=${page + 1}`}>Suivant →</Link> : null}
          </div>
        ) : null}
      </main>
    </PublicChrome>
  );
}
