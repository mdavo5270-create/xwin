import Link from "next/link";
import { listAllPronosPage } from "@/lib/store";
import { adminHref } from "@/lib/admin-path";
export const dynamic = "force-dynamic";
const PAGE_SIZE = 30;
export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { rows, total } = await listAllPronosPage({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (<><h1>Pronostics</h1><p><Link className="btn" href={adminHref("predictions/new")}>+ Nouveau</Link></p><p className="muted">{total} pronostics au total · page {page} sur {pageCount}</p>{rows.length === 0 ? <p className="empty">Aucun.</p> : <div className="grid">{rows.map((p) => <div className="card" key={p.id}><strong>{p.eventName}</strong><div className="muted">{p.sport} · {p.isPaid ? "premium" : "gratuit"} · {p.status}</div></div>)}</div>}{pageCount > 1 ? <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>{page > 1 ? <Link className="btn ghost" href={`${adminHref("predictions")}?page=${page - 1}`}>← Précédent</Link> : null}{page < pageCount ? <Link className="btn ghost" href={`${adminHref("predictions")}?page=${page + 1}`}>Suivant →</Link> : null}</div> : null}</>);
}
