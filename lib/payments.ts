import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";
import { createSoftpay, saspayConfigured } from "./saspay";
import type { Member } from "./types";

export const LICENSE_PRICES: Record<7 | 30, { amount: string; label: string }> = {
  7: { amount: "4900.00", label: "Licence 7 jours" },
  30: { amount: "14900.00", label: "Licence 30 jours" },
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] || "Client";
  const last = parts.slice(1).join(" ") || "XWIN";
  return { first, last };
}

function normalizePhoneBj(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("229") && digits.length >= 11) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+229${digits.slice(1)}`;
  if (digits.length === 8) return `+229${digits}`;
  if (digits.length === 10 && !digits.startsWith("0")) return `+229${digits}`;
  if (phone.trim().startsWith("+")) return phone.trim();
  return `+${digits}`;
}

export async function initiateLicensePayment(input: {
  member: Member;
  days: 7 | 30;
  phone: string;
  network?: string;
}) {
  if (!saspayConfigured()) {
    return { ok: false as const, error: "Paiement non configuré (SASPAY_SECRET_KEY)." };
  }
  if (!hasDatabase()) {
    return { ok: false as const, error: "Base de données indisponible." };
  }
  await ensureSchema();

  const price = LICENSE_PRICES[input.days];
  const phone = normalizePhoneBj(input.phone);
  if (phone.replace(/\D/g, "").length < 10) {
    return { ok: false as const, error: "Numéro MTN invalide." };
  }

  const network = input.network || "mtn_bj";
  const orderId = randomUUID();
  const paymentId = randomUUID();
  const { first, last } = splitName(input.member.name);

  await sql()`
    insert into orders (id, user_id, amount, currency, status)
    values (${orderId}, ${input.member.id}, ${price.amount}, 'XOF', 'pending')
  `;
  await sql()`
    insert into payments (id, order_id, amount, provider, reference, status)
    values (${paymentId}, ${orderId}, ${price.amount}, 'saspay', '', 'pending')
  `;

  const soft = await createSoftpay({
    amount: price.amount,
    currency: "XOF",
    country: "BJ",
    network,
    description: `${price.label} XWIN (${input.member.publicId || input.member.id.slice(0, 8)})`,
    customer: {
      email: input.member.email,
      first_name: first,
      last_name: last,
      phone,
    },
    metadata: {
      xwin_payment_id: paymentId,
      xwin_order_id: orderId,
      xwin_user_id: input.member.id,
      xwin_days: String(input.days),
    },
  });

  if (!soft.ok) {
    await sql()`update orders set status = 'failed' where id = ${orderId}`;
    await sql()`update payments set status = 'failed' where id = ${paymentId}`;
    return { ok: false as const, error: soft.error };
  }

  await sql()`
    update payments
    set reference = ${soft.data.id}, status = ${soft.data.status || "pending"}
    where id = ${paymentId}
  `;

  return {
    ok: true as const,
    paymentId,
    orderId,
    saspayId: soft.data.id,
    status: soft.data.status,
    checkoutUrl: soft.data.checkout_url || "",
    amount: price.amount,
    days: input.days,
  };
}

export async function completePaymentBySaspayId(saspayId: string, status: string) {
  if (!hasDatabase() || !saspayId) return { ok: false as const, error: "missing" };
  await ensureSchema();

  const rows = await sql()`
    select p.id, p.order_id, p.status, p.amount, o.user_id
    from payments p
    left join orders o on o.id = p.order_id
    where p.reference = ${saspayId}
    limit 1
  `;
  const row = rows[0] as
    | { id: string; order_id: string; status: string; amount: string; user_id: string | null }
    | undefined;
  if (!row) return { ok: false as const, error: "payment_not_found" };
  if (row.status === "paid" || row.status === "success") {
    return { ok: true as const, already: true as const };
  }

  const ok = /success|successful|paid|completed/i.test(status);
  if (!ok) {
    await sql()`update payments set status = ${status || "failed"} where id = ${row.id}`;
    if (row.order_id) await sql()`update orders set status = 'failed' where id = ${row.order_id}`;
    return { ok: true as const, activated: false as const };
  }

  await sql()`update payments set status = 'paid' where id = ${row.id}`;
  if (row.order_id) await sql()`update orders set status = 'paid' where id = ${row.order_id}`;

  const amount = String(row.amount || "");
  const days: 7 | 30 = amount.startsWith("14900") ? 30 : 7;
  const userId = row.user_id;
  if (userId) {
    await sql()`
      insert into licenses (id, user_id, days, starts_at, ends_at, note)
      values (
        ${randomUUID()},
        ${userId},
        ${days},
        now(),
        now() + (${String(days)} || ' days')::interval,
        ${`saspay:${saspayId}`}
      )
    `;
  }

  return { ok: true as const, activated: Boolean(userId), days };
}
