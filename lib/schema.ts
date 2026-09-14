import { hasDatabase, sql } from "./db";
import { ensureLaunchTickets } from "./bootstrap";
import { seedDefaultOffers } from "./offers";

let ready = false;

export async function ensureSchema() {
  if (ready) return;
  if (!hasDatabase()) return;

  await Promise.all([
    sql()`CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY, email text UNIQUE NOT NULL, name text NOT NULL,
      password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`ALTER TABLE users ADD COLUMN IF NOT EXISTS public_id text`,
    sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false`,
    sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS odd text NOT NULL DEFAULT ''`,
    sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS confidence text NOT NULL DEFAULT ''`,
    sql()`ALTER TABLE pronos ADD COLUMN IF NOT EXISTS stake_units text NOT NULL DEFAULT '1'`,
    sql()`CREATE INDEX IF NOT EXISTS pronos_created_at_idx ON pronos (created_at DESC)`,
    sql()`CREATE INDEX IF NOT EXISTS pronos_sport_created_at_idx ON pronos (sport, created_at DESC)`,
    sql()`CREATE INDEX IF NOT EXISTS pronos_status_result_idx ON pronos (status, result)`,
    sql()`CREATE TABLE IF NOT EXISTS analyses (
      id uuid PRIMARY KEY, title text NOT NULL, slug text UNIQUE NOT NULL,
      sport text NOT NULL DEFAULT '', body text NOT NULL, status text NOT NULL DEFAULT 'draft',
      created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS contact_messages (
      id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL, subject text NOT NULL,
      body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS audit_logs (
      id uuid PRIMARY KEY, actor text NOT NULL, action text NOT NULL,
      resource text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS offers (
      id uuid PRIMARY KEY,
      type text NOT NULL,
      title text NOT NULL,
      description text NOT NULL DEFAULT '',
      price text NOT NULL DEFAULT '',
      currency text NOT NULL DEFAULT 'XOF',
      period text NOT NULL DEFAULT '',
      cadence text NOT NULL DEFAULT '',
      steps int NOT NULL DEFAULT 0,
      active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS site_settings (
      key text PRIMARY KEY,
      value text NOT NULL DEFAULT '')`,
    sql()`CREATE TABLE IF NOT EXISTS admin_sessions (
      id uuid PRIMARY KEY,
      ok boolean NOT NULL,
      note text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS licenses (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      days int NOT NULL,
      starts_at timestamptz NOT NULL DEFAULT now(),
      ends_at timestamptz NOT NULL,
      note text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now())`,
  ]);

  await sql()`CREATE UNIQUE INDEX IF NOT EXISTS users_public_id_idx ON users (public_id) WHERE public_id IS NOT NULL`;

  await Promise.all([
    sql()`CREATE TABLE IF NOT EXISTS sessions (
      token text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at timestamptz NOT NULL)`,
    sql()`CREATE TABLE IF NOT EXISTS favorites (
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prono_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, prono_id))`,
    sql()`CREATE TABLE IF NOT EXISTS votes (
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prono_id uuid NOT NULL,
      choice text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, prono_id))`,
    sql()`CREATE TABLE IF NOT EXISTS password_resets (
      id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash text NOT NULL, expires_at timestamptz NOT NULL,
      used boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS orders (
      id uuid PRIMARY KEY,
      user_id uuid REFERENCES users(id) ON DELETE SET NULL,
      offer_id uuid,
      amount text NOT NULL DEFAULT '',
      currency text NOT NULL DEFAULT 'XOF',
      status text NOT NULL DEFAULT 'pending',
      created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS subscriptions (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      offer_id uuid,
      status text NOT NULL DEFAULT 'inactive',
      created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS payments (
      id uuid PRIMARY KEY,
      order_id uuid,
      amount text NOT NULL DEFAULT '',
      provider text NOT NULL DEFAULT '',
      reference text NOT NULL DEFAULT '',
      status text NOT NULL DEFAULT 'off',
      created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS notifications (
      id uuid PRIMARY KEY,
      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
      title text NOT NULL,
      body text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now())`,
    sql()`CREATE TABLE IF NOT EXISTS waitlist_signups (
      id uuid PRIMARY KEY,
      email text NOT NULL,
      offer_id uuid,
      created_at timestamptz NOT NULL DEFAULT now())`,
  ]);

  ready = true;
  await ensureLaunchTickets();
  await seedDefaultOffers();
}
