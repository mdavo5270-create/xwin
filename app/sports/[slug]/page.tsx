import { notFound } from "next/navigation";
import { HubShell } from "@/components/HubShell";
import { MatchCard } from "@/components/MatchCard";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { groupMatches } from "@/lib/matches";
import { ensureSchema } from "@/lib/schema";
import { SPORTS, sportLabel } from "@/lib/sports";
import "../../browse.css";

export const dynamic = "force-dynamic";

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SPORTS.some((s) => s.slug === slug)) notFound();
  await ensureSchema();
  const member = await getMember();
  const open = groupMatches((await listPublishedPronos(slug)).filter((p) => p.result === "pending"));
  return (
    <HubShell member={member} tab="/accueil">
      <div className="hub-body">
        <h1>{sportLabel(slug)}</h1>
        {open.length === 0 ? (
          <p className="empty">Aucun match publié pour {sportLabel(slug)}.</p>
        ) : (
          <div className="fix-list">{open.map((m) => <MatchCard key={m.key} m={m} />)}</div>
        )}
      </div>
    </HubShell>
  );
}
