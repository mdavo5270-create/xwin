import Link from "next/link";
import { notFound } from "next/navigation";
import { getMontante } from "@/lib/store";
import { updateMontanteAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await getMontante(id);
  if (!m) notFound();
  return (
    <>
      <div className="admin-actions"><Link className="btn ghost" href={adminHref("offers")}>Retour</Link></div>
      <h1>Modifier l’offre</h1>
      <form action={updateMontanteAction} className="card" style={{ maxWidth: 640 }}>
        <input type="hidden" name="id" value={m.id} />
        <label>Nom<input name="title" defaultValue={m.title} required /></label>
        <label>Cadence
          <select name="cadence" defaultValue={m.cadence}>
            <option value="weekly">Hebdo</option>
            <option value="monthly">Mensuel</option>
          </select>
        </label>
        <label>Paliers<input name="steps" type="number" defaultValue={m.steps} /></label>
        <label>Prix<input name="entryAmount" defaultValue={m.entryAmount} required /></label>
        <label>Devise<input name="currency" defaultValue={m.currency} /></label>
        <label>Statut
          <select name="status" defaultValue={m.status}>
            <option value="open">Ouverte</option>
            <option value="closed">Fermée</option>
          </select>
        </label>
        <label>Description<textarea name="description" rows={4} defaultValue={m.description} /></label>
        <div className="admin-actions">
          <button className="btn" type="submit">Enregistrer</button>
          <Link className="btn ghost" href={adminHref("offers")}>Annuler</Link>
        </div>
      </form>
    </>
  );
}
