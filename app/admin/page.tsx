import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { loginAction } from "./actions";
import { listAllMontantes, listAllPronos } from "@/lib/store";
import { countUsers } from "@/lib/admin-data";
import { ensureSchema } from "@/lib/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!isAdminConfigured()) {
    return <main className="wrap"><p className="empty">ADMIN_SECRET manquant.</p></main>;
  }
  if (!(await isAdmin())) {
    return (
      <main className="auth">
        <form action={loginAction} className="auth-card">
          <h1>Admin</h1>
          <label>Mot de passe équipe<input name="password" type="password" required /></label>
          <button className="btn" type="submit">Entrer</button>
        </form>
      </main>
    );
  }
  await ensureSchema();
  const users = await countUsers();
  const pronos = await listAllPronos();
  const montantes = await listAllMontantes();
  return (
    <>
      <h1>Vue générale</h1>
      <div className="grid two">
        <div className="card">Utilisateurs {users}</div>
        <div className="card">Pronostics {pronos.length}</div>
        <div className="card">Montantes {montantes.length}</div>
        <div className="card">Revenus — (paiement off)</div>
      </div>
      <p style={{ marginTop: "1rem" }}><Link href="/admin/predictions">Gérer les pronostics</Link></p>
    </>
  );
}
