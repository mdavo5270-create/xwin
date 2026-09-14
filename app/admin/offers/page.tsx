import Link from "next/link";
import { listOffers } from "@/lib/offers";
import { createOfferAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  await ensureSchema();
  const rows = await listOffers();
  return (
    <>
      <h1>Offres</h1>
      <p className="muted">Un seul catalogue : montante, abonnement, service. Prix éditables sans redéploiement. Encaissement coupé.</p>
      <form action={createOfferAction} className="card" style={{ maxWidth: 640, margin: "1rem 0" }}>
        <h2>Nouvelle offre</h2>
        <label>Type
          <select name="type">
            <option value="abonnement">Abonnement</option>
            <option value="service">Service</option>
            <option value="montante">Montante</option>
          </select>
        </label>
        <label>Nom<input name="title" required /></label>
        <label>Prix<input name="price" required /></label>
        <label>Devise<input name="currency" defaultValue="XOF" /></label>
        <label>Période<input name="period" placeholder="/ mois" /></label>
        <label>Cadence<input name="cadence" placeholder="weekly / monthly" /></label>
        <label>Paliers<input name="steps" type="number" defaultValue="0" /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <label style={{ display: "flex", gap: ".5rem" }}><input type="checkbox" name="active" defaultChecked style={{ width: "auto" }} /> Active</label>
        <div className="admin-actions"><button className="btn" type="submit">Créer</button></div>
      </form>
      {rows.length === 0 ? <p className="empty">Aucune offre.</p> : (
        <div className="admin-tiles">
          {rows.map((o) => (
            <Link className="admin-tile" key={o.id} href={adminHref(`offers/${o.id}`)}>
              <strong>{o.title}</strong>
              <div className="muted">{o.type} · {o.price} {o.currency} {o.period} · {o.active ? "active" : "inactive"}</div>
              <div className="muted">Modifier</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
