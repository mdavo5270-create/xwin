import { listAllMontantes, countAllPronos } from "@/lib/store";
import { countUsers } from "@/lib/admin-data";
import { ensureSchema } from "@/lib/schema";
import { adminHref } from "@/lib/admin-path";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function AdminHome() {
  await ensureSchema();
  const users = await countUsers();
  const pronosCount = await countAllPronos();
  const montantes = await listAllMontantes();
  return (<><h1>Vue générale</h1><div className="grid two"><div className="card">Utilisateurs {users}</div><div className="card">Pronostics {pronosCount}</div><div className="card">Montantes {montantes.length}</div><div className="card">Revenus — (paiement off)</div></div><p style={{ marginTop: "1rem" }}><Link href={adminHref("predictions")}>Gérer les pronostics</Link></p></>);
}
