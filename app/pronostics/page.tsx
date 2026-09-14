import { HubShell } from "@/components/HubShell";
import { MatchCard } from "@/components/MatchCard";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { groupMatches } from "@/lib/matches";
import { ensureSchema } from "@/lib/schema";
import { ensureDailyFeed } from "@/lib/feed";
import { sportLabel } from "@/lib/sports";
import "../browse.css";

export const dynamic = "force-dynamic";

export default async function PronosticsPage() {
  await ensureSchema();
  await ensureDailyFeed();
  const member = await getMember();
  const pending = (await listPublishedPronos()).filter((p) => p.result === "pending");
  const open = groupMatches(pending);
  const bySport = new Map<string, typeof open>();
  for (const m of open) {
    const list = bySport.get(m.sport) ?? [];
    list.push(m);
    bySport.set(m.sport, list);
  }
  return (
    <HubShell member={member} tab="/pronostics">
      <div className="hub-body">
        <h1>Sports</h1>
        {open.length === 0 ? (
          <p className="empty">Aucun match ouvert.</p>
        ) : [...bySport.entries()].map(([sport, list]) => (
          <section key={sport}>
            <h2>{sportLabel(sport)}</h2>
            <div className="fix-list">{list.map((m) => <MatchCard key={m.key} m={m} />)}</div>
          </section>
        ))}
      </div>
    </HubShell>
  );
}
