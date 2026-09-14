import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { SportTiles } from "@/components/SportTiles";
import { MatchCard } from "@/components/MatchCard";
import { getMember } from "@/lib/members";
import { getPerformanceSummary, listPublishedPronos } from "@/lib/store";
import { groupMatches, countOpenMatchesBySport } from "@/lib/matches";
import { ensureSchema } from "@/lib/schema";
import "./browse.css";

export const dynamic = "force-dynamic";

const PROGRAMMES = [
  { href: "/pronostics", title: "Pronostics", text: "Le programme du jour, match par match." },
  { href: "/montantes", title: "Montantes", text: "Des paliers à cadence fixe." },
  { href: "/premium", title: "Premium", text: "Le programme complet du club." },
  { href: "/service", title: "Service", text: "Méthodes de jeu à part." },
] as const;

export default async function HomePage() {
  await ensureSchema();
  const member = await getMember();
  const [s, all] = await Promise.all([getPerformanceSummary(), listPublishedPronos()]);
  const open = groupMatches(all.filter((p) => p.result === "pending"));
  const done = groupMatches(all).filter((m) => m.pending === 0 && m.hits + m.miss > 0).slice(0, 6);
  const countsBySport = countOpenMatchesBySport(all);
  return (
    <PublicChrome member={member}>
      <section className="hero">
        <div>
          <p className="kicker">XWIN</p>
          <h1>L’analyse avant le pari.</h1>
          <p>Une fiche par match. Tous les tickets dessus. À la fin : 5/10 gagnants, rien d’autre.</p>
          <div className="cta-row">
            {member ? <Link className="btn" href="/app">Accéder à mon espace</Link> : (
              <><Link className="btn" href="/inscription">S’inscrire</Link><Link className="btn ghost" href="/connexion">Connexion</Link></>
            )}
          </div>
        </div>
        <div className="perf">
          <span className="muted">Taux de réussite</span>
          <strong>{s.rate === null ? "—" : `${s.rate}%`}</strong>
          <span className="muted">{s.settled} tickets soldés</span>
          <p><Link href="/resultats">Historique →</Link></p>
        </div>
      </section>
      <main className="wrap programme">
        <h2>Matchs ouverts</h2>
        {open.length === 0 ? <p className="empty">Aucun match ouvert.</p> : (
          <div className="fix-list">{open.slice(0, 8).map((m) => <MatchCard key={m.key} m={m} />)}</div>
        )}
        <p className="muted" style={{ marginTop: ".8rem" }}><Link href="/pronostics">Tous les matchs →</Link></p>
        <h2>Par sport</h2>
        <SportTiles counts={countsBySport} />
        <h2>Nos programmes</h2>
        <div className="grid three">
          {PROGRAMMES.map((prog) => (
            <Link className="card" key={prog.href} href={prog.href}><h3>{prog.title}</h3><p className="muted">{prog.text}</p></Link>
          ))}
        </div>
        <h2>Derniers scores</h2>
        {done.length === 0 ? <p className="empty">Pas encore de match soldé.</p> : (
          <div className="fix-list">{done.map((m) => <MatchCard key={m.key} m={m} />)}</div>
        )}
      </main>
    </PublicChrome>
  );
}
