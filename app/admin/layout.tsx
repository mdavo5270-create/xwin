import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { loginAction } from "./actions";
import { AdminChrome } from "@/components/AdminChrome";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminConfigured()) {
    return (
      <main className="wrap">
        <p className="empty">Configuration incomplète.</p>
      </main>
    );
  }

  const ok = await isAdmin();
  if (!ok) {
    return (
      <main className="auth">
        <form action={loginAction} className="auth-card">
          <h1>Accès</h1>
          <label>
            Mot de passe
            <input name="password" type="password" required autoComplete="current-password" />
          </label>
          <button className="btn" type="submit">Entrer</button>
        </form>
      </main>
    );
  }

  return <AdminChrome>{children}</AdminChrome>;
}
