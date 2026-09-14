import { getSettings } from "@/lib/commerce";
import { saveSettingsAction } from "@/app/admin/actions";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function Page() {
  await ensureSchema();
  const s = await getSettings();
  return (
    <>
      <h1>Paramètres</h1>
      <p className="muted">Enregistrés en base. Rechargés à chaque visite.</p>
      <form action={saveSettingsAction} className="card" style={{ maxWidth: 520 }}>
        <label>Nom du site<input name="site_name" defaultValue={s.site_name} /></label>
        <label>Devise<input name="currency" defaultValue={s.currency} /></label>
        <label>Maintenance
          <select name="maintenance" defaultValue={s.maintenance}>
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
        </label>
        <button className="btn" type="submit">Enregistrer</button>
      </form>
    </>
  );
}
