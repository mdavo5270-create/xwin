import Link from "next/link";
import { createPronoAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";
import { PronoForm } from "../PronoForm";

export default function Page() {
  return (
    <>
      <div className="admin-actions"><Link className="btn ghost" href={adminHref("predictions")}>Retour</Link></div>
      <h1>Nouveau pronostic</h1>
      <PronoForm action={createPronoAction} submitLabel="Publier" />
    </>
  );
}
