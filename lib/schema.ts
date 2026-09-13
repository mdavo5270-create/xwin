import { sql } from "./db";

let ready = false;

export async function ensureSchema() {
  if (ready) return;
  await sql()`CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql()`CREATE TABLE IF NOT EXISTS sessions (
    token text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL
  )`;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false`;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS odd text NOT NULL DEFAULT ''`;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS confidence text NOT NULL DEFAULT ''`;
  await sql()`CREATE TABLE IF NOT EXISTS analyses (
    id uuid PRIMARY KEY,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    sport text NOT NULL DEFAULT '',
    body text NOT NULL,
    status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql()`CREATE TABLE IF NOT EXISTS favorites (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prono_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, prono_id)
  )`;
  await sql()`CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  ready = true;
}
