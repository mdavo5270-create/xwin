import { PublicChrome } from "@/components/PublicChrome";
import { FixtureRow } from "@/components/FixtureRow";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import "../browse.css";

export const dynamic = "force-dynamic";

export default async function PronosticsPage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const open = all.filter((p) => p.result === "pending");
  return (
    <PublicChrome member={member}>
      <main className="wrap programme">
        <p className="kicker">Programme</p>
        <h1>Tous les matchs</h1>
        {open.length === 0 ? (
          <p className="empty">Aucun match ouvert.</p>
        ) : (
          <div className="fix-list">{open.map((p) => <FixtureRow key={p.id} p={p} />)}</div>
        )}
      </main>
    </PublicChrome>
  );
}
