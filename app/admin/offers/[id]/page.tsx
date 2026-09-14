import Link from "next/link";
import { notFound } from "next/navigation";
import { getOffer } from "@/lib/offers";
import { updateOfferAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await getOffer(id);
  if (!o) notFound();
  return (
    <>
      <div className="admin-actions"><Link className="btn ghost" href={adminHref("offers")}>Retour</Link></div>
      <h1>Modifier l’offre</h1>
      <form action={updateOfferAction} className="card" style={{ maxWidth: 640 }}>
        <input type="hidden" name="id" value={o.id} />
        <label>Type
          <select name="type" defaultValue={o.type}>
            <option value="abonnement">Abonnement</option>
            <option value="service">Service</option>
            <option value="montante">Montante</option>
          </select>
        </label>
        <label>Nom<input name="title" defaultValue={o.title} required /></label>
        <label>Prix<input name="price" defaultValue={o.price} required /></label>
        <label>Devise<input name="currency" defaultValue={o.currency} /></label>
        <label>Période<input name="period" defaultValue={o.period} /></label>
        <label>Cadence<input name="cadence" defaultValue={o.cadence} /></label>
        <label>Paliers<input name="steps" type="number" defaultValue={o.steps} /></label>
        <label>Description<textarea name="description" rows={4} defaultValue={o.description} /></label>
        <label style={{ display: "flex", gap: ".5rem" }}><input type="checkbox" name="active" defaultChecked={o.active} style={{ width: "auto" }} /> Active</label>
        <div className="admin-actions">
          <button className="btn" type="submit">Enregistrer</button>
          <Link className="btn ghost" href={adminHref("offers")}>Annuler</Link>
        </div>
      </form>
    </>
  );
}
