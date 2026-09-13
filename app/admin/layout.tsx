import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { loginAction } from "./actions";
import { AdminChrome } from "@/components/AdminChrome";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminConfigured()) {
    return (
      <main className="wrap">
        <p className="empty">ADMIN_SECRET manquant.</p>
      </main>
    );
  }

  const ok = await isAdmin();
  if (!ok) {
    // Porte d'entrée unique : tant que l'admin n'est pas authentifié,
    // AUCUNE sous-page (children) n'est rendue, quelle que soit l'URL visitée.
    return (
      <main className="auth">
        <form action={loginAction} className="auth-card">
          <h1>Admin</h1>
          <label>
            Mot de passe équipe
            <input name="password" type="password" required />
          </label>
          <button className="btn" type="submit">Entrer</button>
        </form>
      </main>
    );
  }

  return <AdminChrome>{children}</AdminChrome>;
}
