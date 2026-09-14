import Link from "next/link";
import { listAllMontantes } from "@/lib/store";
import { createMontanteAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const rows = await listAllMontantes();
  return (
    <>
      <h1>Offres</h1>
      <p className="muted">Stratégies et montantes enregistrées en base. Paiement toujours coupé.</p>
      <form action={createMontanteAction} className="card" style={{ maxWidth: 640, margin: "1rem 0" }}>
        <h2>Nouvelle offre</h2>
        <label>Nom<input name="title" required /></label>
        <label>Cadence
          <select name="cadence">
            <option value="weekly">Journalier / hebdo</option>
            <option value="monthly">Mensuel</option>
          </select>
        </label>
        <label>Paliers<input name="steps" type="number" defaultValue="5" /></label>
        <label>Prix<input name="entryAmount" required /></label>
        <label>Devise<input name="currency" defaultValue="XOF" /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <div className="admin-actions">
          <button className="btn" type="submit">Créer</button>
        </div>
      </form>
      {rows.length === 0 ? <p className="empty">Aucune offre.</p> : (
        <div className="admin-tiles">
          {rows.map((m) => (
            <Link className="admin-tile" key={m.id} href={adminHref(`offers/${m.id}`)}>
              <strong>{m.title}</strong>
              <div className="muted">{m.entryAmount} {m.currency} · {m.cadence} · {m.status}</div>
              <div className="muted">Modifier</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
