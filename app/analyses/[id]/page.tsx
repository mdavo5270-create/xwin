import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { getAnalysis } from "@/lib/editorial";
import { formatDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const member = await getMember();
  const { id } = await params;
  const a = await getAnalysis(id);
  if (!a || a.status !== "published") notFound();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href="/analyses">← Analyses</Link></p>
        <h1>{a.title}</h1>
        <p className="muted">{a.sport} · {formatDate(a.createdAt)}</p>
        <article className="card" style={{ whiteSpace: "pre-wrap" }}>{a.body}</article>
        <p style={{ marginTop: "1rem" }}><Link href="/premium">Découvrir Premium</Link></p>
      </main>
    </PublicChrome>
  );
}
