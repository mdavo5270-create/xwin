import Link from "next/link";
import { registerAction } from "./actions";

export default async function InscriptionPage({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const q = await searchParams;
  return (
    <main className="auth">
      <div className="auth-card">
        <p className="muted">XWIN</p>
        <h1>Inscription</h1>
        {q.err ? <p className="err">{q.err}</p> : null}
        <form action={registerAction}>
          <label>Nom<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Mot de passe<input name="password" type="password" minLength={8} required /></label>
          <label>Confirmation<input name="confirm" type="password" minLength={8} required /></label>
          <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            <input name="terms" type="checkbox" required style={{ width: "auto" }} /> J’accepte les conditions
          </label>
          <button className="btn" type="submit">Créer mon compte</button>
        </form>
        <p className="muted">Déjà inscrit ? <Link href="/connexion">Connexion</Link></p>
      </div>
    </main>
  );
}
