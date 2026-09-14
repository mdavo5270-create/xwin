import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { FixtureRow } from "@/components/FixtureRow";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { computePerformance } from "@/lib/performance";
import "./browse.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const open = all.filter((p) => p.result === "pending");
  const s = computePerformance(all);
  return (
    <PublicChrome member={member}>
      <main className="wrap programme">
        <p className="kicker">Aujourd’hui</p>
        <h1>Les matchs</h1>
        <p className="muted">Sport, ligue, heure. Le pronostic s’ouvre après ton vote.</p>
        {open.length === 0 ? (
          <p className="empty">Aucun match publié pour le moment.</p>
        ) : (
          <div className="fix-list">{open.map((p) => <FixtureRow key={p.id} p={p} />)}</div>
        )}
        {s.settled > 0 ? (
          <p className="muted" style={{ marginTop: "1.4rem" }}>
            Réussite {s.rate}% sur {s.settled} tickets soldés · <Link href="/resultats">Historique</Link>
          </p>
        ) : (
          <p className="muted" style={{ marginTop: "1.4rem" }}>
            Historique public dès le premier ticket soldé · <Link href="/resultats">Voir</Link>
          </p>
        )}
      </main>
    </PublicChrome>
  );
}
