import { sql } from "./db";
import { ensureLaunchTickets } from "./bootstrap";

let ready = false;

export async function ensureSchema() {
  if (ready) return;
  await sql()`CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY, email text UNIQUE NOT NULL, name text NOT NULL,
    password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
  await sql()`CREATE TABLE IF NOT EXISTS sessions (
    token text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL)`;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false`;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS odd text NOT NULL DEFAULT ''`;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS confidence text NOT NULL DEFAULT ''`;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS stake_units text NOT NULL DEFAULT '1'`;
  await sql()`CREATE INDEX IF NOT EXISTS pronos_created_at_idx ON pronos (created_at DESC)`;
  await sql()`CREATE INDEX IF NOT EXISTS pronos_sport_created_at_idx ON pronos (sport, created_at DESC)`;
  await sql()`CREATE INDEX IF NOT EXISTS pronos_status_result_idx ON pronos (status, result)`;
  await sql()`CREATE TABLE IF NOT EXISTS analyses (
    id uuid PRIMARY KEY, title text NOT NULL, slug text UNIQUE NOT NULL,
    sport text NOT NULL DEFAULT '', body text NOT NULL, status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now())`;
  await sql()`CREATE TABLE IF NOT EXISTS favorites (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prono_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, prono_id))`;
  await sql()`CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL, subject text NOT NULL,
    body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
  await sql()`CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY, actor text NOT NULL, action text NOT NULL,
    resource text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
  await sql()`CREATE TABLE IF NOT EXISTS votes (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prono_id uuid NOT NULL,
    choice text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, prono_id))`;
  await sql()`CREATE TABLE IF NOT EXISTS password_resets (
    id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text NOT NULL, expires_at timestamptz NOT NULL,
    used boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now())`;
  ready = true;
  await ensureLaunchTickets();
}
