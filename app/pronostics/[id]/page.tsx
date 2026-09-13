import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { sportLabel } from "@/lib/sports";
import { getProno } from "@/lib/store";
import { favoriteAction } from "@/app/app/favoris/actions";

export const dynamic = "force-dynamic";

export default async function PronosticDetail({ params }: { params: Promise<{ id: string }> }) {
  const member = await getMember();
  const { id } = await params;
  const p = await getProno(id);
  if (!p || p.status === "draft") notFound();
  const locked = p.isPaid;
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href="/pronostics">← Pronostics</Link></p>
        <p className="muted">{sportLabel(p.sport)} · {p.competition}</p>
        <h1>{p.eventName}</h1>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
        {p.kickoff ? <p className="muted">Coup d’envoi {p.kickoff}</p> : null}
        <p className="muted">Publié {new Date(p.createdAt).toLocaleString("fr-FR")}</p>
        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>Pronostic</h2>
          {locked ? (
            <>
              <p>Pronostic Premium. Analyse complète verrouillée.</p>
              <Link className="btn" href="/premium">Voir Premium</Link>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 700, fontSize: "1.15rem" }}>{p.pick}</p>
              <p className="muted">Cote {p.odd || "—"} · Confiance {p.confidence || "—"} · Mise {p.stakeUnits} u</p>
            </>
          )}
        </section>
        <section className="card" style={{ marginTop: ".7rem" }}>
          <h2>Analyse</h2>
          {locked ? <p className="muted">Réservé. Paiement encore off.</p> : <p style={{ whiteSpace: "pre-wrap" }}>{p.rationale}</p>}
        </section>
        <p className="muted">Statut {p.status} · Résultat {p.result}</p>
        {member ? (
          <form action={favoriteAction} style={{ marginTop: "1rem" }}>
            <input type="hidden" name="id" value={p.id} />
            <button className="btn" type="submit">Ajouter / retirer des favoris</button>
          </form>
        ) : null}
      </main>
    </PublicChrome>
  );
}
