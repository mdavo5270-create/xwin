import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
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
    <PublicChrome member={member}>
      <main className="wrap programme">
        <p className="kicker">Matchs du jour</p>
        <h1>{sportLabel(slug)}</h1>
        {open.length === 0 ? (
          <p className="empty">Aucun match publié pour {sportLabel(slug)}.</p>
        ) : (
          <div className="fix-list">{open.map((m) => <MatchCard key={m.key} m={m} />)}</div>
        )}
        <p className="muted" style={{ marginTop: "1.4rem" }}><Link href="/">← Tous les sports</Link></p>
      </main>
    </PublicChrome>
  );
}
