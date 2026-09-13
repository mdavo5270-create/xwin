import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { sportLabel } from "@/lib/sports";
import { getProno } from "@/lib/store";
import { formatDateTime } from "@/lib/format-date";
import { favoriteAction } from "@/app/app/favoris/actions";
import { followAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PronosticDetail({ params }: { params: Promise<{ id: string }> }) {
  const member = await getMember();
  const { id } = await params;
  const p = await getProno(id);
  if (!p || p.status === "draft") notFound();
  const gated = !member;
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href="/pronostics">← Retour aux pronostics</Link></p>
        <p className="muted">{sportLabel(p.sport)} · {p.competition}</p>
        <h1>{p.eventName}</h1>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Offre" : "Public"}</span>
        {p.kickoff ? <p className="muted">Coup d’envoi {formatDateTime(p.kickoff)}</p> : null}
        {gated ? (
          <section className="card" style={{ marginTop: "1rem" }}>
            <h2>Compte requis</h2>
            <p className="muted">Sans compte, le pick, l’analyse et le suivi restent fermés — même sur un ticket public.</p>
            <div className="cta-row">
              <Link className="btn" href={`/connexion?next=/pronostics/${p.id}`}>Entrer</Link>
              <Link className="btn ghost" href="/inscription">Rejoindre</Link>
            </div>
          </section>
        ) : p.isPaid ? (
          <section className="card" style={{ marginTop: "1rem" }}>
            <h2>Ticket offres</h2>
            <p className="muted">Analyse réservée. Paiement encore coupé.</p>
            <Link className="btn ghost" href="/premium">Voir les offres</Link>
          </section>
        ) : (
          <>
            <section className="card" style={{ marginTop: "1rem" }}>
              <h2>Pronostic</h2>
              <p style={{ fontWeight: 700, fontSize: "1.15rem" }}>{p.pick}</p>
              <p className="muted">Cote {p.odd || "—"} · Confiance {p.confidence || "—"} · Mise {p.stakeUnits} u</p>
            </section>
            <section className="card" style={{ marginTop: ".7rem" }}>
              <h2>Analyse</h2>
              <p style={{ whiteSpace: "pre-wrap" }}>{p.rationale}</p>
            </section>
            <form action={followAction.bind(null, p.id)}>
              <button className="btn ghost" type="submit">Je suis ce prono ({p.followCount})</button>
            </form>
            <form action={favoriteAction}>
              <input type="hidden" name="id" value={p.id} />
              <button className="btn" type="submit">Favoris</button>
            </form>
          </>
        )}
      </main>
    </PublicChrome>
  );
}
