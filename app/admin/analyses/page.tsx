import { listAnalyses } from "@/lib/editorial";
export const dynamic = "force-dynamic";
export default async function Page() {
  const rows = await listAnalyses();
  return (<><h1>Analyses</h1>{rows.length === 0 ? <p className="empty">Aucune analyse. Le formulaire de création arrive ensuite.</p> : <div className="grid">{rows.map((a) => <div className="card" key={a.id}><strong>{a.title}</strong></div>)}</div>}</>);
}
