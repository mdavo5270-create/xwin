import Link from "next/link";
import { createPronoAction } from "@/app/admin/actions";
import { adminHref } from "@/lib/admin-path";
import { PronoForm } from "../PronoForm";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const kick = q.kickoff ? new Date(q.kickoff) : null;
  const prefill = {
    id: "",
    sport: q.sport || "",
    competition: q.competition || "",
    eventName: [q.home, q.away].filter(Boolean).join(" vs "),
    kickoff: kick && !Number.isNaN(kick.getTime()) ? kick.toISOString() : q.kickoff || "",
    pick: "",
    rationale: "",
    status: "published" as const,
    result: "pending" as const,
    followCount: 0,
    isPaid: false,
    odd: "",
    confidence: "3",
    stakeUnits: "1",
    createdAt: new Date().toISOString(),
  };
  return (
    <>
      <div className="admin-actions"><Link className="btn ghost" href={adminHref("predictions")}>Retour</Link></div>
      <h1>{q.home ? "Nouveau ticket sur ce match" : "Nouveau pronostic"}</h1>
      <p className="muted">Pour ajouter un 2e, 3e, 10e ticket : mêmes équipes, même date, autre marché + autre pronostic.</p>
      <PronoForm action={createPronoAction} p={q.sport ? prefill : undefined} submitLabel="Publier" />
    </>
  );
}
