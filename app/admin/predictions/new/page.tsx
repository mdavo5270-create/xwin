import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import { createPronoAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";

export default function Page() {
  return (
    <>
      <div className="admin-actions">
        <Link className="btn ghost" href={adminHref("predictions")}>Retour</Link>
      </div>
      <h1>Nouveau pronostic</h1>
      <form action={createPronoAction} className="card" style={{ maxWidth: 720 }}>
        <label>Sport
          <select name="sport" required>
            <option value="">Choisir</option>
            {SPORTS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
          </select>
        </label>
        <label>Compétition<input name="competition" required /></label>
        <label>Match<input name="eventName" placeholder="Équipe A vs Équipe B" required /></label>
        <label>Coup d’envoi<input name="kickoff" type="datetime-local" /></label>
        <label>Pick<input name="pick" placeholder="1 / N / 2" required /></label>
        <label>Cote<input name="odd" required /></label>
        <label>Confiance<input name="confidence" placeholder="7/10" /></label>
        <label>Unités<input name="stakeUnits" defaultValue="1" /></label>
        <label>Analyse<textarea name="rationale" rows={6} required /></label>
        <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <input type="checkbox" name="isPaid" style={{ width: "auto" }} /> Premium
        </label>
        <div className="admin-actions">
          <button className="btn" type="submit">Publier</button>
          <Link className="btn ghost" href={adminHref("predictions")}>Annuler</Link>
        </div>
      </form>
    </>
  );
}
