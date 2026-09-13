import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { listAllMontantes, listAllPronos } from "@/lib/store";
import { loginAction, logoutAction, createPronoAction, createMontanteAction } from "./actions";
import { SPORTS } from "@/lib/sports";
import { TopBar } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = isAdminConfigured();
  const ok = await isAdmin();
  const pronos = ok ? await listAllPronos() : [];
  const montantes = ok ? await listAllMontantes() : [];

  if (!configured) {
    return (
      <>
        <TopBar title="Admin" back="/compte" />
        <main className="wrap"><p className="empty">ADMIN_SECRET manquant.</p></main>
      </>
    );
  }

  if (!ok) {
    return (
      <>
        <TopBar title="Admin" back="/compte" />
        <main className="wrap">
          <form action={loginAction} className="card">
            <label>
              Mot de passe équipe
              <input name="password" type="password" required />
            </label>
            <button className="btn" type="submit">Entrer</button>
          </form>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar title="Admin" back="/compte" />
      <main className="wrap">
        <form action={logoutAction} style={{ marginBottom: "0.8rem" }}>
          <button className="btn off" type="submit">Sortir</button>
        </form>
        <section className="card">
          <h2>Nouveau prono</h2>
          <form action={createPronoAction}>
            <label>
              Section
              <select name="sport" required>
                {SPORTS.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.label}</option>
                ))}
              </select>
            </label>
            <label>Compétition<input name="competition" required /></label>
            <label>Match<input name="eventName" required /></label>
            <label>Date / heure<input name="kickoff" /></label>
            <label>Prono<input name="pick" required /></label>
            <label>Pourquoi<textarea name="rationale" required /></label>
            <button className="btn gold" type="submit">Publier</button>
          </form>
        </section>
        <section className="card" style={{ marginTop: "0.7rem" }}>
          <h2>Nouvelle montante</h2>
          <form action={createMontanteAction}>
            <label>Titre<input name="title" required /></label>
            <label>
              Cadence
              <select name="cadence">
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
              </select>
            </label>
            <label>Paliers<input name="steps" type="number" min={2} required /></label>
            <label>Montant<input name="entryAmount" required /></label>
            <label>Devise<input name="currency" defaultValue="EUR" /></label>
            <label>Détail<textarea name="description" required /></label>
            <button className="btn" type="submit">Ouvrir</button>
          </form>
        </section>
        <h2 style={{ marginTop: "1rem" }}>Pronos ({pronos.length})</h2>
        {pronos.length === 0 ? <p className="empty">Aucun.</p> : (
          <div className="grid">
            {pronos.map((p) => (
              <div className="card" key={p.id}>
                <strong>{p.eventName}</strong>
                <div className="muted">{p.pick} · {p.followCount} suivis</div>
              </div>
            ))}
          </div>
        )}
        <h2 style={{ marginTop: "1rem" }}>Montantes ({montantes.length})</h2>
        {montantes.length === 0 ? <p className="empty">Aucune.</p> : (
          <div className="grid">
            {montantes.map((m) => (
              <div className="card" key={m.id}>
                <strong>{m.title}</strong>
                <div className="muted">{m.steps} paliers · {m.entryAmount} {m.currency}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
