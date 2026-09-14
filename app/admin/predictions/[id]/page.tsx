import Link from "next/link";
import { notFound } from "next/navigation";
import { getProno } from "@/lib/store";
import { updatePronoAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";
import { PronoForm } from "../PronoForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProno(id);
  if (!p) notFound();
  return (
    <>
      <div className="admin-actions"><Link className="btn ghost" href={adminHref("predictions")}>Retour</Link></div>
      <h1>Modifier le pronostic</h1>
      <PronoForm action={updatePronoAction} p={p} submitLabel="Enregistrer" />
    </>
  );
}
