import Link from "next/link";
import { resetAction } from "./actions";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; err?: string; done?: string }>;
}) {
  const q = await searchParams;

  if (q.done) {
    return (
      <main className="auth">
        <div className="auth-card">
          <p className="eyebrow">XWIN</p>
          <h1>Mot de passe changé</h1>
          <p className="muted">Tu peux te connecter avec ton nouveau mot de passe.</p>
          <Link className="btn" href="/connexion" style={{ marginTop: "1rem" }}>Se connecter</Link>
        </div>
      </main>
    );
  }

  if (!q.token) {
    return (
      <main className="auth">
        <div className="auth-card">
          <p className="eyebrow">XWIN</p>
          <h1>Lien invalide</h1>
          <p className="muted">Ce lien de réinitialisation est incomplet ou a expiré.</p>
          <Link className="btn ghost" href="/mot-de-passe-oublie" style={{ marginTop: "1rem" }}>Demander un nouveau lien</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="auth">
      <div className="auth-card">
        <p className="eyebrow">XWIN</p>
        <h1>Nouveau mot de passe</h1>
        {q.err ? <p className="err">{q.err}</p> : null}
        <form action={resetAction}>
          <input type="hidden" name="token" value={q.token} />
          <label>Nouveau mot de passe<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label>
          <label>Confirmation<input name="confirm" type="password" minLength={8} required autoComplete="new-password" /></label>
          <button className="btn" type="submit">Valider</button>
        </form>
      </div>
    </main>
  );
}
