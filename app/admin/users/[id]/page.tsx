import { listUsers } from "@/lib/admin-data";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = (await listUsers()).find((x) => x.id === id);
  if (!u) notFound();
  return (<><h1>{u.name}</h1><section className="card"><p>{u.email}</p><p className="muted">Inscrit : {u.createdAt}</p><p>Achats / abo : néant (paiement off).</p></section></>);
}
