import { createLicenseKey, listLicenseKeys, listLicenses } from "@/lib/licenses";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function createKey(formData: FormData) {
  "use server";
  const days = Number(formData.get("days")) === 7 ? 7 : 30;
  const reserved = String(formData.get("publicId") || "");
  await createLicenseKey(days, reserved);
  revalidatePath("/admin/licenses");
}

export default async function AdminLicensesPage() {
  const keys = await listLicenseKeys();
  const rows = await listLicenses();
  return (
    <>
      <h1>Licences</h1>
      <p className="muted">Génère un code. Envoie-le sur Telegram. L’utilisateur le tape sur Abonnement.</p>
      <form action={createKey} className="card">
        <label>ID compte (optionnel)<input name="publicId" placeholder="XWIN-A1B2C" /></label>
        <label>Durée
          <select name="days">
            <option value="7">7 jours</option>
            <option value="30">30 jours</option>
          </select>
        </label>
        <button className="btn" type="submit">Générer un code</button>
      </form>
      <h2>Codes</h2>
      {keys.length === 0 ? <p className="empty">Aucun code.</p> : (
        <div className="admin-tiles">
          {keys.map((k) => (
            <article className="admin-tile" key={k.id}>
              <strong>{k.code}</strong>
              <div className="muted">{k.days} j · {k.redeemed ? "utilisé" : "libre"}{k.reservedPublicId ? ` · réservé ${k.reservedPublicId}` : ""}</div>
            </article>
          ))}
        </div>
      )}
      <h2>Actives</h2>
      {rows.length === 0 ? <p className="empty">Aucune licence active.</p> : (
        <div className="admin-tiles">
          {rows.map((l) => (
            <article className="admin-tile" key={l.id}>
              <strong>{l.publicId}</strong>
              <div className="muted">{l.email} · {l.days} j · fin {new Date(l.endsAt).toLocaleDateString("fr-FR")}</div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
