import { TopBar } from "@/components/Nav";

export default function AidePage() {
  return (
    <>
      <TopBar title="Aide" back="/compte" />
      <main className="wrap">
        <div className="card">
          <h2>Comment ça marche</h2>
          <p className="muted">L’admin publie match + prono + pourquoi. Tu peux suivre. XWIN n’est pas un bookmaker.</p>
        </div>
        <div className="card" style={{ marginTop: "0.7rem" }}>
          <h2>Montantes</h2>
          <p className="muted">Paliers définis par l’équipe. Encaissement désactivé.</p>
        </div>
      </main>
    </>
  );
}
