import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { PronoCard } from "@/components/PronoCard";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { computePerformance } from "@/lib/performance";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const open = all.filter((p) => p.result === "pending");
  const s = computePerformance(all);
  const featured = open[0] ?? all[0];
  return (
    <PublicChrome member={member}>
      <section className="hero">
        <div>
          <p className="kicker">Bureau d’analyse · Football d’abord</p>
          <h1>{featured ? featured.eventName : "Le prochain ticket sort d’ici."}</h1>
          <p>
            {featured
              ? `${featured.competition} · ${featured.isPaid ? "Ticket premium" : "Ticket public"} · unités affichées, résultat laissé public après coup.`
              : "XWIN ne remplit pas l’accueil avec des stats fictives. Le premier ticket publié devient le hero."}
          </p>
          <div className="cta-row">
            <Link className="btn" href={featured ? `/pronostics/${featured.id}` : "/pronostics"}>
              {featured ? "Ouvrir le ticket" : "Voir le catalogue"}
            </Link>
            <Link className="btn ghost" href="/inscription">Créer un compte</Link>
          </div>
        </div>
        <aside className="perf">
          <p className="kicker">Performance</p>
          <strong>{s.rate === null ? "n.d." : `${s.rate}%`}</strong>
          <p className="muted">
            {s.settled === 0
              ? "Aucun ticket soldé — le taux apparaît au premier résultat."
              : `Réussite sur ${s.settled} soldés`}
          </p>
          <Link href="/resultats">Historique →</Link>
        </aside>
      </section>
      <main className="wrap">
        <h2>Tickets ouverts</h2>
        {open.length === 0 ? (
          <p className="empty">Pas de ticket en cours. Les publications arrivent avant le coup d’envoi, pas en lot décoratif.</p>
        ) : (
          <div className="grid two">{open.slice(0, 4).map((p) => <PronoCard key={p.id} p={p} hidePick={p.isPaid} />)}</div>
        )}
        <h2>Méthode</h2>
        <div className="grid three">
          <div className="card"><h3>Un pick, une raison</h3><p className="muted">Cote, unités, texte d’analyse. Rien d’autre sur la carte.</p></div>
          <div className="card"><h3>Soldé = public</h3><p className="muted">Hit, miss ou void restent visibles. On ne retire pas un raté.</p></div>
          <div className="card"><h3>Football d’abord</h3><p className="muted">Les autres sports n’apparaissent que lorsqu’un ticket existe.</p></div>
        </div>
        <h2>L’équipe</h2>
        <section className="card">
          <p>Cellule d’analyse XWIN. Pas un bookmaker, pas un canal Telegram déguisé.</p>
          <Link href="/a-propos">Méthode et cadre →</Link>
        </section>
      </main>
    </PublicChrome>
  );
}
