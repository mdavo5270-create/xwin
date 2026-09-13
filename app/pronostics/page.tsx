import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { PronoCard } from "@/components/PronoCard";
import { getMember } from "@/lib/members";
import { sportLabel } from "@/lib/sports";
import { listPublishedPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function PronosticsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; access?: string; status?: string }>;
}) {
  await ensureSchema();
  const member = await getMember();
  const { sport, access, status } = await searchParams;
  const published = await listPublishedPronos();
  const sportsPresent = [...new Set(published.map((p) => p.sport))];
  let rows = sport ? published.filter((p) => p.sport === sport) : published;
  if (access === "free") rows = rows.filter((p) => !p.isPaid);
  if (access === "premium") rows = rows.filter((p) => p.isPaid);
  if (status === "pending") rows = rows.filter((p) => p.result === "pending");
  if (status === "settled") rows = rows.filter((p) => p.result !== "pending");
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Pronostics</h1>
        <div className="tabs">
          <Link className={!sport ? "on" : ""} href="/pronostics">Tous</Link>
          {sportsPresent.map((slug) => (
            <Link key={slug} className={sport === slug ? "on" : ""} href={`/pronostics?sport=${slug}`}>{sportLabel(slug)}</Link>
          ))}
        </div>
        <div className="tabs">
          <Link className={!access && !status ? "on" : ""} href={sport ? `/pronostics?sport=${sport}` : "/pronostics">Tous</Link>
          <Link className={access === "free" ? "on" : ""} href={`/pronostics?access=free${sport ? `&sport=${sport}` : ""}`}>Gratuit</Link>
          <Link className={access === "premium" ? "on" : ""} href={`/pronostics?access=premium${sport ? `&sport=${sport}` : ""}`}>Premium</Link>
          <Link className={status === "pending" ? "on" : ""} href="/pronostics?status=pending">Ouverts</Link>
          <Link className={status === "settled" ? "on" : ""} href="/pronostics?status=settled">Soldés</Link>
        </div>
        {rows.length === 0 ? <p className="empty">Aucun ticket sur ce filtre.</p> : (
          <div className="grid two">
            {rows.map((p) => <PronoCard key={p.id} p={p} hidePick={p.isPaid && !member} />)}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
