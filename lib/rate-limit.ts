import { headers } from "next/headers";

/**
 * Rate limiting en mémoire, par IP, fenêtre glissante simple.
 *
 * IMPORTANT — limite connue : sur Vercel, chaque instance de fonction
 * serverless a sa propre mémoire. Cette protection réduit donc le débit
 * par instance mais ne donne pas une limite globale exacte si le trafic
 * est réparti sur plusieurs instances. C'est déjà un frein réel contre le
 * brute force / spam automatisé à faible coût, mais si le trafic grossit
 * ou si une garantie stricte est nécessaire, migrer vers un store partagé
 * (Vercel KV / Upstash Redis) avec la même interface `check()`.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Ménage périodique pour ne pas faire grossir la Map indéfiniment.
function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

let lastCleanup = 0;

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * @param scope Espace de nom logique (ex: "admin-login", "register")
 * @param limit Nombre de tentatives autorisées par fenêtre
 * @param windowSeconds Durée de la fenêtre en secondes
 */
export async function rateLimit(scope: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const ip = await clientIp();
  const now = Date.now();

  if (now - lastCleanup > 60_000) {
    cleanup(now);
    lastCleanup = now;
  }

  const key = `${scope}:${ip}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}

async function clientIp(): Promise<string> {
  const h = await headers();
  // Vercel renseigne x-forwarded-for avec l'IP réelle du visiteur en tête de liste.
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
