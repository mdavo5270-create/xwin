import { SPORTS } from "@/lib/sports";
import { createPronoAction } from "@/app/admin/actions";

export default function Page() {
  return (
    <>
      <h1>Nouveau pronostic</h1>
      <p className="muted">Enregistré à la publication. Le pick et la cote ne doivent plus être réécrits après coup — seul le résultat se solde.</p>
      <form action={createPronoAction} className="card">
        <label>Sport<select name="sport">{SPORTS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}</select></label>
        <label>Compétition<input name="competition" required /></label>
        <label>Événement<input name="eventName" required /></label>
        <label>Coup d’envoi<input name="kickoff" placeholder="2026-09-20 18:00" /></label>
        <label>Pronostic<input name="pick" required /></label>
        <label>Cote à publication<input name="odd" placeholder="1.85" /></label>
        <label>Confiance /10<input name="confidence" placeholder="7" /></label>
        <label>Unités de mise<input name="stakeUnits" defaultValue="1" /></label>
        <label>Analyse<textarea name="rationale" required /></label>
        <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <input type="checkbox" name="isPaid" style={{ width: "auto" }} /> Premium
        </label>
        <button className="btn" type="submit">Publier (horodaté)</button>
      </form>
    </>
  );
}
