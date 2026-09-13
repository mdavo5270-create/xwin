import { SPORTS } from "@/lib/sports";
import { createPronoAction } from "@/app/admin/actions";
export default function Page() {
  return (
    <>
      <h1>Nouveau pronostic</h1>
      <form action={createPronoAction} className="card">
        <label>Sport<select name="sport">{SPORTS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}</select></label>
        <label>Compétition<input name="competition" required /></label>
        <label>Événement<input name="eventName" required /></label>
        <label>Date / heure<input name="kickoff" /></label>
        <label>Pronostic<input name="pick" required /></label>
        <label>Analyse<textarea name="rationale" required /></label>
        <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <input type="checkbox" name="isPaid" style={{ width: "auto" }} /> Premium
        </label>
        <button className="btn" type="submit">Publier</button>
      </form>
    </>
  );
}
