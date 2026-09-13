import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { PronoRail } from "@/components/PronoTile";
import { getMember } from "@/lib/members";
import { sportLabel } from "@/lib/sports";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import "../browse.css";

export const dynamic = "force-dynamic";

export default async function PronosticsPage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const featured = all.find((p) => p.result === "pending") ?? all[0];
  const open = all.filter((p) => p.result === "pending");
  const free = all.filter((p) => !p.isPaid);
  const paid = all.filter((p) => p.isPaid);
  const settled = all.filter((p) => p.result !== "pending");
  const bySport = [...new Set(all.map((p) => p.sport))].map((slug) => ({
    slug,
    items: all.filter((p) => p.sport === slug),
  }));

  return (
    <PublicChrome member={member}>
      {featured ? (
        <section className="billboard">
          <p className="kicker">Au programme</p>
          <h1>{featured.eventName}</h1>
          <p className="meta">
            {sportLabel(featured.sport)} · {featured.competition}
            {featured.isPaid ? " · Offre" : " · Public"}
          </p>
          <div className="cta-row">
            <Link className="btn" href={`/pronostics/${featured.id}`}>Voir le ticket</Link>
            <Link className="btn ghost" href="/premium">Offres</Link>
          </div>
        </section>
      ) : (
        <main className="wrap"><p className="empty">Aucun ticket pour le moment.</p></main>
      )}
      <PronoRail title="Ouverts maintenant" items={open} hidePaidPick={!member} />
      {bySport.map((row) => (
        <PronoRail key={row.slug} title={sportLabel(row.slug)} items={row.items} hidePaidPick={!member} />
      ))}
      <PronoRail title="Public" items={free} hidePaidPick={!member} />
      <PronoRail title="Offres" items={paid} hidePaidPick />
      <PronoRail title="Déjà soldés" items={settled} hidePaidPick={!member} />
      <div style={{ height: "1.2rem" }} />
    </PublicChrome>
  );
}
