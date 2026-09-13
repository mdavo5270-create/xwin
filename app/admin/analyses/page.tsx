import { listAnalyses } from "@/lib/editorial";
import { createAnalysisAction } from "@/app/admin/actions";
import { SPORTS } from "@/lib/sports";

export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await listAnalyses();
  return (
    <>
      <h1>Analyses</h1>
      <form action={createAnalysisAction} className="card">
        <label>Titre<input name="title" required /></label>
        <label>Sport<select name="sport">{SPORTS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}</select></label>
        <label>Texte<textarea name="body" required /></label>
        <button className="btn" type="submit">Publier</button>
      </form>
      <h2>Déjà en ligne</h2>
      {rows.length === 0 ? <p className="empty">Aucune.</p> : (
        <div className="grid">{rows.map((a) => <div className="card" key={a.id}><strong>{a.title}</strong><div className="muted">{a.status}</div></div>)}</div>
      )}
    </>
  );
}
