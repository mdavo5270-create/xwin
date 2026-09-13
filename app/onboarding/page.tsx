import Link from "next/link";
import { TopBar } from "@/components/Nav";

export default function OnboardingPage() {
  return (
    <>
      <TopBar title="Bienvenue" back="/splash" />
      <main className="wrap">
        <div className="card">
          <h2>1. Skill et analyse</h2>
          <p className="muted">On publie un prono + le pourquoi. Ce n’est pas un bookmaker.</p>
        </div>
        <div className="card" style={{ marginTop: "0.7rem" }}>
          <h2>2. Tu suis ou non</h2>
          <p className="muted">Le vote « je suis » compte les personnes qui suivent le pick.</p>
        </div>
        <div className="card" style={{ marginTop: "0.7rem" }}>
          <h2>3. Montantes</h2>
          <p className="muted">Paliers hebdo / mensuel. Paiement encore coupé.</p>
        </div>
        <Link className="btn" href="/" style={{ marginTop: "1rem" }}>Entrer</Link>
      </main>
    </>
  );
}
