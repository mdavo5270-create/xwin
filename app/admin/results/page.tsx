import { listAllPronos } from "@/lib/store";
export const dynamic = "force-dynamic";
export default async function Page() {
  const rows = await listAllPronos();
  return (<><h1>Résultats</h1>{rows.length === 0 ? <p className="empty">Aucun prono à solder.</p> : <div className="grid">{rows.map((p) => <div className="card" key={p.id}><strong>{p.eventName}</strong><div className="muted">{p.result}</div></div>)}</div>}</>);
}
