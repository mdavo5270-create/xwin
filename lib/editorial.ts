import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";

export type Analysis = {
  id: string;
  title: string;
  slug: string;
  sport: string;
  body: string;
  status: string;
  createdAt: string;
};

function map(r: Record<string, unknown>): Analysis {
  return {
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    sport: String(r.sport ?? ""),
    body: String(r.body),
    status: String(r.status),
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}

export async function listAnalyses(status?: string) {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const rows = status
    ? await sql()`select * from analyses where status = ${status} order by created_at desc`
    : await sql()`select * from analyses order by created_at desc`;
  return rows.map(map);
}

export async function getAnalysis(id: string) {
  if (!hasDatabase()) return null;
  await ensureSchema();
  const rows = await sql()`select * from analyses where id = ${id} limit 1`;
  return rows[0] ? map(rows[0] as Record<string, unknown>) : null;
}

export async function createAnalysis(input: { title: string; sport: string; body: string; status: string }) {
  await ensureSchema();
  const id = randomUUID();
  const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60) + "-" + id.slice(0, 6);
  await sql()`insert into analyses (id, title, slug, sport, body, status) values (${id}, ${input.title}, ${slug}, ${input.sport}, ${input.body}, ${input.status})`;
  return id;
}

export async function saveContact(input: { name: string; email: string; subject: string; body: string }) {
  await ensureSchema();
  const id = randomUUID();
  await sql()`insert into contact_messages (id, name, email, subject, body) values (${id}, ${input.name}, ${input.email}, ${input.subject}, ${input.body})`;
}
