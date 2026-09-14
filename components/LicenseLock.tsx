import Link from "next/link";

export function LicenseLock({ title }: { title: string }) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p className="muted">Sous réserve de licence. Active un code 7 ou 30 jours pour ouvrir cet espace.</p>
      <Link className="btn" href="/abonnement">Activer une licence</Link>
    </article>
  );
}
