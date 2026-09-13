import { createHmac, timingSafeEqual } from "crypto";

/**
 * Compare deux chaînes en temps constant, y compris quand leurs longueurs
 * diffèrent (ce que `crypto.timingSafeEqual` seul ne permet pas : il lève
 * une exception si les buffers n'ont pas la même taille, et un check de
 * longueur préalable fuite déjà un peu d'information par timing).
 *
 * On hash les deux valeurs (sortie de taille fixe) avant de les comparer,
 * ce qui neutralise toute différence de longueur de l'entrée d'origine.
 */
export function safeCompare(a: string, b: string) {
  const ha = createHmac("sha256", "safe-compare").update(a).digest();
  const hb = createHmac("sha256", "safe-compare").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Compare deux chaînes de longueur attendue identique (ex : deux signatures
 * hex de même algorithme) en temps constant.
 */
export function safeCompareEqualLength(a: string, b: string) {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
