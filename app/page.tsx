import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const free = all.filter((p) => !p.isPaid).slice(0, 4);
  const paid = all.filter((p) => p.isPaid).slice(0, 4);
  return (
    <PublicChrome member={member}>
      <section className="hero">
        <h1>Des analyses. Des pronostics. Une stratégie.</h1>
        <p>XWIN publie uniquement ce que l’équipe a réellement saisi. Pas de fiches fictives.</p>
        <div className="cta-row">
          <Link className="btn-sm" href="/pronostics">Découvrir les pronostics</Link>
          <Link className="btn-sm" href="/premium">Voir les offres</Link>
        </div>
      </section>
      <main className="wrap">
        <h2>Derniers pronostics</h2>
        {all.length === 0 ? <p className="empty">Aucun prono publié pour l’instant.</p> : (
          <div className="grid two">
            {all.slice(0, 6).map((p) => (
              <Link key={p.id} className="card" href={`/pronostics/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
                <div className="muted">{p.competition}</div>
                <strong>{p.eventName}</strong>
              </Link>
            ))}
          </div>
        )}
        <h2>Pronostics gratuits</h2>
        {free.length === 0 ? <p className="empty">Pas encore de prono gratuit.</p> : (
          <div className="grid two">{free.map((p) => (
            <Link key={p.id} className="card" href={`/pronostics/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <strong>{p.eventName}</strong><div>{p.pick}</div>
            </Link>
          ))}</div>
        )}
        <h2>Pronostics premium</h2>
        {paid.length === 0 ? <p className="empty">Pas encore de prono premium.</p> : (
          <div className="grid two">{paid.map((p) => (
            <Link key={p.id} className="card" href={`/pronostics/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <strong>{p.eventName}</strong><div className="muted">Analyse verrouillée</div>
            </Link>
          ))}</div>
        )}
        <h2>Performances</h2>
        <p className="empty">Les stats n’apparaissent que lorsqu’un prono est soldé en admin. Rien n’est inventé.</p>
        <h2>Pourquoi XWIN</h2>
        <div className="grid three">
          <div className="card">Match + pick + pourquoi, saisis par l’équipe.</div>
          <div className="card">Gratuit et premium séparés. Paiement encore coupé.</div>
          <div className="card">Historique public uniquement à partir des résultats réels.</div>
        </div>
        <h2>Rejoindre XWIN</h2>
        <Link className="btn" href="/inscription">Créer un compte</Link>
      </main>
    </PublicChrome>
  );
}
