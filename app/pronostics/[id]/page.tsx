import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { sportLabel } from "@/lib/sports";
import { getProno } from "@/lib/store";
import { formatDateTime } from "@/lib/format-date";
import { getVote } from "@/lib/votes";
import { ensureSchema } from "@/lib/schema";
import { matchSlug } from "@/lib/matches";
import { voteAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PronosticDetail({ params }: { params: Promise<{ id: string }> }) {
  await ensureSchema();
  const member = await getMember();
  const { id } = await params;
  const p = await getProno(id);
  if (!p || p.status === "draft") notFound();
  const vote = member ? await getVote(member.id, p.id) : null;
  const when = p.kickoff ? formatDateTime(p.kickoff) : formatDateTime(p.createdAt);
  const fiche = `/pronostics/m/${matchSlug(p)}`;

  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href={fiche}>← Fiche match</Link></p>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <span className="badge">{sportLabel(p.sport)}</span>
          <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
        </div>
        <p className="muted" style={{ marginTop: ".8rem" }}>{p.competition}</p>
        <h1>{p.eventName}</h1>
        <p className="muted">{when} · {p.pick}</p>

        {!member ? (
          <section className="card" style={{ marginTop: "1.2rem" }}>
            <h2>Ton avis d’abord</h2>
            <p className="muted">Compte + vote, puis l’analyse s’ouvre.</p>
            <div className="cta-row">
              <Link className="btn" href={`/connexion?next=/pronostics/${p.id}`}>Entrer</Link>
              <Link className="btn ghost" href="/inscription">Rejoindre</Link>
            </div>
          </section>
        ) : !vote ? (
          <section className="card" style={{ marginTop: "1.2rem" }}>
            <h2>Ton vote</h2>
            <form action={voteAction} className="cta-row">
              <input type="hidden" name="id" value={p.id} />
              <button className="btn" name="choice" value="1" type="submit">1 · Domicile</button>
              <button className="btn ghost" name="choice" value="X" type="submit">Nul</button>
              <button className="btn ghost" name="choice" value="2" type="submit">2 · Extérieur</button>
            </form>
          </section>
        ) : p.isPaid ? (
          <section className="card" style={{ marginTop: "1.2rem" }}>
            <p className="muted">Ton vote : {vote}</p>
            <h2>Ticket premium</h2>
            <p className="muted">Paiement encore coupé.</p>
            <Link className="btn ghost" href="/premium">Voir les offres</Link>
          </section>
        ) : (
          <>
            <p className="muted" style={{ marginTop: "1rem" }}>Ton vote : {vote}</p>
            <section className="card">
              <p className="kicker">XWIN</p>
              <h2>Notre pronostic</h2>
              <p className="vs"><span>{p.pick}</span></p>
            </section>
            <section className="card" style={{ marginTop: ".8rem" }}>
              <h2>À chaud</h2>
              <p style={{ whiteSpace: "pre-wrap", maxWidth: "40rem" }}>{p.rationale}</p>
            </section>
          </>
        )}
      </main>
    </PublicChrome>
  );
}
