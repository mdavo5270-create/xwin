import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { computePerformance } from "@/lib/performance";
import { sportLabel } from "@/lib/sports";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const s = computePerformance(all);
  return (
    <PublicChrome member={member}>
      <section className="hero">
        <div>
          <p className="kicker">Analyse · Stratégie · Performance</p>
          <h1>Des décisions plus éclairées grâce à une analyse structurée.</h1>
          <p>XWIN publie uniquement ce que l’équipe a saisi. Les chiffres viennent des pronos soldés, pas d’un décor.</p>
          <div className="cta-row">
            <Link className="btn" href="/pronostics">Voir les pronostics</Link>
            <Link className="btn ghost" href="/premium">Découvrir Premium</Link>
          </div>
        </div>
        <aside className="perf">
          <p className="kicker">Performance</p>
          <strong>{s.rate === null ? "—" : `${s.rate}%`}</strong>
          <p className="muted">Réussite sur {s.settled} soldés{s.sampleOk ? "" : " · échantillon encore faible"}</p>
          <Link href="/resultats">Historique →</Link>
        </aside>
      </section>
      <main className="wrap">
        <h2>Derniers pronostics</h2>
        {all.length === 0 ? <p className="empty">Aucun pronostic disponible.</p> : (
          <div className="grid two">
            {all.slice(0, 6).map((p) => (
              <Link key={p.id} className="card" href={`/pronostics/${p.id}`}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="badge">{sportLabel(p.sport)}</span>
                  <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "✦ Premium" : "Gratuit"}</span>
                </div>
                <p className="muted">{p.competition}</p>
                <h3>{p.eventName}</h3>
                <p className="muted">{p.kickoff || new Date(p.createdAt).toLocaleString("fr-FR")}</p>
                <p>{p.isPaid ? "Analyse exclusive" : p.pick}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
