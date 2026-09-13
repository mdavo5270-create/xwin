export default function AbonnementsPage() {
  return (
    <>
      <h1>Abonnements</h1>
      <p className="muted">Les offres existent. L’encaissement est coupé pour l’instant.</p>
      <div className="grid two">
        <section className="card">
          <h2>Semaine</h2>
          <p>Pronos payants 7 jours.</p>
          <button className="btn off" type="button" disabled>Paiement off</button>
        </section>
        <section className="card">
          <h2>Mois</h2>
          <p>Pronos payants + montantes du mois.</p>
          <button className="btn off" type="button" disabled>Paiement off</button>
        </section>
      </div>
    </>
  );
}
