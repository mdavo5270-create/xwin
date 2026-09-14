import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { FixtureRow } from "@/components/FixtureRow";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { computePerformance } from "@/lib/performance";
import { formatDateTime } from "@/lib/format-date";
import "./browse.css";

export const dynamic = "force-dynamic";

const PROGRAMMES = [
  {
    href: "/pronostics",
    title: "Pronostics",
    text: "Le programme gratuit du jour, match par match, avec l’analyse derrière chaque pick.",
  },
  {
    href: "/montantes",
    title: "Montantes",
    text: "Des paliers enchaînés sur plusieurs semaines, à cadence fixe et mise annoncée à l’avance.",
  },
  {
    href: "/premium",
    title: "Premium",
    text: "Le programme complet du club : tickets, notes de confiance et montantes du mois.",
  },
] as const;

export default async function HomePage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const open = all.filter((p) => p.result === "pending");
  const settled = all.filter((p) => p.result === "hit" || p.result === "miss");
  const recent = settled.slice(0, 6);
  const s = computePerformance(all);

  return (
    <PublicChrome member={member}>
      <section className="hero">
        <div>
          <p className="kicker">XWIN</p>
          <h1>L’analyse avant le pari.</h1>
          <p>
            Chaque pronostic publié reste public, résultat compris. Pas de sélection des tickets gagnants,
            pas de cote inventée après coup.
          </p>
          <div className="cta-row">
            {member ? (
              <Link className="btn" href="/app">Accéder à mon espace</Link>
            ) : (
              <>
                <Link className="btn" href="/inscription">Rejoindre</Link>
                <Link className="btn ghost" href="/connexion">Entrer</Link>
              </>
            )}
          </div>
        </div>
        <div className="perf">
          <span className="muted">Taux de réussite</span>
          <strong>{s.rate === null ? "—" : `${s.rate}%`}</strong>
          {s.sampleOk ? (
            <span className="muted">sur {s.settled} tickets soldés</span>
          ) : (
            <span className="muted">{s.settled} soldés · échantillon encore réduit</span>
          )}
          <p><Link href="/resultats">Voir tout l’historique →</Link></p>
        </div>
      </section>

      <main className="wrap programme">
        <h2>Programme du jour</h2>
        <p className="muted">Sport, ligue, heure. Le pronostic s’ouvre après ton vote.</p>
        {open.length === 0 ? (
          <p className="empty">Aucun match publié pour le moment.</p>
        ) : (
          <div className="fix-list">{open.map((p) => <FixtureRow key={p.id} p={p} />)}</div>
        )}

        <h2>Nos programmes</h2>
        <div className="grid three">
          {PROGRAMMES.map((prog) => (
            <Link className="card" key={prog.href} href={prog.href}>
              <h3>{prog.title}</h3>
              <p className="muted">{prog.text}</p>
            </Link>
          ))}
        </div>

        <h2>Historique de nos derniers pronos</h2>
        {recent.length === 0 ? (
          <p className="empty">Pas encore de ticket soldé — ça viendra avec les premiers résultats.</p>
        ) : (
          <div className="grid two">
            {recent.map((p) => (
              <Link className="card" key={p.id} href={`/pronostics/${p.id}`}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: ".6rem" }}>
                  <span className="muted">{formatDateTime(p.createdAt)}</span>
                  <span className={`badge ${p.result === "hit" ? "win" : "loss"}`}>
                    {p.result === "hit" ? "Gagné" : "Perdu"}
                  </span>
                </div>
                <h3>{p.eventName}</h3>
                <p className="muted">{p.pick} · cote {p.odd || "—"}</p>
              </Link>
            ))}
          </div>
        )}

        <h2>Résultats obtenus</h2>
        <div className="grid three">
          <div className="card"><span className="muted">Publiés</span><strong className="stat-num">{s.published}</strong></div>
          <div className="card"><span className="muted">Soldés</span><strong className="stat-num">{s.settled}</strong></div>
          <div className="card"><span className="muted">Taux de réussite</span><strong className="stat-num">{s.rate === null ? "—" : `${s.rate}%`}</strong></div>
        </div>
        {!s.sampleOk ? (
          <p className="empty" style={{ marginTop: "1rem" }}>
            Échantillon trop petit pour parler de rendement ({s.settled} soldés, seuil usuel 30+).
          </p>
        ) : null}
        <p className="muted"><Link href="/resultats">Historique complet et détail des cotes →</Link></p>
      </main>
    </PublicChrome>
  );
}
