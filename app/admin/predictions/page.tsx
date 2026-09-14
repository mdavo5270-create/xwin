import Link from "next/link";
import { listAllPronosPage } from "@/lib/store";
import { adminHref } from "@/lib/admin-path";
import { sportLabel } from "@/lib/sports";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 80;

function category(pick: string) {
  const i = pick.indexOf(" · ");
  return i === -1 ? "Autres" : pick.slice(0, i);
}

export default async function Page() {
  const { rows, total } = await listAllPronosPage({ limit: PAGE_SIZE, offset: 0 });
  const groups = new Map<string, typeof rows>();
  for (const p of rows) {
    const key = `${sportLabel(p.sport)} · ${category(p.pick)}`;
    const list = groups.get(key) ?? [];
    list.push(p);
    groups.set(key, list);
  }
  return (
    <>
      <h1>Pronostics</h1>
      <div className="admin-actions">
        <Link className="btn" href={adminHref("predictions/new")}>Nouveau</Link>
      </div>
      <p className="muted">{total} tickets, classés par sport et marché.</p>
      {rows.length === 0 ? <p className="empty">Aucun.</p> : [...groups.entries()].map(([label, list]) => (
        <section key={label} style={{ marginBottom: "1.4rem" }}>
          <h2>{label}</h2>
          <div className="admin-tiles">
            {list.map((p) => (
              <Link className="admin-tile" key={p.id} href={adminHref(`predictions/${p.id}`)}>
                <strong>{p.eventName}</strong>
                <div className="muted">{p.competition} · {p.pick}</div>
                <div className="muted">{p.isPaid ? "Premium" : "Gratuit"} · {p.result}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
