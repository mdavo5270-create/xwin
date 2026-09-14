import Link from "next/link";
import { requestResetAction } from "./actions";

export default async function ForgotPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; link?: string; err?: string }>;
}) {
  const q = await searchParams;
  return (
    <main className="auth">
      <div className="auth-card">
        <p><Link href="/connexion">← Connexion</Link></p>
        <p className="eyebrow">XWIN</p>
        <h1>Mot de passe oublié</h1>
        {q.err ? <p className="err">{q.err}</p> : null}
        {q.sent ? (
          <>
            <p className="muted">
              Si un compte existe avec cet email, un lien de réinitialisation valable 1 heure vient d’être envoyé.
            </p>
            {q.link ? (
              <div className="empty" style={{ marginTop: "1rem" }}>
                <p className="muted">
                  Envoi d’email pas encore branché (aucune clé configurée) — lien temporaire pour continuer :
                </p>
                <p style={{ wordBreak: "break-all" }}><Link href={q.link}>{q.link}</Link></p>
              </div>
            ) : null}
          </>
        ) : (
          <form action={requestResetAction}>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <button className="btn" type="submit">Envoyer le lien</button>
          </form>
        )}
      </div>
    </main>
  );
}
