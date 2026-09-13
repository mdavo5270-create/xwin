import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listAnalyses } from "@/lib/editorial";
import { SPORTS } from "@/lib/sports";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnalysesPage({ searchParams }: { searchParams: Promise<{ sport?: string }> }) {
  const member = await getMember();
  const { sport } = await searchParams;
  const rows = (await listAnalyses("published")).filter((a) => !sport || a.sport === sport);
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Analyses</h1>
        <div className="tabs">
          <Link className={!sport ? "on" : ""} href="/analyses">Tous</Link>
          {SPORTS.map((s) => (
            <Link key={s.slug} className={sport === s.slug ? "on" : ""} href={`/analyses?sport=${s.slug}`}>{s.label}</Link>
          ))}
        </div>
        {rows.length === 0 ? <p className="empty">Aucune analyse publiée.</p> : (
          <div className="grid">{rows.map((a) => (
            <Link key={a.id} className="card" href={`/analyses/${a.id}`}>
              <strong>{a.title}</strong>
              <div className="muted">{a.sport || "Général"}</div>
            </Link>
          ))}</div>
        )}
      </main>
    </PublicChrome>
  );
}
