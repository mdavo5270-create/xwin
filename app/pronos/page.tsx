import Link from "next/link";
import { SPORTS, sportLabel } from "@/lib/sports";
import { listPublishedPronos } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PronosPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const { sport } = await searchParams;
  const pronos = await listPublishedPronos(sport);
  return (
    <>
      <h1>Pronos</h1>
      <div className="tabs">
        <Link className={!sport ? "on" : ""} href="/pronos">Tous</Link>
        {SPORTS.map((s) => (
          <Link key={s.slug} className={sport === s.slug ? "on" : ""} href={`/pronos?sport=${s.slug}`}>
            {s.label}
          </Link>
        ))}
      </div>
      {pronos.length === 0 ? (
        <p className="empty">Aucun prono dans cette section.</p>
      ) : (
        <div className="grid two">
          {pronos.map((p) => (
            <Link className="card" key={p.id} href={`/pronos/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Payant" : "Gratuit"}</span>
              <div className="muted">{sportLabel(p.sport)} · {p.competition}</div>
              <strong>{p.eventName}</strong>
              <div>{p.isPaid ? "Contenu abonnés" : `Prono : ${p.pick}`}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
