import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { computePerformance } from "@/lib/performance";
import { sportLabel } from "@/lib/sports";
import { formatDateTime } from "@/lib/format-date";

export const dynamic = "force-dynamic";

function Card({ p, hidePick }: { p: Awaited<ReturnType<typeof listPublishedPronos>>[number]; hidePick?: boolean }) {
  return (
    <Link className="card" href={`/pronostics/${p.id}`}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="badge">{sportLabel(p.sport)}</span>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "✦ Premium" : "Gratuit"}</span>
      </div>
      <p className="muted">{p.competition}</p>
      <h3>{p.eventName}</h3>
      <p className="muted">{p.kickoff || formatDateTime(p.createdAt)}</p>
      <p>{hidePick || p.isPaid ? "Analyse exclusive" : p.pick}</p>
    </Link>
  );
}

export default async function HomePage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const free = all.filter((p) => !p.isPaid);
  const paid = all.filter((p) => p.isPaid);
  const s = computePerformance(all);
  return (
    <PublicChrome member={member}>
      <section className="hero">
        <div>
          <p className="kicker">Analyse · Stratégie · Performance</p>
          <h1>Des analyses. Des pronostics. Une stratégie.</h1>
          <p>XWIN publie uniquement ce que l’équipe a saisi. Football, basket, tennis, esport — sans stats inventées.</p>
          <div className="cta-row">
            <Link className="btn" href="/pronostics">Découvrir les pronostics</Link>
            <Link className="btn ghost" href="/premium">Voir les offres</Link>
          </div>
        </div>
        <aside className="perf">
          <p className="kicker">Performance</p>
          <strong>{s.rate === null ? "—" : `${s.rate}%`}</strong>
          <p className="muted">Réussite sur {s.settled} soldés</p>
          <Link href="/resultats">Historique →</Link>
        </aside>
      </section>
      <main className="wrap">
        <h2>Derniers pronostics</h2>
        {all.length === 0 ? <p className="empty">Aucun pronostic disponible.</p> : (
          <div className="grid two">{all.slice(0, 4).map((p) => <Card key={p.id} p={p} />)}</div>
        )}
        <h2>Pronostics gratuits</h2>
        {free.length === 0 ? <p className="empty">Pas encore de prono gratuit.</p> : (
          <div className="grid two">{free.slice(0, 4).map((p) => <Card key={p.id} p={p} />)}</div>
        )}
        <h2>Pronostics Premium</h2>
        {paid.length === 0 ? <p className="empty">Pas encore de prono premium.</p> : (
          <div className="grid two">{paid.slice(0, 4).map((p) => <Card key={p.id} p={p} hidePick />)}</div>
        )}
        <h2>Pourquoi XWIN</h2>
        <div className="grid three">
          <div className="card"><h3>Pick + pourquoi</h3><p className="muted">Chaque publication a une analyse saisie par l’équipe.</p></div>
          <div className="card"><h3>Historique public</h3><p className="muted">Hits et misses. Rien n’est retiré après coup.</p></div>
          <div className="card"><h3>Gratuit et premium</h3><p className="muted">Le premium se débloque plus tard. Paiement encore off.</p></div>
        </div>
        <h2>À propos de l’expert</h2>
        <section className="card">
          <p>XWIN est une plateforme d’analyse, pas un bookmaker. Le portrait détaillé se renseigne en admin, pas ici.</p>
          <Link href="/a-propos">Lire à propos →</Link>
        </section>
        <h2>Rejoindre XWIN</h2>
        <Link className="btn" href="/inscription">Créer un compte</Link>
      </main>
    </PublicChrome>
  );
}
