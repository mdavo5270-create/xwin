import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { FixtureRow } from "@/components/FixtureRow";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { SPORTS, sportLabel } from "@/lib/sports";
import "../../browse.css";

export const dynamic = "force-dynamic";

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SPORTS.some((s) => s.slug === slug)) notFound();

  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos(slug);
  const open = all.filter((p) => p.result === "pending");

  return (
    <PublicChrome member={member}>
      <main className="wrap programme">
        <p className="kicker">Matchs du jour</p>
        <h1>{sportLabel(slug)}</h1>
        <p className="muted">Sport, ligue, heure. Le pronostic s’ouvre après ton vote.</p>
        {open.length === 0 ? (
          <p className="empty">Aucun match publié pour {sportLabel(slug)} pour le moment.</p>
        ) : (
          <div className="fix-list">{open.map((p) => <FixtureRow key={p.id} p={p} />)}</div>
        )}
        <p className="muted" style={{ marginTop: "1.4rem" }}>
          <Link href="/">← Voir tous les sports</Link>
        </p>
      </main>
    </PublicChrome>
  );
}
