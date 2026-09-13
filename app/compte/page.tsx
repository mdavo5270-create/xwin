import Link from "next/link";
import { TabBar, TopBar } from "@/components/Nav";

export default function ComptePage() {
  return (
    <>
      <TopBar title="Compte" />
      <main className="wrap">
        <section className="card">
          <strong>Invité</strong>
          <p className="muted">Les comptes membres arriveront avec le paiement.</p>
        </section>
        <div className="grid" style={{ marginTop: "0.7rem" }}>
          <Link className="card" href="/notifications">Notifications</Link>
          <Link className="card" href="/aide">Aide</Link>
          <Link className="card" href="/legal">Mentions</Link>
          <Link className="card" href="/onboarding">Revoir l’intro</Link>
          <Link className="card" href="/admin">Espace équipe</Link>
        </div>
      </main>
      <TabBar active="compte" />
    </>
  );
}
