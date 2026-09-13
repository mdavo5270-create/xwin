export default function ForgotPage() {
  return (
    <main className="auth">
      <div className="auth-card">
        <h1>Mot de passe oublié</h1>
        <p className="muted">L’envoi d’email n’est pas encore branché (pas de clé SMTP). Contacte l’admin pour réinitialiser.</p>
        <form>
          <label>Email<input type="email" required /></label>
          <button className="btn off" type="button" disabled>Envoyer le lien</button>
        </form>
      </div>
    </main>
  );
}
