import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { PronoCard } from "@/components/PronoCard";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { computePerformance } from "@/lib/performance";
import "../browse.css";

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
      <section className="billboard">
        <p className="kicker">Bureau XWIN</p>
        <h1>{featured ? featured.eventName : "Le book s’ouvre ici."}</h1>
        <p className="meta">
          {featured
            ? `${featured.competition} · ${featured.isPaid ? "Club" : "Public"}`
            : "Tickets publiés par l’équipe. Rien n’est inventé pour remplir l’écran."}
        </p>
        <div className="cta-row">
          <Link className="btn" href={featured ? `/pronostics/${featured.id}` : "/pronostics"}>
            {featured ? "Lire le ticket" : "Ouvrir le book"}
          </Link>
          <Link className="btn ghost" href="/inscription">Rejoindre le club</Link>
        </div>
      </section>
      <main className="wrap">
        <aside className="perf" style={{ marginBottom: "1.6rem" }}>
          <p className="kicker">Book</p>
          <strong>{s.rate === null ? "—" : `${s.rate}%`}</strong>
          <p className="muted">
            {s.settled === 0 ? "Taux au premier ticket soldé." : `Réussite sur ${s.settled} soldés`}
          </p>
          <Link href="/resultats">Ouvrir l’historique</Link>
        </aside>
        <h2>En piste</h2>
        {open.length === 0 ? (
          <p className="empty">Aucun ticket ouvert.</p>
        ) : (
          <div className="grid two">{open.slice(0, 4).map((p) => <PronoCard key={p.id} p={p} hidePick={p.isPaid} />)}</div>
        )}
        <h2>Le cadre</h2>
        <div className="grid three">
          <div className="card"><h3>Pick net</h3><p className="muted">Cote, unités, texte. Une carte, un avis.</p></div>
          <div className="card"><h3>Book public</h3><p className="muted">Hit et miss restent. On n’efface pas.</p></div>
          <div className="card"><h3>Club ensuite</h3><p className="muted">Le paiement reste coupé. Les prix sont déjà affichés.</p></div>
        </div>
      </main>
    </PublicChrome>
  );
}
