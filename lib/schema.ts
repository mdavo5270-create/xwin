import { sql } from "./db";

let ready = false;

export async function ensureSchema() {
  if (ready) return;
  await sql()`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      email text UNIQUE NOT NULL,
      name text NOT NULL,
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql()`
    CREATE TABLE IF NOT EXISTS sessions (
      token text PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at timestamptz NOT NULL
    )
  `;
  await sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false`;
  ready = true;
}
