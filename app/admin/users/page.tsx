import { listUsers } from "@/lib/admin-data";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Page() {
  const rows = await listUsers();
  return (
    <>
      <h1>Utilisateurs</h1>
      {rows.length === 0 ? <p className="empty">Aucun compte membre.</p> : (
        <div className="grid">{rows.map((u) => (
          <Link key={u.id} className="card" href={`/admin/users/${u.id}`} style={{ color: "inherit", textDecoration: "none" }}>
            <strong>{u.name}</strong>
            <div className="muted">{u.email}</div>
          </Link>
        ))}</div>
      )}
    </>
  );
}
