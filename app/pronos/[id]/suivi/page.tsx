import Link from "next/link";
import { TopBar } from "@/components/Nav";

export default async function SuiviPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <TopBar title="Suivi" back={`/pronos/${id}`} />
      <main className="wrap" style={{ textAlign: "center" }}>
        <div className="ok">✓</div>
        <h1>C’est noté</h1>
        <p className="muted">Tu suis ce prono. À toi de gérer ta mise ailleurs — XWIN n’encaisse rien.</p>
        <Link className="btn" href={`/pronos/${id}`} style={{ marginTop: "1rem" }}>Retour au prono</Link>
      </main>
    </>
  );
}
