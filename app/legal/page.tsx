import { TopBar } from "@/components/Nav";

export default function LegalPage() {
  return (
    <>
      <TopBar title="Mentions" back="/compte" />
      <main className="wrap">
        <div className="card">
          <p>18+ uniquement. Analyses et pronos informatifs. XWIN n’accepte pas de mises et n’est pas un opérateur de paris.</p>
        </div>
      </main>
    </>
  );
}
