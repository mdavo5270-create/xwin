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
  return (
    <>
      <h1>Pronostics</h1>
      <div className="admin-actions">
        <Link className="btn" href={adminHref("predictions/new")}>Nouveau</Link>
      </div>
      <p className="muted">{total} au total · page {page} / {pageCount}</p>
      {rows.length === 0 ? <p className="empty">Aucun.</p> : (
        <div className="admin-tiles">
          {rows.map((p) => (
            <Link className="admin-tile" key={p.id} href={adminHref(`predictions/${p.id}`)}>
              <strong>{p.eventName}</strong>
              <div className="muted">{p.sport} · {p.competition}</div>
              <div className="muted">{p.isPaid ? "Premium" : "Gratuit"} · {p.status} · {p.result}</div>
              <div className="muted" style={{ marginTop: ".4rem" }}>Modifier</div>
            </Link>
          ))}
        </div>
      )}
      {pageCount > 1 ? (
        <div className="admin-actions">
          {page > 1 ? <Link className="btn ghost" href={`${adminHref("predictions")}?page=${page - 1}`}>Précédent</Link> : null}
          {page < pageCount ? <Link className="btn ghost" href={`${adminHref("predictions")}?page=${page + 1}`}>Suivant</Link> : null}
        </div>
      ) : null}
    </>
  );
}
