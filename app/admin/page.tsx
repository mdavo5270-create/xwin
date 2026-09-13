import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { listAllMontantes, listAllPronos } from "@/lib/store";
import { loginAction, logoutAction, createPronoAction, createMontanteAction } from "./actions";
import { SPORTS } from "@/lib/sports";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = isAdminConfigured();
  const ok = await isAdmin();
  const pronos = ok ? listAllPronos() : [];
  const montantes = ok ? listAllMontantes() : [];

  if (!configured) {
    return (
      <main className="wrap">
        <h1>Admin</h1>
        <p className="empty">
          Ajoute la variable <code>ADMIN_SECRET</code> (12+ caractères) dans Vercel → Project → Settings →
          Environment Variables, puis redeploie.
        </p>
      </main>
    );
  }

  if (!ok) {
    return (
      <main className="wrap">
        <h1>Admin</h1>
        <form action={loginAction} className="card" style={{ maxWidth: 420 }}>
          <label>
            Mot de passe équipe
            <input name="password" type="password" required />
          </label>
          <button className="btn" type="submit">Entrer</button>
        </form>
      </main>
    );
  }

  return (
    <main className="wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Portail admin</h1>
        <form action={logoutAction}>
          <button className="btn ghost" type="submit">Sortir</button>
        </form>
      </div>
      <p className="muted">
        Tu crées le match, le prono et le pourquoi. Le public ne voit que ce que tu publies.
      </p>

      <section className="card" style={{ marginTop: "1rem" }}>
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
          <label>
            Compétition
            <input name="competition" required placeholder="Premier League, NBA, Roland-Garros…" />
          </label>
          <label>
            Match / événement
            <input name="eventName" required placeholder="Liverpool vs Arsenal" />
          </label>
          <label>
            Date / heure
            <input name="kickoff" placeholder="2026-09-20 18:00" />
          </label>
          <label>
            Prono
            <input name="pick" required placeholder="Victoire Liverpool, Over 2.5…" />
          </label>
          <label>
            Pourquoi ce prono
            <textarea name="rationale" required />
          </label>
          <button className="btn" type="submit">Publier le prono</button>
        </form>
      </section>

      <section className="card" style={{ marginTop: "1rem" }}>
        <h2>Nouvelle montante</h2>
        <form action={createMontanteAction}>
          <label>
            Titre
            <input name="title" required />
          </label>
          <label>
            Cadence
            <select name="cadence">
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </label>
          <label>
            Nombre de paliers
            <input name="steps" type="number" min={2} required />
          </label>
          <label>
            Montant pour rejoindre
            <input name="entryAmount" required placeholder="50" />
          </label>
          <label>
            Devise
            <input name="currency" defaultValue="EUR" />
          </label>
          <label>
            Détail des paliers
            <textarea name="description" required />
          </label>
          <button className="btn" type="submit">Ouvrir la montante</button>
        </form>
      </section>

      <h2 style={{ marginTop: "1.5rem" }}>Pronos ({pronos.length})</h2>
      {pronos.length === 0 ? <p className="empty">Aucun.</p> : (
        <div className="grid">
          {pronos.map((p) => (
            <div className="card" key={p.id}>
              <strong>{p.eventName}</strong>
              <div className="muted">{p.sport} · {p.pick} · {p.followCount} suivis · {p.status}</div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "1.5rem" }}>Montantes ({montantes.length})</h2>
      {montantes.length === 0 ? <p className="empty">Aucune.</p> : (
        <div className="grid">
          {montantes.map((m) => (
            <div className="card" key={m.id}>
              <strong>{m.title}</strong>
              <div className="muted">{m.cadence} · {m.steps} paliers · {m.entryAmount} {m.currency}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
