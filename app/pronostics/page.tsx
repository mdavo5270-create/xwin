import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { SPORTS, sportLabel } from "@/lib/sports";
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
  let rows = await listPublishedPronos(sport);
  if (access === "free") rows = rows.filter((p) => !p.isPaid);
  if (access === "premium") rows = rows.filter((p) => p.isPaid);
  if (status === "pending") rows = rows.filter((p) => p.result === "pending");
  if (status === "settled") rows = rows.filter((p) => p.result !== "pending");
  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (sport) p.set("sport", sport);
    if (access) p.set("access", access);
    if (status) p.set("status", status);
    Object.entries(extra).forEach(([k, v]) => p.set(k, v));
    const s = p.toString();
    return s ? `/pronostics?${s}` : "/pronostics";
  };
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Pronostics</h1>
        <div className="tabs">
          <Link className={!sport ? "on" : ""} href={qs({ sport: "" }).replace("sport=", "") || "/pronostics"}>Tous</Link>
          {SPORTS.map((s) => (
            <Link key={s.slug} className={sport === s.slug ? "on" : ""} href={`/pronostics?sport=${s.slug}${access ? `&access=${access}` : ""}${status ? `&status=${status}` : ""}`}>{s.label}</Link>
          ))}
        </div>
        <div className="tabs">
          <Link className={!access ? "on" : ""} href={`/pronostics${sport ? `?sport=${sport}` : ""}`}>Tous accès</Link>
          <Link className={access === "free" ? "on" : ""} href={`/pronostics?access=free${sport ? `&sport=${sport}` : ""}`}>Gratuit</Link>
          <Link className={access === "premium" ? "on" : ""} href={`/pronostics?access=premium${sport ? `&sport=${sport}` : ""}`}>Premium</Link>
          <Link className={status === "pending" ? "on" : ""} href={`/pronostics?status=pending`}>En attente</Link>
          <Link className={status === "settled" ? "on" : ""} href={`/pronostics?status=settled`}>Soldés</Link>
        </div>
        {rows.length === 0 ? <p className="empty">Aucun prono pour ce filtre.</p> : (
          <div className="grid two">
            {rows.map((p) => (
              <Link key={p.id} className="card" href={`/pronostics/${p.id}`}>
                <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "✦ Premium" : "Gratuit"}</span>
                <div className="muted">{sportLabel(p.sport)} · {p.competition} · {p.result}</div>
                <strong>{p.eventName}</strong>
                <div>{p.isPaid ? "Analyse exclusive" : `Pronostic : ${p.pick}`}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
