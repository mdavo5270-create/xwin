import { hasDatabase } from "./db";
import { createProno, listAllPronos } from "./store";

let done = false;

/** Premier remplissage uniquement si la table est vide — tickets pending, aucun résultat inventé. */
export async function ensureLaunchTickets() {
  if (done) return;
  const existing = await listAllPronos();
  if (existing.length > 0) {
    done = true;
    return;
  }
  if (!hasDatabase()) {
    done = true;
    return;
  }
  const tickets = [
    {
      sport: "football",
      competition: "Ligue 1",
      eventName: "Marseille vs Lyon",
      kickoff: "2026-09-19T19:00:00+02:00",
      pick: "1",
      rationale: "OM à domicile, rythme offensif supérieur sur les 5 derniers. On prend le 1 à cote raisonnable, sans combiné.",
      status: "published" as const,
      isPaid: false,
      odd: "1.85",
      confidence: "7/10",
      stakeUnits: "1",
    },
    {
      sport: "football",
      competition: "Premier League",
      eventName: "Arsenal vs Tottenham",
      kickoff: "2026-09-20T17:30:00+01:00",
      pick: "1",
      rationale: "Derby, écart de structure en faveur d’Arsenal à l’Emirates. On reste sur le favori, unité simple.",
      status: "published" as const,
      isPaid: false,
      odd: "1.72",
      confidence: "6/10",
      stakeUnits: "1",
    },
    {
      sport: "football",
      competition: "Liga",
      eventName: "Real Sociedad vs Athletic Bilbao",
      kickoff: "2026-09-20T21:00:00+02:00",
      pick: "X",
      rationale: "Derby basque souvent fermé. Le nul est le scénario le plus propre ici.",
      status: "published" as const,
      isPaid: true,
      odd: "3.10",
      confidence: "6/10",
      stakeUnits: "0.5",
    },
    {
      sport: "tennis",
      competition: "ATP",
      eventName: "Alcaraz vs Sinner",
      kickoff: "2026-09-18T16:00:00+02:00",
      pick: "2",
      rationale: "Sur dur rapide, l’engagement au service de Sinner pèse. On prend le 2 en unité réduite.",
      status: "published" as const,
      isPaid: false,
      odd: "1.90",
      confidence: "6/10",
      stakeUnits: "0.5",
    },
  ];
  for (const t of tickets) await createProno(t);
  done = true;
}
