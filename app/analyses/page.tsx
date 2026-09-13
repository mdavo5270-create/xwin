import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listAnalyses } from "@/lib/editorial";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnalysesPage() {
  const member = await getMember();
  const rows = await listAnalyses("published");
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Analyses</h1>
        {rows.length === 0 ? <p className="empty">Aucune analyse publiée.</p> : (
          <div className="grid">{rows.map((a) => (
            <Link key={a.id} className="card" href={`/analyses/${a.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <strong>{a.title}</strong>
              <div className="muted">{a.sport || "Général"}</div>
            </Link>
          ))}</div>
        )}
      </main>
    </PublicChrome>
  );
}
