import { createHmac, randomUUID, timingSafeEqual } from "crypto";

const BASE = "https://api.saspay.me/api/v1";

export type SoftpayInput = {
  amount: string;
  currency?: string;
  country?: string;
  network: string;
  description: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  metadata?: Record<string, string>;
};

export type SoftpayResult = {
  id: string;
  status: string;
  checkout_url?: string;
  message?: string;
};

function apiKey() {
  return process.env.SASPAY_SECRET_KEY || "";
}

export function saspayConfigured() {
  return Boolean(apiKey());
}

export async function createSoftpay(input: SoftpayInput): Promise<
  | { ok: true; data: SoftpayResult }
  | { ok: false; error: string; status?: number }
> {
  const key = apiKey();
  if (!key) return { ok: false, error: "SASPAY_SECRET_KEY manquante." };

  const body = {
    amount: input.amount,
    currency: input.currency || "XOF",
    country: input.country || "BJ",
    network: input.network,
    description: input.description,
    customer: input.customer,
    metadata: input.metadata || {},
  };

  const res = await fetch(`${BASE}/payments/softpay/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": randomUUID(),
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    data?: SoftpayResult;
    message?: string;
    error?: { message?: string; code?: string };
    id?: string;
    status?: string;
    checkout_url?: string;
  };

  // SasPay peut renvoyer { success, data } ou un objet plat selon versions.
  const data: SoftpayResult | undefined =
    json.data ??
    (json.id
      ? { id: json.id, status: String(json.status || "PENDING"), checkout_url: json.checkout_url, message: json.message }
      : undefined);

  if (!res.ok || !data?.id) {
    const msg =
      json.error?.message || json.message || `SasPay HTTP ${res.status}`;
    return { ok: false, error: msg, status: res.status };
  }

  return { ok: true, data };
}

export async function verifyPayment(paymentId: string) {
  const key = apiKey();
  if (!key) return { ok: false as const, error: "SASPAY_SECRET_KEY manquante." };
  const res = await fetch(`${BASE}/payments/${paymentId}/verify/`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: { id?: string; status?: string };
    status?: string;
    id?: string;
  };
  const status = String(json.data?.status || json.status || "");
  if (!res.ok) return { ok: false as const, error: `verify ${res.status}` };
  return { ok: true as const, status, id: String(json.data?.id || json.id || paymentId) };
}

/** Signature webhook : hmac_sha256(secret, `${timestamp}.${rawBody}`) en hex minuscule. */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  timestampHeader: string,
  secret: string,
  toleranceSeconds = 300,
) {
  if (!secret || !signatureHeader || !timestampHeader) return false;
  const ts = Number(timestampHeader);
  if (!Number.isFinite(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > toleranceSeconds) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestampHeader}.${rawBody}`)
    .digest("hex");

  try {
    const a = Buffer.from(signatureHeader, "utf8");
    const b = Buffer.from(expected, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
