export type PronoStatus = "draft" | "published" | "settled";
export type PronoResult = "pending" | "hit" | "miss" | "void";
export type MontanteCadence = "weekly" | "monthly";
export type MontanteStatus = "draft" | "open" | "closed";

export type Member = { id: string; email: string; name: string };

export type Prono = {
  id: string;
  sport: string;
  competition: string;
  eventName: string;
  kickoff: string;
  pick: string;
  rationale: string;
  status: PronoStatus;
  result: PronoResult;
  followCount: number;
  isPaid: boolean;
  odd: string;
  confidence: string;
  stakeUnits: string;
  createdAt: string;
};

export type Montante = {
  id: string;
  title: string;
  cadence: MontanteCadence;
  steps: number;
  entryAmount: string;
  currency: string;
  description: string;
  status: MontanteStatus;
  createdAt: string;
};
