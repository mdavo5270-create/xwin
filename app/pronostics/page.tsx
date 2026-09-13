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

  function href(next: { sport?: string; access?: string; status?: string }) {
    const p = new URLSearchParams();
    const s = next.sport ?? sport;
    const a = next.access ?? access;
    const st = next.status ?? status;
    if (s) p.set("sport", s);
    if (a) p.set("access", a);
    if (st) p.set("status", st);
    const q = p.toString();
    return q ? `/pronostics?${q}` : "/pronostics";
  }

  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Pronostics</h1>
        <div className="tabs">
          <Link className={!sport ? "on" : ""} href="/pronostics">Tous</Link>
          {sportsPresent.map((slug) => (
            <Link key={slug} className={sport === slug ? "on" : ""} href={href({ sport: slug })}>
              {sportLabel(slug)}
            </Link>
          ))}
        </div>
        <div className="tabs">
          <Link className={!access && !status ? "on" : ""} href={href({ access: "", status: "" })}>Tous</Link>
          <Link className={access === "free" ? "on" : ""} href={href({ access: "free" })}>Gratuit</Link>
          <Link className={access === "premium" ? "on" : ""} href={href({ access: "premium" })}>Premium</Link>
          <Link className={status === "pending" ? "on" : ""} href={href({ status: "pending" })}>Ouverts</Link>
          <Link className={status === "settled" ? "on" : ""} href={href({ status: "settled" })}>Soldés</Link>
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
