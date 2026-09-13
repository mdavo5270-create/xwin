import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { SPORTS, sportLabel } from "@/lib/sports";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function PronosticsPage({ searchParams }: { searchParams: Promise<{ sport?: string; access?: string }> }) {
  await ensureSchema();
  const member = await getMember();
  const { sport, access } = await searchParams;
  let rows = await listPublishedPronos(sport);
  if (access === "free") rows = rows.filter((p) => !p.isPaid);
  if (access === "premium") rows = rows.filter((p) => p.isPaid);
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Pronostics</h1>
        <div className="tabs">
          <Link className={!sport ? "on" : ""} href="/pronostics">Tous</Link>
          {SPORTS.map((s) => (
            <Link key={s.slug} className={sport === s.slug ? "on" : ""} href={`/pronostics?sport=${s.slug}`}>{s.label}</Link>
          ))}
          <Link className={access === "free" ? "on" : ""} href="/pronostics?access=free">Gratuit</Link>
          <Link className={access === "premium" ? "on" : ""} href="/pronostics?access=premium">Premium</Link>
        </div>
        {rows.length === 0 ? <p className="empty">Aucun prono pour ce filtre.</p> : (
          <div className="grid two">
            {rows.map((p) => (
              <Link key={p.id} className="card" href={`/pronostics/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
                <div className="muted">{sportLabel(p.sport)} · {p.competition}</div>
                <strong>{p.eventName}</strong>
                <div>{p.isPaid ? "🔒 Débloquer l’analyse" : `Pronostic : ${p.pick}`}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
