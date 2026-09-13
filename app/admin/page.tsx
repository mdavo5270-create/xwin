import { listAllMontantes, listAllPronos } from "@/lib/store";
import { countUsers } from "@/lib/admin-data";
import { ensureSchema } from "@/lib/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

// L'authentification est désormais garantie par app/admin/layout.tsx :
// cette page ne peut jamais être rendue pour un visiteur non-admin.
export default async function AdminHome() {
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
