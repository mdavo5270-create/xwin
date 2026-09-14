import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { MatchCard } from "@/components/MatchCard";
import { getMember } from "@/lib/members";
import { getPerformanceSummary, listPublishedPronos } from "@/lib/store";
import { groupMatches } from "@/lib/matches";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function ResultatsPage() {
  await ensureSchema();
  const member = await getMember();
  const [s, all] = await Promise.all([getPerformanceSummary(), listPublishedPronos()]);
  const done = groupMatches(all).filter((m) => m.pending === 0 && m.hits + m.miss > 0);
  return (
    <PublicChrome member={member}>
      <main className="wrap programme">
        <h1>Résultats</h1>
        <p className="muted">Score d’un match = tickets gagnants / tickets soldés. Rien d’autre.</p>
        <div className="grid three">
          <div className="card">Tickets soldés {s.settled}</div>
          <div className="card">Gagnés {s.hits}</div>
          <div className="card">Taux {s.rate === null ? "—" : `${s.rate} %`}</div>
        </div>
        {done.length === 0 ? <p className="empty">Pas encore de match soldé.</p> : (
          <div className="fix-list" style={{ marginTop: "1.2rem" }}>
            {done.map((m) => <MatchCard key={m.key} m={m} />)}
          </div>
        )}
        <p className="muted" style={{ marginTop: "1rem" }}><Link href="/pronostics">Matchs ouverts</Link></p>
      </main>
    </PublicChrome>
  );
}
