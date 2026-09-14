import { HubShell } from "@/components/HubShell";
import { MatchCard } from "@/components/MatchCard";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { groupMatches } from "@/lib/matches";
import { ensureSchema } from "@/lib/schema";
import "../browse.css";

export const dynamic = "force-dynamic";

export default async function ResultatsPage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const done = groupMatches(all).filter((m) => m.pending === 0 && m.hits + m.miss > 0);
  return (
    <HubShell member={member} tab="/accueil">
      <div className="hub-body">
        <h1>Résultats</h1>
        {done.length === 0 ? <p className="empty">Pas encore de match soldé.</p> : (
          <div className="fix-list">{done.map((m) => <MatchCard key={m.key} m={m} />)}</div>
        )}
      </div>
    </HubShell>
  );
}
