import { PublicChrome } from "@/components/PublicChrome";
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
    <PublicChrome member={member}>
      <main className="wrap programme">
        <p className="kicker">Programme</p>
        <h1>Tous les matchs</h1>
        <p className="muted">
          {open.length} fiche{open.length > 1 ? "s" : ""} match · {pending.length} ticket{pending.length > 1 ? "s" : ""}.
          Plusieurs tickets sur le même match = une seule ligne ici.
        </p>
        {open.length === 0 ? (
          <p className="empty">Aucun match ouvert.</p>
        ) : [...bySport.entries()].map(([sport, list]) => (
          <section key={sport} style={{ marginTop: "1.6rem" }}>
            <h2>{sportLabel(sport)}</h2>
            <p className="muted">{list.length} match{list.length > 1 ? "s" : ""} · {list.reduce((n, m) => n + m.tickets.length, 0)} tickets</p>
            <div className="fix-list">{list.map((m) => <MatchCard key={m.key} m={m} />)}</div>
          </section>
        ))}
      </main>
    </PublicChrome>
  );
}
