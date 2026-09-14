import { sql } from "./db";
import { ensureLaunchTickets } from "./bootstrap";

let ready = false;

/**
 * Idempotent (CREATE/ALTER ... IF NOT EXISTS), donc sans risque à ré-appeler.
 *
 * Avant ce correctif : 12 instructions DDL enchaînées avec `await` une par
 * une, soit 12 allers-retours HTTP séquentiels vers Neon à chaque cold
 * start serverless (le driver Neon serverless fait un round-trip HTTP par
 * requête, il n'y a pas de connexion persistante à réutiliser). Sur un
 * accueil sans prono, ça s'enchaînait en plus avec ensureLaunchTickets()
 * (1 SELECT + 4 INSERT séquentiels) : ~17 allers-retours au total avant
 * le premier rendu. Terrain favorable à un flux RSC trop lent qui se fait
 * couper.
 *
 * Ici : deux vagues exécutées en parallèle (Promise.all). Vague 2 après
 * vague 1 uniquement parce que sessions/favorites/votes/password_resets
 * référencent users(id) par clé étrangère : sur une base neuve, `users`
 * doit exister avant de créer ces tables. Le reste n'a aucune dépendance
 * croisée et peut partir en même temps.
 */
export async function ensureSchema() {
  if (ready) return;

  await Promise.all([
    sql()`CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY, email text UNIQUE NOT NULL, name text NOT NULL,
      password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
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
  ]);

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
  ]);

  ready = true;
  await ensureLaunchTickets();
}
