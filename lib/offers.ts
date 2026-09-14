import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";

export type OfferType = "montante" | "abonnement" | "service";

export type Offer = {
  id: string;
  type: OfferType;
  title: string;
  description: string;
  price: string;
  currency: string;
  period: string;
  cadence: string;
  steps: number;
  active: boolean;
  createdAt: string;
};

function mapOffer(r: Record<string, unknown>): Offer {
  return {
    id: String(r.id),
    type: r.type as OfferType,
    title: String(r.title),
    description: String(r.description ?? ""),
    price: String(r.price ?? ""),
    currency: String(r.currency ?? "XOF"),
    period: String(r.period ?? ""),
    cadence: String(r.cadence ?? ""),
    steps: Number(r.steps ?? 0),
    active: Boolean(r.active),
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}

export async function listOffers(type?: OfferType, activeOnly = false) {
  if (!hasDatabase()) return [];
  const rows = type
    ? activeOnly
      ? await sql()`select * from offers where type = ${type} and active = true order by created_at desc`
      : await sql()`select * from offers where type = ${type} order by created_at desc`
    : activeOnly
      ? await sql()`select * from offers where active = true order by created_at desc`
      : await sql()`select * from offers order by created_at desc`;
  return rows.map((r) => mapOffer(r as Record<string, unknown>));
}

export async function getOffer(id: string) {
  if (!hasDatabase()) return null;
  const rows = await sql()`select * from offers where id = ${id} limit 1`;
  return rows[0] ? mapOffer(rows[0] as Record<string, unknown>) : null;
}

export async function createOffer(input: Omit<Offer, "id" | "createdAt">) {
  const row: Offer = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  if (!hasDatabase()) return row;
  await sql()`insert into offers (id, type, title, description, price, currency, period, cadence, steps, active, created_at)
    values (${row.id}, ${row.type}, ${row.title}, ${row.description}, ${row.price}, ${row.currency}, ${row.period}, ${row.cadence}, ${row.steps}, ${row.active}, ${row.createdAt})`;
  return row;
}

export async function updateOffer(id: string, input: Partial<Omit<Offer, "id" | "createdAt">>) {
  const current = await getOffer(id);
  if (!current) return null;
  const next = { ...current, ...input };
  if (!hasDatabase()) return next;
  await sql()`update offers set type = ${next.type}, title = ${next.title}, description = ${next.description}, price = ${next.price}, currency = ${next.currency}, period = ${next.period}, cadence = ${next.cadence}, steps = ${next.steps}, active = ${next.active} where id = ${id}`;
  return getOffer(id);
}

let seeded = false;
export async function seedDefaultOffers() {
  if (seeded || !hasDatabase()) return;
  const existing = await sql()`select count(*)::int as n from offers`;
  if (Number((existing[0] as Record<string, unknown>).n) > 0) {
    seeded = true;
    return;
  }
  const defaults: Omit<Offer, "id" | "createdAt">[] = [
    { type: "abonnement", title: "Essentiel", description: "Tickets club 7 jours + historique public.", price: "4900", currency: "XOF", period: "/ sem.", cadence: "weekly", steps: 0, active: true },
    { type: "abonnement", title: "Pro", description: "Tickets, notes, montantes du mois.", price: "14900", currency: "XOF", period: "/ mois", cadence: "monthly", steps: 0, active: true },
    { type: "service", title: "Stratégie Martingale", description: "Progression de mise encadrée après chaque échec, avec seuil d’arrêt fixé à l’avance.", price: "9900", currency: "XOF", period: "/ mois", cadence: "monthly", steps: 0, active: true },
    { type: "service", title: "Stratégie Image", description: "Lecture de forme et de contexte d’un match avant la cote, sans mise progressive.", price: "9900", currency: "XOF", period: "/ mois", cadence: "monthly", steps: 0, active: true },
  ];
  for (const d of defaults) await createOffer(d);
  const montantes = await sql()`select * from montantes`.catch(() => []);
  for (const m of montantes) {
    const r = m as Record<string, unknown>;
    await createOffer({
      type: "montante",
      title: String(r.title),
      description: String(r.description ?? ""),
      price: String(r.entry_amount ?? ""),
      currency: String(r.currency ?? "XOF"),
      period: "",
      cadence: String(r.cadence ?? "weekly"),
      steps: Number(r.steps ?? 0),
      active: String(r.status) === "open",
    });
  }
  seeded = true;
}
