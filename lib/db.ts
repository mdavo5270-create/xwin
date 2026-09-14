import { neon } from "@neondatabase/serverless";

export function databaseUrl() {
  const url = process.env.DATABASE_URL ?? "";
  return url.startsWith("postgres") ? url : "";
}

export function hasDatabase() {
  return Boolean(databaseUrl());
}

export function sql() {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL manquante");
  return neon(url);
}
