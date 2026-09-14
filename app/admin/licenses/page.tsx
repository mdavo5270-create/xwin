import { grantLicense, listLicenses } from "@/lib/licenses";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function createLicense(formData: FormData) {
  "use server";
  const publicId = String(formData.get("publicId") || "");
  const days = Number(formData.get("days")) === 7 ? 7 : 30;
  const note = String(formData.get("note") || "");
  await grantLicense(publicId, days, note);
  revalidatePath("/admin/licenses");
}

export default async function AdminLicensesPage() {
  const rows = await listLicenses();
  return (
    <>
      <h1>Licences</h1>
      <p className="muted">Active une licence 7 ou 30 jours avec l’ID compte reçu sur Telegram.</p>
      <form action={createLicense} className="card">
        <label>ID compte<input name="publicId" placeholder="XWIN-A1B2C" required /></label>
        <label>Durée
          <select name="days">
            <option value="7">7 jours</option>
            <option value="30">30 jours</option>
          </select>
        </label>
        <label>Note<input name="note" placeholder="Telegram" /></label>
        <button className="btn" type="submit">Activer</button>
      </form>
      {rows.length === 0 ? <p className="empty">Aucune licence.</p> : (
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
