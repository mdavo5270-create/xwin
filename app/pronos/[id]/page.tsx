import Link from "next/link";
import { notFound } from "next/navigation";
import { sportLabel } from "@/lib/sports";
import { getProno } from "@/lib/store";
import { followAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PronoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProno(id);
  if (!p || p.status === "draft") notFound();
  const locked = p.isPaid;
  return (
    <>
      <p><Link href="/pronos">← Pronos</Link></p>
      <p className="muted">{sportLabel(p.sport)} · {p.competition}</p>
      <h1>{p.eventName}</h1>
      <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Payant" : "Gratuit"}</span>
      {p.kickoff ? <p className="muted">{p.kickoff}</p> : null}
      <section className="card" style={{ marginTop: "1rem" }}>
        <h2>Notre prono</h2>
        {locked ? (
          <>
            <p>Réservé aux abonnés.</p>
            <Link href="/abonnements">Voir les abonnements</Link>
          </>
        ) : (
          <p style={{ fontSize: "1.2rem", fontWeight: 700 }}>{p.pick}</p>
        )}
      </section>
      <section className="card" style={{ marginTop: ".7rem" }}>
        <h2>Pourquoi</h2>
        {locked ? <p className="muted">Analyse masquée — paiement encore désactivé.</p> : <p style={{ whiteSpace: "pre-wrap" }}>{p.rationale}</p>}
      </section>
      {!locked ? (
        <form action={followAction.bind(null, p.id)} style={{ marginTop: "1rem" }}>
          <button className="btn" type="submit">Je suis ce prono ({p.followCount})</button>
        </form>
      ) : null}
    </>
  );
}
