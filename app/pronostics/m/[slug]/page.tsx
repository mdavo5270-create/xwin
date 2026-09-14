import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { groupMatches, scoreLabel } from "@/lib/matches";
import { sportLabel } from "@/lib/sports";
import { formatDateTime } from "@/lib/format-date";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
  await ensureSchema();
  const member = await getMember();
  const { slug } = await params;
  const groups = groupMatches(await listPublishedPronos());
  const m = groups.find((g) => g.slug === slug);
  if (!m) notFound();
  const when = m.kickoff ? formatDateTime(m.kickoff) : "";
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href="/pronostics">← Pronostics</Link></p>
        <span className="badge">{sportLabel(m.sport)}</span>
        <p className="muted">{m.competition}</p>
        <h1>{m.eventName}</h1>
        <p className="muted">{when}</p>
        <p className="vs"><span>{scoreLabel(m)}</span><span>{m.tickets.length} tickets publiés</span></p>
        <div className="grid" style={{ marginTop: "1.2rem" }}>
          {m.tickets.map((p) => (
            <Link className="card" key={p.id} href={`/pronostics/${p.id}`}>
              <strong>{p.pick}</strong>
              <div className="muted">{p.isPaid ? "Premium" : "Gratuit"} · {p.result === "pending" ? "en cours" : p.result === "hit" ? "gagné" : p.result === "miss" ? "perdu" : "annulé"}</div>
            </Link>
          ))}
        </div>
      </main>
    </PublicChrome>
  );
}
