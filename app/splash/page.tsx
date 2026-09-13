import Link from "next/link";

export default function SplashPage() {
  return (
    <main className="splash">
      <div>
        <h1>XWIN</h1>
        <p>Pronos · Montantes</p>
        <Link className="btn gold" href="/onboarding" style={{ marginTop: "1.4rem" }}>
          Commencer
        </Link>
      </div>
    </main>
  );
}
