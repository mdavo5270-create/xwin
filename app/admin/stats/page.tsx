import { countUsers } from "@/lib/admin-data";
import { listAllPronos } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function Page() {
  const users = await countUsers();
  const pronos = await listAllPronos();
  return (<><h1>Statistiques</h1><div className="grid two"><div className="card">Utilisateurs {users}</div><div className="card">Pronos {pronos.length}</div></div></>);
}
