import Link from "next/link";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; next?: string }>;
}) {
  const q = await searchParams;
  return (
    <main className="auth">
      <div className="auth-card">
        <p className="eyebrow">XWIN</p>
        <h1>Connexion</h1>
        <p className="muted">Un compte est obligatoire pour ouvrir la plateforme.</p>
        {q.err ? <p className="err">{q.err}</p> : null}
        <form action={loginAction}>
          <input type="hidden" name="next" value={q.next ?? "/"} />
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Mot de passe<input name="password" type="password" required autoComplete="current-password" /></label>
          <button className="btn" type="submit">Entrer</button>
        </form>
        <p className="muted">
          Pas de compte ? <Link href="/register">Créer un compte</Link>
        </p>
      </div>
    </main>
  );
}
