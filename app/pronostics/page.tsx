import { PublicChrome } from "@/components/PublicChrome";
import { MatchCard } from "@/components/MatchCard";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { groupMatches } from "@/lib/matches";
import { ensureSchema } from "@/lib/schema";
import { ensureDailyFeed } from "@/lib/feed";
import "../browse.css";

export const dynamic = "force-dynamic";

export default async function PronosticsPage() {
  await ensureSchema();
  await ensureDailyFeed();
  const member = await getMember();
  const all = await listPublishedPronos();
  const open = groupMatches(all.filter((p) => p.result === "pending"));
  return (
    <PublicChrome member={member}>
      <main className="wrap programme">
        <p className="kicker">Matchs du jour</p>
        <h1>Tous les matchs</h1>
        <p className="muted">Une fiche par match. Quota interne : au moins 10 tickets faciles par sport actif.</p>
        {open.length === 0 ? (
          <p className="empty">Aucun match ouvert.</p>
        ) : (
          <div className="fix-list">{open.map((m) => <MatchCard key={m.key} m={m} />)}</div>
        )}
      </main>
    </PublicChrome>
  );
}
