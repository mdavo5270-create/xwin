import { countUsers } from "@/lib/admin-data";
import { getPerformanceSummary } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function Page() {
  const users = await countUsers();
  const s = await getPerformanceSummary();
  return (<><h1>Statistiques</h1><div className="grid two"><div className="card">Utilisateurs {users}</div><div className="card">Publiés {s.published}</div><div className="card">Soldés {s.settled}</div><div className="card">Taux {s.rate === null ? "—" : `${s.rate}%`}</div><div className="card">Cote moy. {s.avgOdd ?? "—"}</div><div className="card">{s.sampleOk ? "Échantillon ≥ 30" : "Échantillon insuffisant"}</div></div></>);
}
