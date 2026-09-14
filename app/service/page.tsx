import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import "../browse.css";

const STRATEGIES = [
  {
    title: "Stratégie Martingale",
    price: "9 900 F",
    period: "/ mois",
    text: "Progression de mise encadrée après chaque échec, avec seuil d’arrêt fixé à l’avance.",
  },
  {
    title: "Stratégie Image",
    price: "9 900 F",
    period: "/ mois",
    text: "Lecture de forme et de contexte d’un match avant la cote, sans mise progressive.",
  },
] as const;

export default async function ServicePage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <section className="billboard">
        <p className="kicker">Service</p>
        <h1>Nos stratégies, expliquées avant d’être vendues.</h1>
        <p className="meta">Les prix sont affichés. L’encaissement reste coupé.</p>
      </section>
      <main className="wrap">
        <div className="grid two">
          {STRATEGIES.map((strat) => (
            <section className="card" key={strat.title}>
              <h3>{strat.title}</h3>
              <p className="vs"><span>{strat.price}</span><span>{strat.period}</span></p>
              <p className="muted">{strat.text}</p>
              <Link className="btn ghost" href="/inscription">Me prévenir</Link>
            </section>
          ))}
        </div>
      </main>
    </PublicChrome>
  );
}
