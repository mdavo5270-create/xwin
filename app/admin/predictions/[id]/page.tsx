import Link from "next/link";
import { notFound } from "next/navigation";
import { SPORTS } from "@/lib/sports";
import { getProno } from "@/lib/store";
import { updatePronoAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProno(id);
  if (!p) notFound();
  return (
    <>
      <div className="admin-actions">
        <Link className="btn ghost" href={adminHref("predictions")}>Retour</Link>
      </div>
      <h1>Modifier le pronostic</h1>
      <form action={updatePronoAction} className="card" style={{ maxWidth: 720 }}>
        <input type="hidden" name="id" value={p.id} />
        <label>Sport
          <select name="sport" defaultValue={p.sport} required>
            {SPORTS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
          </select>
        </label>
        <label>Compétition<input name="competition" defaultValue={p.competition} required /></label>
        <label>Match<input name="eventName" defaultValue={p.eventName} required /></label>
        <label>Coup d’envoi<input name="kickoff" defaultValue={p.kickoff} /></label>
        <label>Pick<input name="pick" defaultValue={p.pick} required /></label>
        <label>Cote<input name="odd" defaultValue={p.odd} required /></label>
        <label>Confiance<input name="confidence" defaultValue={p.confidence} /></label>
        <label>Unités<input name="stakeUnits" defaultValue={p.stakeUnits} /></label>
        <label>Analyse<textarea name="rationale" rows={6} defaultValue={p.rationale} required /></label>
        <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <input type="checkbox" name="isPaid" defaultChecked={p.isPaid} style={{ width: "auto" }} /> Premium
        </label>
        <div className="admin-actions">
          <button className="btn" type="submit">Enregistrer</button>
          <Link className="btn ghost" href={adminHref("predictions")}>Annuler</Link>
        </div>
      </form>
    </>
  );
}
